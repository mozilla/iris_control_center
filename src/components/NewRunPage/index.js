import * as React from 'react';
import Tests from './Tests';
import Settings from './Settings';
import styled from 'styled-components';
import ApiClient from '../apiClient';
import TestDetails from './TestDetails';

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(500px, 1fr) 400px;
  height: 100%;
`;
class NewRunPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      args: {},
      tests: {},
      expandedTest: null,
      targetData: null,
      allData: {},
      selectedItems: {},
      checked: [],
      expanded: [],
      isSelectAll: false,
      syncing: false
    };
  }

  componentDidMount() {
    ApiClient.get('/data/targets.json').then(response => {
      const target = response.targets.find(
        item => item.name.toLowerCase() === this.props.match.params.target
      );
      const temp = {};
      target.settings.map(item => (temp[item.name] = item.default || false));
      this.setState({
        allData: response.targets,
        targetData: target,
        args: temp
      });
    });
  }

  handleLaunch = () => {
    const {
      tests,
      expandedTest,
      targetData,
      allData,
      selectedItems,
      checked,
      expanded,
      isSelectAll,
      testsPath,
      syncing,
      ...data
    } = this.state;
    data.target = targetData.name.toLowerCase();
    data.tests = testsPath;
    this.setState({syncing: true});
    ApiClient.post('/go', data);
    console.log(data);
  };

  handleSelectAll = data => {
    const isSelectAllValue = this.state.isSelectAll;
    this.setState({
      checked: data[0],
      testsPath: data[1],
      isSelectAll: !isSelectAllValue
    });
  };

  handleSettingsSelection = selectedArgs => {
    this.setState({
      args: selectedArgs
    });
  };

  handleExpandedTest = test => {
    this.setState({
      expandedTest: test
    });
  };

  handleCloseDetails = () => {
    this.setState({
      expandedTest: null
    });
  };

  onCheck = data => {
    this.setState({ checked: data[0], testsPath: data[1] });
  };
  render() {
    return (
      <MainGrid>
        {this.state.targetData ? (
          <React.Fragment>
            <Tests
              isSelectAll={this.state.isSelectAll}
              onSelectAll={this.handleSelectAll}
              onTestClick={this.handleExpandedTest}
              tests={this.state.targetData.tests}
              checked={this.state.checked}
              expanded={this.state.expanded}
              onCheck={this.onCheck}
              onExpand={expanded => this.setState({ expanded })}
              selectedTest={(this.state.expandedTest || {}).name}
            />
            {this.state.expandedTest ? (
              <TestDetails test={this.state.expandedTest.data} onClose={this.handleCloseDetails} />
            ) : (
              <Settings
                selections={this.state.args}
                onLaunch={this.handleLaunch}
                onSelect={this.handleSettingsSelection}
                settings={this.state.targetData.settings}
                disabled={this.state.syncing}
              />
            )}
          </React.Fragment>
        ) : (
          <span>Loading data...</span>
        )}
      </MainGrid>
    );
  }
}

export default NewRunPage;
