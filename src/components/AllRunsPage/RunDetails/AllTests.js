import * as React from 'react';
import styled from 'styled-components';
import TestsList from './TestsList';
import AllTestDetails from './AllTestDetails';
import Icon from '../../Icon';

const MainGrid = styled.div`
  display: grid;
  /* grid-template-columns: minmax(500px, 1fr) 400px; */
  grid-template-columns: 30% 1fr;
  /* height: 400px; */
`;
const NoDataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d7d7db;
  margin-left: 10px;
  min-height: 250px;
`;
const SyledIcon = styled(Icon)`
  font-size: 80px;
`;

class AllTests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleExpandedTest = test => {
    this.setState({
      expandedTest: test
    });
  };

  render() {
    return (
      <MainGrid>
        <TestsList
          list={this.props.details}
          onTestClick={this.handleExpandedTest}
          expanded={this.state.expanded}
          onExpand={expanded => this.setState({ expanded })}
          selectedTest={(this.state.expandedTest || {}).name}
        />
        {this.state.expandedTest ? (
          <AllTestDetails test={this.state.expandedTest.data} />
        ) : (
          <NoDataContainer>
            <SyledIcon icon="PoitingFingerLeft" />
          </NoDataContainer>
        )}
      </MainGrid>
    );
  }
}

export default AllTests;
