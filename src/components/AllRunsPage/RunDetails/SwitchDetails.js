import * as React from 'react';
import FailedTests from './FailedTests';
import AllTests from './AllTests';
import SelectedRunDetails from './SelectedRunDetails';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import ApiClient from '../../apiClient';
import styled from 'styled-components';

const NoDataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d7d7db;
  min-height: 150px;
  font-size: 28px;
  color: red;
  font-weight: 600;
`;

const EMPTY_LIST = [];

class SwitchDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { details: {}, hasError: false };
  }

  componentDidMount() {
    ApiClient.get(`/runs/${this.props.match.params.id}/run.json`)
      .then(response =>
        response ? this.setState({ details: response }) : this.setState({ hasError: true })
      )
      .catch(() => this.setState({ hasError: true }));
  }

  render() {
    if (this.state.hasError) {
      return <NoDataContainer>Error, incomplete run! No data to display.</NoDataContainer>;
    }
    return (
      <Switch>
        <Route
          path={`${this.props.match.path}/failed`}
          render={() => (
            <FailedTests
              details={
                (this.state.details.tests && this.state.details.tests.failed_tests) || EMPTY_LIST
              }
            />
          )}
        />
        <Route
          path={`${this.props.match.path}/tests`}
          render={() => (
            <AllTests details={this.state.details.tests && this.state.details.tests.all_tests} />
          )}
        />
        <Route
          path={`${this.props.match.path}/details`}
          render={() => (
            <SelectedRunDetails details={this.state.details && this.state.details.meta} />
          )}
        />
        <Redirect to={`${this.props.match.path}/failed`} />
      </Switch>
    );
  }
}

export default withRouter(SwitchDetails);
