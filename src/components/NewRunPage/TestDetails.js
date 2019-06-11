import * as React from 'react';
import styled from 'styled-components';
import Icon from '../Icon';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 22px 28px 0 13px;
  overflow: auto;
`;
const CloseButton = styled.button`
  margin: 0 auto;
  margin-right: 0;
  border: none;
  padding: 0 0 19px 0;
  background: none;
  &:active,
  &:focus {
    outline: none;
    border: none;
  }
  color: #0060df;
  cursor: pointer;
`;
const Details = styled.div`
  word-wrap: break-word;
  font-size: 12px;
  padding-left: 10px;
`;
const Title = styled.div`
  font-size: 18px;
  padding-bottom: 15px;
  padding-left: 10px;
`;
const Detail = styled.div`
  padding-bottom: 12px;
`;
const ExpandableDetail = styled(Detail)`
  display: flex;
  align-items: center;
`;
const DetailKey = styled.i`
  color: #0060df;
`;
const DetailValue = styled.span``;
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

class TestDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assertsSection: false,
      detailsSection: false,
      displayImages: false,
      hasOpenedImage: false
    };
  }

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
        <CloseButton type="button" onClick={this.props.onClose}>
          <Icon icon="exit" />
        </CloseButton>
        <Title>{this.props.test.name}</Title>
        {this.renderDetails(this.props.test, 'test', DetailKey, DetailValue)}
      </Container>
    );
  }
}

export default TestDetails;
