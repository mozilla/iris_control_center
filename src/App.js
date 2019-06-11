import React, { Component } from 'react';
import AppHeader from './components/AppHeader';
import Navbar from './components/Navbar';
import AppContent from './components/AppContent';
import { BrowserRouter as Router } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import ApiClient from './components/apiClient';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
  }
  #root {
    display: grid;
    grid-template-areas:
      "header header"
      "Navbar content";
    grid-template-columns: 271px 1fr;
    grid-template-rows: auto minmax(300px, 1fr);
  }
  html body {
    font-family: 'Open Sans';
  }
`;
const StyledAppHeader = styled(AppHeader)`
  grid-area: header;
`;
const StyledNavbar = styled(Navbar)`
  grid-area: Navbar;
`;
const StyledAppContent = styled(AppContent)`
  grid-area: content;
`;

class App extends Component {
  componentDidMount() {
    window.addEventListener('beforeunload', function(e) {
      ApiClient.get('/cancel');
    });
  }

  render() {
    return (
      <Router>
        <>
          <GlobalStyle />
          <StyledAppHeader />
          <StyledNavbar />
          <StyledAppContent />
        </>
      </Router>
    );
  }
}

export default App;
