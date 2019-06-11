import * as React from 'react';
import styled from 'styled-components';
import CheckboxTree from '../tree/CheckboxTree';

const ContentContainer = styled.div`
  border-right: 1px solid lightgray;
  box-sizing: border-box;
  padding: 15px 30px;
  overflow-y: auto;
`;
const Title = styled.h1`
  color: #737373;
  font-size: 28px;
  font-weight: normal;
  margin-bottom: 20px;
`;
const SelectAllCheckbox = styled.input`
  margin: 10px;
`;
const Span = styled.span`
  font-size: 20px;
`;
const Label = styled.label`
  display: flex;
  align-items: center;
  margin: 0;
`;
const Hr = styled.hr`
  margin: 0;
  background-color: #0060df;
  height: 1px;
`;

class Tests extends React.Component {
  constructor(props) {
    super(props);
    this.checkboxRef = React.createRef();
  }

  onSelectAll = () => {
    let data = [[], []];
    if (!this.props.isSelectAll) {
      data = this.checkboxRef.current.selectAllData();
    }
    this.props.onSelectAll(data);
  };

  render() {
    const { tests } = this.props;
    return (
      <ContentContainer>
        <Title>Tests</Title>
        <Label>
          <SelectAllCheckbox
            checked={this.props.isSelectAll}
            type="checkbox"
            onChange={this.onSelectAll}
          />
          <Span>Select all tests</Span>
        </Label>
        <Hr />
        <CheckboxTree
          ref={this.checkboxRef}
          showCheckbox
          showDescription
          nodes={tests}
          checked={this.props.checked}
          expanded={this.props.expanded}
          onCheck={this.props.onCheck}
          onExpand={this.props.onExpand}
          onTestClick={this.props.onTestClick}
          selectedItem={this.props.selectedTest}
        />
      </ContentContainer>
    );
  }
}

export default Tests;
