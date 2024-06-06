'use strict';

const axios = require('axios');
const API_KEY = 'd06cdd7c8b334597937526058d954857';
const NEW_API_KEY = '55f868b26ef14a609acf054dc61bb18b';

const getTopHeadlines = async (pageSize = 1, pageNumber = 1) => {
  const top_headlines_url = `https://newsapi.org/v2/top-headlines?pageSize=${pageSize}&page=${pageNumber}&country=us&apiKey=${NEW_API_KEY}`;
  try {
    const response = await axios.get(top_headlines_url);
    console.log(`Received ${response.data.articles.length} results of top headlines, from page number: ${pageNumber}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to get top headlines: ${err}`);
    throw err
  }
}

const getNews = async (desiredResults = 10) => {
  const url = `https://newsapi.org/v2/everything?q=israel&language=en&sortBy=publishedAt&apiKey=${NEW_API_KEY}`;
  try {
    const response = await axios.get(url);
    let finalData = response.data;
    finalData.articles = getRandomItems(response.data.articles, desiredResults);
    finalData.totalResults = finalData.articles.length;
    console.log(`Sending breaking news`);
    return finalData
  } catch (err) {
    console.error(`Failed to get top headlines: ${err}`);
    throw err
  }
};

function getRandomItems(arr, count) {
  let tempArray = [...arr];

  for (let i = tempArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]]; // ES6 destructuring swap
  }

  return tempArray.slice(0, count);
}

module.exports = {
  getTopHeadlines,
  getNews
};

