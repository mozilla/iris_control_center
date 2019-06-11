import * as React from 'react';
import ApiClient from '../apiClient';
import 'react-table/react-table.css';
import styled from 'styled-components';
import Icon from '../Icon';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import RunsTable from './RunsTable';
import RunDetails from './RunDetails/';
import './override.css';

const Container = styled.div`
  padding: 15px 30px;
`;
const DeleteAllButton = styled.button`
  height: 32px;
  width: 132px;
  border: none;
  border-radius: 4px;
  background-color: rgba(12, 12, 13, 0.1);
  &:active,
  &:focus {
    outline: none;
    border: none;
  }
  :hover:not(:disabled) {
    background: #979797;
  }
  :disabled {
    opacity: 0.7;
  }
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  cursor: pointer;
`;
const ButtonContainer = styled.div`
  float: right;
`;
const TrashIcon = styled(Icon)`
  margin-left: 12px;
`;

class AllRunsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { runs: [] };
  }

  componentDidMount() {
    ApiClient.get('/data/runs.json').then(response => this.setState({ runs: response.runs }));
  }

  getSelectedRunId() {
    const selectedRun = this.state.runs.find(run => run.id === this.props.match.params.id);
    return selectedRun && selectedRun.id;
  }
  handleDelete = id => {
    ApiClient.get(`/delete?${id}`);
    this.setState({ runs: this.state.runs.filter(run => run.id !== id) });
    if (this.props.match.params.id === id) {
      this.props.history.push('/runs');
    }
  };

  handleDeleteAll = () => {
    ApiClient.get(`/deleteAll`);
    this.setState({ runs: [] });
    this.props.history.push('/runs');
  };

  submitDeleteAll = () => {
    confirmAlert({
      title: 'Delete All Runs',
      message: 'Permanently delete all runs? This cannot be undone.',
      buttons: [
        {
          label: 'Delete',
          onClick: () => this.handleDeleteAll()
        },
        {
          label: 'Cancel'
        }
      ]
    });
  };

  render() {
    return (
      <Container>
        <RunsTable runs={this.state.runs} onDelete={this.handleDelete} />
        <ButtonContainer>
          <DeleteAllButton
            type="button"
            title="Delete all runs from local disk"
            onClick={this.submitDeleteAll}
            disabled={!this.state.runs.length}
          >
            Delete All
            <TrashIcon icon="trashcanblack" />
          </DeleteAllButton>
        </ButtonContainer>
        <RunDetails selectedRunId={this.getSelectedRunId()} />
      </Container>
    );
  }
}

export default AllRunsPage;
