import React, { useMemo } from 'react';
import styled from 'styled-components';
import NewsItem from './NewsItem';

// newsList component displays a list of news articles
const NewsList = ({ articles }) => {

  // memoized rendering of articles list - 
  //mapping through articles array to render newsItem component for each article
  const renderedArticles = useMemo(() => {
    return (
      <StyledContainer>
        {articles.map((article) => (
          <NewsItem key={article.url} article={article} />
        ))}
      </StyledContainer>
    );
  }, [articles]);

  return renderedArticles;
};

const StyledContainer = styled.div`
    overflow: scroll;
`

export default NewsList;
