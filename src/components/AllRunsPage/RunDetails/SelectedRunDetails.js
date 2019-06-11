import * as React from 'react';
import styled from 'styled-components';
import Icon from '../../Icon';

const Container = styled.div`
  overflow: auto;
  border: 1px solid #d7d7db;
  padding: 10px;
  display: grid;
  grid-template-areas: 'left right';
  grid-template-columns: 2fr 2fr;
  column-gap: 30px;
`;
const LeftColumn = styled.div`
  grid-area: left;
  overflow: auto;
`;
const RightColumn = styled.div`
  grid-area: right;
  overflow: auto;
`;
const SystemConfig = styled.div`
  font-size: 18px;
  padding-bottom: 6px;
`;
const Details = styled.div`
  word-wrap: break-word;
  font-size: 15px;
  padding-left: 10px;
`;
const Detail = styled.div`
  padding-bottom: 6px;
  display: flex;
  align-items: center;
`;
const ExpandableDetail = styled(Detail)`
  display: flex;
  align-items: center;
`;
const ExpandIcon = styled(Icon)`
  ${props => props.expanded && 'transform: rotate(90deg);'}
`;
const ExpandButton = styled.button`
  border: none;
  padding: 0 10px 0 0;
  background: none;
  color: #0060df;
  &:active,
  &:focus {
    outline: none;
    border: none;
  }
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
const DetailKey = styled.i`
  color: #0060df;
  margin-right: 5px;
`;
const DetailValue = styled.span``;
const ViewLogButton = styled.button`
  height: 32px;
  width: 132px;
  border: none;
  border-radius: 4px;
  background-color: rgba(12, 12, 13, 0.1);
  &:link,
  &:active,
  &:visited {
    color: inherit;
  }
  &:focus {
    outline: none;
    border: none;
  }
  :hover {
    background: #979797;
    cursor: pointer;
    text-decoration: none;
  }
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
`;
const LogIcon = styled(Icon)`
  margin-left: 12px;
`;

const withExpand = WrappedComponent => {
  class WithExpand extends React.Component {
    state = {
      expanded: false
    };

    handleToggleClick = () => {
      this.setState({
        expanded: !this.state.expanded
      });
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          expanded={this.state.expanded}
          onToggleClick={this.handleToggleClick}
        />
      );
    }
  }

  return WithExpand;
};

class SelectedRunDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paramsSection: false,
      valuesSection: false
    };
  }

  toggleCollapse = expandedSection => {
    this.setState({
      [expandedSection]: !this.state[expandedSection]
    });
  };

  renderDetails = (data, keyName, KeyComponent, ValueComponent) => {
    const DetailsComponent = withExpand(props => (
      <React.Fragment>
        <ExpandableDetail>
          <ExpandButton type="button" onClick={props.onToggleClick}>
            <ExpandIcon expanded={props.expanded} icon="CarrotRight" />
          </ExpandButton>
          <KeyComponent>{props.attrName}: </KeyComponent>
        </ExpandableDetail>
        {props.expanded && (
          <ValueComponent>
            {this.renderDetails(data[props.attrName], props.attrName, KeyComponent, ValueComponent)}
          </ValueComponent>
        )}
      </React.Fragment>
    ));

    return (
      <Details key={keyName}>
        {Object.keys(data).map(key =>
          data[key] && typeof data[key] === 'object' ? (
            <DetailsComponent key={key} attrName={key} />
          ) : (
            <Detail key={key}>
              <KeyComponent>{key}: </KeyComponent>
              <ValueComponent>{data[key] + ''}</ValueComponent>
            </Detail>
          )
        )}
      </Details>
    );
  };

  render() {
    return (
      <Container>
        {this.props.details && (
          <React.Fragment>
            <LeftColumn>
              <Details>
                <Detail>
                  <DetailKey>Run ID: </DetailKey>
                  <DetailValue>{this.props.details.run_id}</DetailValue>
                </Detail>
                <Detail>
                  <DetailKey>Duration of Run: </DetailKey>
                  <DetailValue>{this.props.details.total_time}</DetailValue>
                </Detail>
                <br />
                <Detail>
                  <DetailKey>Passed/Total: </DetailKey>
                  <DetailValue>
                    {this.props.details.passed}/{this.props.details.total}
                  </DetailValue>
                </Detail>
                <Detail>
                  <DetailKey>Failures: </DetailKey>
                  <DetailValue>{this.props.details.failed}</DetailValue>
                </Detail>
                <Detail>
                  <DetailKey>Skipped: </DetailKey>
                  <DetailValue>{this.props.details.skipped}</DetailValue>
                </Detail>
                <Detail>
                  <DetailKey>Errors: </DetailKey>
                  <DetailValue>{this.props.details.errors}</DetailValue>
                </Detail>
                <br />
                <SystemConfig>System Config</SystemConfig>
                <Detail>
                  <DetailKey>Iris Version: </DetailKey>
                  <DetailValue>{this.props.details.iris_version}</DetailValue>
                </Detail>
                <Detail>
                  <DetailKey>Branch: </DetailKey>
                  <DetailValue>{this.props.details.iris_branch}</DetailValue>
                </Detail>
                <Detail>
                  <DetailKey>Repo: </DetailKey>
                  <DetailValue>{this.props.details.iris_repo}</DetailValue>
                </Detail>
                <Detail>
                  <DetailKey>Branch Head: </DetailKey>
                  <DetailValue>{this.props.details.iris_branch_head}</DetailValue>
                </Detail>
                <ViewLogButton
                  as="a"
                  target="_blank"
                  href={`/runs/${this.props.details.run_id}/iris_log.log`}
                  title="Open the log file"
                >
                  View Log
                  <LogIcon icon="ExternalLink" />
                </ViewLogButton>
                <br />
                <Detail>
                  <DetailKey>Args: </DetailKey>
                  <DetailValue>{this.props.details.args}</DetailValue>
                </Detail>
                <Detail>
                  <DetailKey>Config: </DetailKey>
                  <DetailValue>{this.props.details.config}</DetailValue>
                </Detail>
              </Details>
            </LeftColumn>

            <RightColumn>
              <Details>
                <Detail>
                  <ExpandButton type="button" onClick={() => this.toggleCollapse('paramsSection')}>
                    <ExpandIcon expanded={this.state.paramsSection} icon="CarrotRight" />
                  </ExpandButton>
                  <DetailKey>Params: </DetailKey>
                </Detail>
                {this.state.paramsSection &&
                  this.renderDetails(this.props.details.params, 'params', DetailKey, DetailValue)}

                <Detail>
                  <ExpandButton type="button" onClick={() => this.toggleCollapse('valuesSection')}>
                    <ExpandIcon expanded={this.state.valuesSection} icon="CarrotRight" />
                  </ExpandButton>
                  <DetailKey>Values: </DetailKey>
                </Detail>
                {this.state.valuesSection &&
                  this.renderDetails(this.props.details.values, 'values', DetailKey, DetailValue)}
              </Details>
            </RightColumn>
          </React.Fragment>
        )}
      </Container>
    );
  }
}

export default SelectedRunDetails;
