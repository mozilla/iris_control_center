import isEqual from 'lodash/isEqual';
import nanoid from 'nanoid';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import NodeModel from './NodeModel';
import TreeNode from './TreeNode';

const StyledList = styled.ol`
  > ol {
    flex: 1 1 auto;
  }

  margin: 0;
  padding-left: 0;
  list-style-type: none;

  ol {
    padding-left: 36px;
  }
`;
class CheckboxTree extends React.Component {
  static propTypes = {
    nodes: PropTypes.array,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    name: PropTypes.string,
    expandBtnPosition: PropTypes.string,
    noCascade: PropTypes.bool,
    showCheckbox: PropTypes.bool,
    onCheck: PropTypes.func,
    onClick: PropTypes.func,
    onExpand: PropTypes.func
  };

  static defaultProps = {
    checked: [],
    disabled: false,
    expanded: [],
    id: null,
    name: undefined,
    noCascade: false,
    onCheck: () => {},
    onClick: null,
    onExpand: () => {},
    showCheckbox: false,
    expandBtnPosition: 'right'
  };

  constructor(props) {
    super(props);

    const model = new NodeModel(props);
    model.flattenNodes(props.nodes);
    model.deserializeLists({
      checked: props.checked,
      expanded: props.expanded
    });

    this.state = {
      id: props.id || `id-${nanoid(7)}`,
      model,
      prevProps: props
    };

    this.onCheck = this.onCheck.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
  }

  static getDerivedStateFromProps(newProps, prevState) {
    const { model, prevProps } = prevState;
    const { disabled, id, nodes } = newProps;
    let newState = { ...prevState, prevProps: newProps };

    // Apply new properties to model
    model.setProps(newProps);

    // Since flattening nodes is an expensive task, only update when there is a node change
    if (!isEqual(prevProps.nodes, nodes) || prevProps.disabled !== disabled) {
      model.flattenNodes(nodes);
    }

    if (id !== null) {
      newState = { ...newState, id };
    }
    model.deserializeLists({
      checked: newProps.checked,
      expanded: newProps.expanded
    });

    return newState;
  }

  selectAllData = () => {
    return this.state.model.getAllSelectedData();
  };
  onCheck = nodeInfo => {
    const { noCascade, onCheck } = this.props;
    const model = this.state.model.clone();
    const node = model.getNode(nodeInfo.name);

    model.toggleChecked(nodeInfo, nodeInfo.checked, noCascade);
    onCheck(model.serializeList('checked', 'showPath'), {
      ...node,
      ...nodeInfo
    });
  };

  onExpand = nodeInfo => {
    const { onExpand } = this.props;
    const model = this.state.model.clone();
    const node = model.getNode(nodeInfo.name);

    model.toggleNode(nodeInfo.name, 'expanded', nodeInfo.expanded);
    onExpand(model.serializeList('expanded')[0], { ...node, ...nodeInfo });
  };

  onNodeClick = nodeInfo => {
    const { onClick } = this.props;
    const { model } = this.state;
    const node = model.getNode(nodeInfo.name);

    onClick({ ...node, ...nodeInfo });
  };

  determineShallowCheckState(node, noCascade) {
    const flatNode = this.state.model.getNode(node.name);

    if (flatNode.isLeaf || noCascade) {
      return flatNode.checked ? 1 : 0;
    }

    if (this.isEveryChildChecked(node)) {
      return 1;
    }

    if (this.isSomeChildChecked(node)) {
      return 2;
    }

    return 0;
  }

  isEveryChildChecked(node) {
    return node.children.every(child => this.state.model.getNode(child.name).checkState === 1);
  }

  isSomeChildChecked(node) {
    return node.children.some(child => this.state.model.getNode(child.name).checkState > 0);
  }
  onArrowClick = itemName => {
    const { model } = this.state;
    const item = model.getNode(itemName);
    this.props.onTestClick(item);
  };
  renderTreeNodes(nodes, parent = {}) {
    const { noCascade, onClick } = this.props;
    const { model, id } = this.state;

    const treeNodes = nodes.map(node => {
      const flatNode = model.getNode(node.name);
      const children = flatNode.isParent ? this.renderTreeNodes(node.children, node) : null;

      // Determine the check state after all children check states have been determined
      // This is done during rendering as to avoid an additional loop during the
      // deserialization of the `checked` property
      flatNode.checkState = this.determineShallowCheckState(node, noCascade);

      // Render only if parent is expanded or if there is no root parent
      const parentExpanded = parent.name ? model.getNode(parent.name).expanded : true;

      return (
        parentExpanded && (
          <TreeNode
            key={node.name}
            checked={flatNode.checkState}
            disabled={flatNode.disabled}
            expanded={flatNode.expanded}
            isLeaf={flatNode.isLeaf}
            treeId={id}
            description={node.description || ''}
            name={node.name}
            onCheck={this.onCheck}
            onClick={onClick && this.onNodeClick}
            onExpand={this.onExpand}
            onArrowExpand={this.onArrowClick}
            showCheckbox={this.props.showCheckbox}
            expandBtnPosition={this.props.expandBtnPosition}
            showDescription={this.props.showDescription}
            selectedItem={this.props.selectedItem}
          >
            {children}
          </TreeNode>
        )
      );
    });

    return <StyledList>{treeNodes}</StyledList>;
  }

  render() {
    const { nodes } = this.props;
    return <div>{this.renderTreeNodes(nodes)}</div>;
  }
}

export default CheckboxTree;
