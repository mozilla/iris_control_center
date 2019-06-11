import * as React from 'react';
import styled from 'styled-components';
import { Collapse, CardBody, Card } from 'reactstrap';
import TestItem from './TestItem';
import Icon from '../Icon';

const ExpandButton = styled.button`
  margin: auto;
  margin-right: 0;
  border: none;
  padding: 10px;
  background: none;
  color: #0060df;
  &:active,
  &:focus {
    outline: none;
    border: none;
  }
  display: flex;
  font-size: 15px;
`;
const SummaryContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  height: 40px;
  background-color: #e5effc;
  &:hover {
    background-color: #c4daf7;
  }
`;
const Checkbox = styled.input`
  margin: 10px;
`;
const Container = styled.div`
  margin: 8px 0;
  .card-body {
    padding: 0;
  }
  .card {
    border: none;
  }
`;

const MarginContainer = styled.div`
  margin-left: 36px;
`;
class TestCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleChange = event => {
    if (event.target.checked) {
      this.props.onChange(this.props.name, this.props.data);
    } else {
      this.props.onChange(this.props.name, {});
    }
  };

  toggleCollapse = event => {
    if (event.target.type !== 'checkbox') {
      this.setState({
        expanded: !this.state.expanded
      });
    }
  };

  handleTestSelection = (test, action) => {
    if (action === 'add') {
      this.props.onChange(this.props.name, {
        ...this.props.selectedItems,
        [this.props.name]: test
      });
    } else {
      const selectedItems = { ...this.props.selectedItems };
      delete selectedItems[this.props.name];
      this.props.onChange(this.props.name, selectedItems);
    }
  };

  handleCategorySelection = (categoryName, selectedTests) => {
    const isEmpty = Object.keys(selectedTests).length === 0;
    const isMissing = Object.keys(selectedTests).indexOf(categoryName) === -1;
    if (!isEmpty && isMissing) {
      this.props.onChange(this.props.name, {
        [categoryName]: selectedTests
      });
      return;
    }
    this.props.onChange(this.props.name, selectedTests);
  };

  render() {
    const isCategory = !!!this.props.data.name;
    const isDisabled = isCategory && !!!Object.keys(this.props.data).length;
    const isCategoryChecked =
      isCategory &&
      !isDisabled &&
      Object.keys(this.props.selectedItems).length === Object.keys(this.props.data).length;
    const { selectedItems } = this.props;
    return (
      <Container>
        {isCategory && (
          <SummaryContainer>
            <Checkbox
              type="checkbox"
              disabled={isDisabled}
              checked={isCategoryChecked}
              onChange={this.handleChange}
            />
            <span>{this.props.name}</span>
            <ExpandButton type="button" onClick={this.toggleCollapse}>
              <Icon icon={this.state.expanded ? 'close' : 'open'} />
            </ExpandButton>
          </SummaryContainer>
        )}

        {isCategory && (
          <Collapse isOpen={this.state.expanded}>
            <Card>
              <CardBody>
                {Object.keys(this.props.data).map(key => {
                  const item = this.props.data[key];
                  const isTest = !!(selectedItems[key] || {}).name;
                  return (
                    <MarginContainer key={key}>
                      <TestCategory
                        key={key}
                        name={key}
                        data={item}
                        onChange={this.handleCategorySelection}
                        selectedItems={isTest ? selectedItems : selectedItems[key] || {}}
                        onTestClick={this.props.onTestClick}
                        expandedTest={this.props.expandedTest}
                      />
                    </MarginContainer>
                  );
                })}
              </CardBody>
            </Card>
          </Collapse>
        )}
        {!isCategory && (
          <TestItem
            key={this.props.data.name}
            test={this.props.data}
            checked={Object.keys(this.props.selectedItems).find(
              itemName => itemName === this.props.data.name
            )}
            onChange={this.handleTestSelection}
            onTestClick={this.props.onTestClick}
            selected={this.props.data === this.props.expandedTest}
          />
        )}
      </Container>
    );
  }
}

export default TestCategory;
