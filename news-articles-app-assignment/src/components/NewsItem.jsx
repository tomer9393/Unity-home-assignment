import React from 'react';
import styled from 'styled-components';
import { Card, CardContent, CardMedia, Typography, CardActionArea, CircularProgress } from '@mui/material';
import BrokenImg from '../public/broken-image.png'

// newsItem component displays a single news item card
const NewsItem = ({ article, isLoading }) => {

    // set image URL for the article, use BrokenImg placeholder if no image available
    const imgUrl = article.urlToImage ? article.urlToImage : BrokenImg;

    // handle article click and open in new tab
    const handleArticleClick = () =>{
        window.open(article.url, '_blank', 'noopener')
    }

    // if data is loading, display a loader card
    if(isLoading){
        return (
            <Card sx={StyledLoaderCardStyles}>
                <StyledLoader><CircularProgress color="inherit"/></StyledLoader>
            </Card>
        )
    }

    return (
    <Card sx={NewsItemCardStyles}>
        <CardActionArea onClick={handleArticleClick} sx={CardActionAreaStyles}>
        <CardMedia
            component="img"
            sx={CardMediaStyles}
            image={imgUrl}
            alt={article.title}
        />
        <CardContent>
            <Typography variant="h6" component="div">{article.title}</Typography>
            <Typography variant="subtitle1" color="text.secondary">By: {article.author}</Typography>
            <Typography sx={descriptionStyles} variant="body2">{article.description}</Typography>
        </CardContent>
        </CardActionArea>
    </Card>
    );
};

// Styled components and Styles for MUI
const StyledLoader = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px; 
    height: 150px;
    flex-shrink: 0;
`
const StyledLoaderCardStyles = { 
    marginBottom: 2, 
    marginTop: 2, 
    display: 'flex', 
    justifyContent: 'center' 
}

const NewsItemCardStyles = { 
    marginBottom: 2, 
    marginTop: 2, 
}

const CardActionAreaStyles = { 
    display: 'flex', 
    justifyContent: 'flex-start', 
    maxHeight: 160
}

const CardMediaStyles = { 
    width: '200px', 
    height: '150px', 
    flexShrink: 0
}

const descriptionStyles = { 
    marginBottom: 2, 
    whiteSpace: 'normal' ,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    width: '70%' 
}

export default NewsItem;
