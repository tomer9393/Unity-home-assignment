import React from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, Button, CircularProgress } from '@mui/material';
import UnityLogo from '../public/trans-unity-logo-cut.png'

const Header = ({ isLoading, articleCount = 0, getArticle, fetchBreakingNews }) => {
  return (
    <AppBar position='static' sx={AppBarStyles}>
      <Toolbar sx={ToolbarStyles}>
        <StyledGetArticlesWrapper>
            <StyledUnityLogo src={UnityLogo} alt={'Unity Logo'}></StyledUnityLogo>
            <Button variant='outlined' color='inherit' onClick={getArticle}> Get Article </Button>
            <StyledArticlesRetrievedSpan>Articles Retrieved: {articleCount}</StyledArticlesRetrievedSpan>
            { isLoading ? <CircularProgress size={30} color="inherit"/> : <></>}
        </StyledGetArticlesWrapper>
        <Button sx={BreakingNewsButtonStyles} variant='outlined' color='inherit' onClick={fetchBreakingNews}>Breaking News</Button>
      </Toolbar>
    </AppBar>
  );
};

const AppBarStyles = {
    backgroundColor: '#000000', 
    opacity: 1, 
    boxShadow: '-1px 4px 2px -2px gray' 
}

const ToolbarStyles = { 
    flexDirection: 'row', 
    alignItems: 'center'
}

const BreakingNewsButtonStyles = {
    minWidth: 'fit-content'
}

const StyledGetArticlesWrapper = styled.div`
    width: 100%; 
    display: flex; 
    flex-direction: row; 
    flex-grow: 1;  
    align-items: center; 
    justify-content: flex-start; 
    gap: 16px;
`

const StyledUnityLogo = styled.img`
    height: 90px;
`

const StyledArticlesRetrievedSpan = styled.span`
    min-width: fit-content;
`

export default Header;
