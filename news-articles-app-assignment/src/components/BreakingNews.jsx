import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';
import BrokenImg from '../public/broken-image.png'

// typingEffect component for simulating typing effect
const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const index = text.indexOf('[');
    if (index !== -1) {
        text = text.substring(0, index);
    }

    let currentIndex = 0;
    // Typing effect interval to gradually display the text
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(intervalId); // Stop interval when all text is displayed
      }
    }, 50);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [text]);

  return <Typography sx={descriptionStyles} variant="body2">{displayedText}</Typography>;
};

// BreakingNews component with typing effect
const BreakingNews = ({ article }) => {
    // set image URL for the article, use BrokenImg placeholder if no image available
    const imgUrl = article.urlToImage ? article.urlToImage : BrokenImg;

    // handle article click and open in new tab
    const handleArticleClick = () => {
        window.open(article.url, '_blank', 'noopener')
    }

    return (
    <Card sx={BreakingNewsCardStyles}>
        <CardActionArea onClick={handleArticleClick} sx={CardActionAreaStyles}>
        <CardMedia
            component="img"
            sx={CardMediaStyles}
            image={imgUrl}
            alt={article.title}
        />
        <CardContent>
            <Typography variant="h6" component="div">{article.title}</Typography>
            <Typography variant="subtitle1" color="text.secondary">By: {article.author ? article.author : "Unknown"}</Typography>
            <TypingEffect text={article.content}></TypingEffect>
        </CardContent>
        </CardActionArea>
    </Card>
    );
};

// Styles for MUI
const BreakingNewsCardStyles = { 
    marginBottom: 2, 
    marginTop: 2, 
}

const CardActionAreaStyles = { 
    display: 'flex', 
    justifyContent: 'flex-start', 
    maxHeight: 200
}

const CardMediaStyles = { 
    width: '200px', 
    height: '150px',
    maxHeight: '200px',
    flexShrink: 0
}

const descriptionStyles = { 
    marginBottom: 2, 
}

export default BreakingNews;
