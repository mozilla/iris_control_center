import * as React from 'react';
import DetailsHeader from './DetailsHeader';
import Icon from '../../Icon';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import SwitchDetails from './SwitchDetails';

const NoDataContainer = styled.div`
  font-size: 28px;
  color: #b1b1b3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500px;
  border: 1px solid #d7d7db;
  font-weight: 600;
`;
const SyledIcon = styled(Icon)`
  font-size: 150px;
`;

class RunDetails extends React.Component {
  render() {
    return (
      <div>
        <DetailsHeader
          {...(this.props.selectedRunId && this.props.match
            ? { basePath: this.props.match.url }
            : { disabled: true })}
        />
        {this.props.selectedRunId ? (
          <SwitchDetails key={this.props.selectedRunId} />
        ) : (
          <NoDataContainer>
            <SyledIcon icon="PoitingFingerUp" />
            <div>Select a run to see details.</div>
          </NoDataContainer>
        )}
      </div>
    );
  }
}

export default withRouter(RunDetails);
