'use strict';

const axios = require('axios');
const express = require('express');
const router = express.Router();
const GeneralController = require('../controllers/generalController');
const { getNews, getTopHeadlines } = require('../services/newsapi');
const API_KEY = 'd06cdd7c8b334597937526058d954857';
const { Readable } = require('stream');

router.get('/health', GeneralController.getHealth);

router.get('/news', async (req, res) => {
  // Extract query parameters
  const { pageSize, page } = req.query;
  console.log('Attempting to get the latest news');
  try {
    const headlines = await getTopHeadlines(pageSize, page);
    return res.status(200).json(headlines);
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: `Failed to get top headlines: ${err}`});
  }
});

router.get('/breaking-news', async (req, res) => {
  console.log('Attempting to get the breaking news');
  const { limit } = req.query;
  try {
    const response = await getNews(limit);
    const article = response.articles[0];

    // Combine description and content for streaming
    const descriptionAndContent = `${article.description} ${article.content}`;
    // Create a Readable stream for breaking news data
    const breakingNewsStream = new Readable({
      read() {
        // Push breaking news data as JSON
        this.push(JSON.stringify({
          title: article.title,
          source: article.source.name,
          author: article.author,
          urlToImage: article.urlToImage,
          content: descriptionAndContent
        }));
        this.push(null); // Signal end of data
      }
    });
    // Set response headers
    res.set('Content-Type', 'application/json');
    // Pipe the breakingNewsStream to the response
    breakingNewsStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
