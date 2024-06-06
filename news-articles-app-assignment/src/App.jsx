import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Typography, Alert } from '@mui/material';
import Header from './components/Header';
import NewsList from './components/NewsList';
import NewsItem from './components/NewsItem';
import BreakingNews from './components/BreakingNews';
import useClickDebounce from './customHooks/useClickDebounce';
import useAxios from './customHooks/useAxios';
import { isToday } from './services/common';
import EmptyListGif from './public/empty-list.gif'

// Constants for pagination and breaking news limit
const ITEMS_PER_PAGE = 1;
const BREAKING_NEWS_LIMIT = 1;

const App = () => {

  // State variables
  const [articles, setArticles] = useState({ totalResults: 10000, articles: [] });
  const [page, setPage] = useState(1);
  const [breakingNews, setBreakingNews] = useState(null);
  const [alert, setAlert] = useState({ value: false, type: "" });
  const initialLoadRef = useRef(true); 

  // Custom hook to handle API requests
  const { loading: newsLoading, fetchData: newsFetchData } = useAxios({
    method: 'GET',
    url: `http://localhost:8000/api/news`,
    params: { pageSize: ITEMS_PER_PAGE, page: page },
  });

  // fetch news articles
  const fetchNews = async () => {
    const updatedArticles = [...articles.articles];
    try {
      const newsResponse = await newsFetchData(page);

      // Handle cancellation and empty response
      if (newsResponse == "canceled") {
        throw new Error("Request has been canceled")
      }

      if (newsResponse.articles.length == 0) {
        throw new Error("No new articles are available")
      }

      // Process each article in the response
      for (let i = 0; i < newsResponse.articles.length; i++) {
        const article = newsResponse.articles[i];

        // handle removed articles
        if (!article || article.content === "[Removed]") {
          setPage(prevPage => prevPage + 1);
          const removedNewsCounter = localStorage.getItem('removedNewsCounter');

          // set counter to help load correct page on refresh
          if (removedNewsCounter) {
            localStorage.setItem('removedNewsCounter', Number(removedNewsCounter) + 1);
          } else {
            localStorage.setItem('removedNewsCounter', 1);
          }

          setAlert({ value: true, type: "Failed" });

          throw new Error("New article was not found")
        }

        // Set missing values for article properties
        if (!article.source.id) {
          article.source.id = article.source.name.toLowerCase().split(" ").join("-");
        }

        if (!article.author) {
          article.author = article.source.name;
        }

        // Sort articles by author
        if (updatedArticles.length !== 1) {
          updatedArticles.sort((a, b) => a.author.localeCompare(b.author));
        }

        // Add the article to the top of the list
        updatedArticles.unshift(article);
      }

      // Update states with the new articles and next page
      setArticles({ totalResults: newsResponse.totalResults, articles: updatedArticles })
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Failed to fetch articles', error);
      return { totalResults: articles.totalResults, articles: [updatedArticles] };
    }
  };

  // handle fetching news with checking if we pulled all articles
  const handleFetchNews = async () => {
    if (page > articles.totalResults) {
      setAlert({ value: true, type: "No new articles" });
      console.info("No new articles are available...");
      return;
    }
    await fetchNews();
  };

  // Debounced version of handleFetchNews
  const debouncedHandleFetchNews = useClickDebounce(handleFetchNews, 1000)

  // fetch breaking news
  const fetchBreakingNews = async () => {
    setBreakingNews(null); // Reset the breaking news before fetching new one

    try {
      // fetch breaking news from the API
      const response = await fetch(`http://localhost:8000/api/breaking-news?limit=${BREAKING_NEWS_LIMIT}`, {
        responseType: 'stream'
      });

      // handle HTTP status and readable stream support
      if (response.status == 500) {
        console.error('Failed to fetch Breaking news.')
        throw new Error('Failed to fetch Breaking news.');
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }

      // process the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';
      let article = { source: '', author: '', image: '', description: '', content: '' };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value);

        if (result.includes('source')) {
          article = JSON.parse(result);
        } else {
          article.content += result;
        }
        setBreakingNews(article);
        result = ''; // Reset result to accumulate the next chunk
      }

    } catch (error) {
      console.error('Failed to fetch breaking news', error);
    } 
  }

  // Debounced version of fetchBreakingNews
  const debouncedFetchBreakingNews = useClickDebounce(fetchBreakingNews, 1000)

  // handle closing alerts
  const handleAlertClose = () => {
    setAlert({ value: false, type: "" });
  }

  // useEffect for initial loading and data persistence from localStorage
  useEffect(() => {
    let page = 1;
    let loadSavedNews = false;
    let removedNewsCounter = 0;

    // only run once, on init
    if (initialLoadRef.current) {
      const currentDate = new Date();
      const savedDateString = localStorage.getItem('latestDateSavedNews');

      // check if the latest saved article are from today, if not - reset
      if (!savedDateString) {
        localStorage.setItem('latestDateSavedNews', currentDate.toISOString());
        localStorage.setItem('removedNewsCounter', 0);
      } else {
        const savedDate = new Date(savedDateString)
        loadSavedNews = isToday(savedDate, currentDate)
      }

      // check how many removed articles in count - to get to correct page on load
      const tempRemovedNewsCounter = localStorage.getItem('removedNewsCounter');
      if (tempRemovedNewsCounter) {
        removedNewsCounter = tempRemovedNewsCounter
      }

      // if its from today, load articles from localStorage. if not - reset
      if (loadSavedNews) {
        const savedArticles = JSON.parse(localStorage.getItem('savedNews'));
        if (savedArticles && savedArticles.articles.length !== 0) {
          page = savedArticles.articles.length + Number(removedNewsCounter) + 1;
          setArticles(savedArticles);
        } else {
          localStorage.setItem('removedNewsCounter', 0);
        }
        setPage(page);
      } else {
        localStorage.setItem('latestDateSavedNews', currentDate.toISOString());
        localStorage.setItem('removedNewsCounter', 0);
      }
      initialLoadRef.current = false;
    }
  }, []);

  // useEffect for saving articles to localStorage
  useEffect(() => {
    localStorage.setItem('savedNews', JSON.stringify(articles));
  }, [articles]);

  // useEffect for closing alerts after 3 seconds
  useEffect(() => {
    if (alert.value) {
      const timer = setTimeout(() => {
        handleAlertClose();
      }, 3000);

      // Cleanup the timer when the component is unmounted or alert changes
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // useEffect for removing breaking news after 30 seconds
  useEffect(() => {
    if (breakingNews) {
      const timer = setTimeout(() => {
        setBreakingNews(null);
      }, 30000);

      // Cleanup the timer when the component is unmounted or breakingNews changes
      return () => clearTimeout(timer);
    }
  }, [breakingNews]);
  

  return (
    <StyledMain>
      <Header 
        isLoading={newsLoading} 
        page={page} 
        totalResults={articles.totalResults}
        articleCount={articles.articles.length} 
        getArticle={debouncedHandleFetchNews} 
        fetchBreakingNews={debouncedFetchBreakingNews} 
      />
      <StyledContainer>
        {(!breakingNews && articles.articles.length === 0) ? (
          <StyledEmptyListWrapper>
            <StyledEmptyListContainer>
              <img src={EmptyListGif} alt="Empty List" />
              <Typography variant="h3">No Articles Yet.</Typography>
              <Typography variant="h5">Once you click the "Get Article" button,</Typography>
              <Typography variant="h5">they'll show up here.</Typography>
            </StyledEmptyListContainer>
          </StyledEmptyListWrapper>
        ) : (
          <>
            {breakingNews && (
              <div>
                <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
                  Breaking News From Israel:
                </Typography>
                <BreakingNews article={breakingNews} />
                <StyledSeperator />
              </div>
            )}
            {articles.articles.length !== 0 && (
              <div>
                <StyledAlertWrapper>
                  <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
                    Latest Article Retrieved:
                  </Typography>
                  {alert.value && (
                    alert.type === "No new articles" ? (
                      <Alert sx={AlertStyles} severity="warning" variant="outlined" onClose={handleAlertClose}>
                        No new articles are available...
                      </Alert>
                    ) : (
                      <Alert sx={AlertStyles} severity="error" variant="outlined" onClose={handleAlertClose}>
                        Failed to get new article... please try again
                      </Alert>
                    )
                  )}
                </StyledAlertWrapper>
                <NewsItem
                  key={articles.articles[0]?.url}
                  isLoading={newsLoading}
                  article={articles.articles[0]}
                />
                <StyledSeperator />
                <NewsList articles={articles.articles.slice(1)} />
              </div>
            )}
          </>
        )}
      </StyledContainer>
      <StyledFooter><a>Total Articles: {articles.articles.length}</a></StyledFooter>
    </StyledMain>
  );
}

// Styled components and Styles for MUI
const StyledMain = styled.div`
  background: #f3f3f3;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledContainer = styled.div`
  flex-grow: 1;
  overflow: auto;

  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  color: rgba(0, 0, 0, 0.87);
  font-family: "Roboto","Helvetica","Arial",sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: 0.00938em;
  width: 100%;
  margin-left: auto;
  box-sizing: border-box;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
  max-width: 1200px;
`

const StyledFooter = styled.footer`
  width: 100%;
  min-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000000;
  opacity: 1;

  box-shadow: 
    1px -3px 4px -1px rgba(0, 0, 0, 0.2), 
    0px -4px 5px 0px rgba(0, 0, 0, 0.14), 
    -1px -5px 10px 0px rgba(0, 0, 0, 0.12);

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: #ffffff;
  }
`
const StyledEmptyListWrapper = styled.div`
  margin-top: 10%;
`

const StyledEmptyListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledSeperator = styled.hr`
  margin-bottom: 2px;
  margin-top: 2px;  
`

const StyledAlertWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
`
const AlertStyles = {
  height: '30px',
  fontSize: 'small',
  display: 'flex',
  alignItems: 'center'
}

export default App;
