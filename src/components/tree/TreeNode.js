import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';
import Icon from '../Icon/index';
import { CheckboxWithLabel } from '../inputs/index';

const ExpandButton = styled.button`
  margin: ${props => (props.noMargin ? 0 : 'auto')};
  margin-right: 0;
  border: none;
  padding-right: 10px;
  background: none;
  color: #0060df;
  &:active,
  &:focus {
    outline: none;
    border: none;
  }
  display: flex;
  font-size: 15px;
  cursor: pointer;
`;

const TestExpandButton = styled(ExpandButton)`
  ${props => !props.isSelected && 'display: none;'};
  color: ${props => (props.isSelected ? 'white' : '#0060df')};
`;
const CarrotIcon = styled(Icon)`
  ${props => props.expanded && 'transform: rotate(90deg);'}
`;

const leafStyles = `
    font-size: 18px;
    height: auto;
    max-height: 55px;
    padding-top: 5px;
    padding-bottom: 5px;
`;

const SummaryContainer = styled.span`
  display: flex;
  align-items: center;
  font-size: 20px;
  height: 40px;
  background-color: ${props => (props.isSelected ? '#0A84FF' : '#e5effc')};
  color: ${props => props.isSelected && 'white'};
  &:hover {
    background-color: ${props => (props.isSelected ? '#0A84FF' : '#c4daf7')};
    ${TestExpandButton} {
      display: flex;
    }
  }
  ${props =>
    props.isLeaf
      ? css`
          ${leafStyles}
        `
      : ''}
`;

const Container = styled.li`
  margin: ${props => (props.isLeaf ? '3px' : '8px')} 0;
`;

class TreeNode extends React.Component {
  static propTypes = {
    checked: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    isLeaf: PropTypes.bool.isRequired,
    treeId: PropTypes.string.isRequired,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onCheck: PropTypes.func.isRequired,
    onExpand: PropTypes.func.isRequired,
    children: PropTypes.node,
    title: PropTypes.string,
    expandBtnPosition: PropTypes.string,
    onClick: PropTypes.func
  };

  static defaultProps = {
    children: null,
    title: null,
    onClick: () => {},
    showCheckbox: false,
    expandBtnPosition: 'right'
  };

  onCheck = () => {
    const { name, onCheck } = this.props;
    onCheck({ name, checked: this.getCheckState({ toggle: true }) });
  };

  onExpand = () => {
    const { expanded, name, onExpand } = this.props;
    onExpand({ name, expanded: !expanded });
  };

  onArrowExpand = () => {
    const { onArrowExpand, name } = this.props;
    onArrowExpand(name);
  };

  getCheckState({ toggle }) {
    const { checked } = this.props;
    // Toggle off or partial state to checked
    if (checked === 0 || checked === 2) {
      return true;
    }
    // Node is already checked and we are not toggling
    if (checked === 1) {
      return false;
    }

    return false;
  }

  render() {
    const { expanded, isLeaf, treeId, name, expandBtnPosition } = this.props;
    const inputId = `${treeId}-${String(name)
      .split(' ')
      .join('_')}`;

    const showLeftBtn = !isLeaf && expandBtnPosition !== 'right';
    const showRightBtn = !isLeaf && expandBtnPosition === 'right';

    const checkboxProps = {
      name,
      id: inputId,
      checked: this.props.checked,
      description: this.props.description,
      showCheckbox: this.props.showCheckbox,
      showDescription: this.props.showDescription
    };
    const isSelected = this.props.selectedItem === name;
    return (
      <Container isLeaf={isLeaf}>
        <SummaryContainer isLeaf={isLeaf} isSelected={isSelected}>
          {showLeftBtn && (
            <ExpandButton noMargin onClick={this.onExpand}>
              <CarrotIcon expanded={expanded} icon="CarrotRight" />
            </ExpandButton>
          )}
          <CheckboxWithLabel {...checkboxProps} onCheck={this.onCheck} isSelected={isSelected} />
          {isLeaf && (
            <TestExpandButton type="button" onClick={this.onArrowExpand} isSelected={isSelected}>
              <Icon icon="arrowhead-right" />
            </TestExpandButton>
          )}
          {showRightBtn && (
            <ExpandButton type="button" onClick={this.onExpand}>
              <Icon icon={expanded ? 'close' : 'open'} />
            </ExpandButton>
          )}
        </SummaryContainer>
        {expanded && this.props.children}
      </Container>
    );
  }
}
export default TreeNode;
