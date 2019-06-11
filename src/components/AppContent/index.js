import * as React from 'react';
import AllRunsPage from '../AllRunsPage';
import NewRunPage from '../NewRunPage';
import { Route, Switch, Redirect } from 'react-router-dom';
import styled from 'styled-components';

const Main = styled.main`
  overflow: auto;
`;

function AppContent(props) {
  return (
    <Main className={props.className}>
      <Switch>
        <Route path="/runs/:id" component={AllRunsPage} />
        <Route path="/runs" component={AllRunsPage} />
        <Route
          path="/new/:target"
          render={routeProps => <NewRunPage {...routeProps} key={routeProps.match.params.target} />}
        />
        <Redirect to="/runs" />
      </Switch>
    </Main>
  );
}

export default AppContent;
