class NodeModel {
  constructor(props, nodes = {}) {
    this.props = props;
    this.flatNodes = nodes;
  }

  setProps(props) {
    this.props = props;
  }

  clone() {
    const clonedNodes = {};

    // Re-construct nodes one level deep to avoid shallow copy of mutable characteristics
    Object.keys(this.flatNodes).forEach(value => {
      const node = this.flatNodes[value];
      clonedNodes[value] = { ...node };
    });

    return new NodeModel(this.props, clonedNodes);
  }

  getNode(value) {
    return this.flatNodes[value];
  }

  flattenNodes(nodes, parent = {}, depth = 0) {
    if (!Array.isArray(nodes) || nodes.length === 0) {
      return;
    }

    const { disabled, noCascade } = this.props;

    // Flatten the `node` property for internal lookups
    nodes.forEach((node, index) => {
      const isParent = this.nodeHasChildren(node);

      this.flatNodes[node.name] = {
        name: node.name,
        children: node.children,
        parent,
        isParent,
        isLeaf: !isParent,
        disabled: this.getDisabledState(node, parent, disabled, noCascade),
        treeDepth: depth,
        index,
        data: !isParent ? node : null
      };
      this.flattenNodes(node.children, node, depth + 1);
    });
  }

  nodeHasChildren(node) {
    return Array.isArray(node.children) && node.children.length > 0;
  }

  getDisabledState(node, parent, disabledProp, noCascade) {
    if (disabledProp) {
      return true;
    }

    if (!noCascade && parent.disabled) {
      return true;
    }

    return Boolean(node.disabled);
  }

  deserializeLists(lists) {
    const listKeys = ['checked', 'expanded'];

    // Reset values to false
    Object.keys(this.flatNodes).forEach(value => {
      listKeys.forEach(listKey => {
        this.flatNodes[value][listKey] = false;
      });
    });

    // Deserialize values and set their nodes to true
    listKeys.forEach(listKey => {
      lists[listKey].forEach(value => {
        if (this.flatNodes[value] !== undefined) {
          this.flatNodes[value][listKey] = true;
        }
      });
    });
  }

  serializeList(key, showPath) {
    const list = [];
    const path = [];

    Object.keys(this.flatNodes).forEach(value => {
      if (this.flatNodes[value][key]) {
        list.push(value);
        if (showPath) {
          path.push(this.flatNodes[value].data.file);
        }
      }
    });

    return [list, path];
  }

  expandAllNodes(expand) {
    Object.keys(this.flatNodes).forEach(value => {
      if (this.flatNodes[value].isParent) {
        this.flatNodes[value].expanded = expand;
      }
    });

    return this;
  }

  toggleChecked(node, isChecked, noCascade) {
    const flatNode = this.flatNodes[node.name];

    if (flatNode.isLeaf || noCascade) {
      if (node.disabled) {
        return this;
      }

      // Set the check status of a leaf node or an uncoupled parent
      this.toggleNode(node.name, 'checked', isChecked);
    } else {
      // Percolate check status down to all children
      flatNode.children.forEach(child => {
        this.toggleChecked(child, isChecked, noCascade);
      });
    }

    return this;
  }

  toggleNode(nodeValue, key, toggleValue) {
    this.flatNodes[nodeValue][key] = toggleValue;

    return this;
  }

  getAllSelectedData() {
    const allLeafs = [];
    const allPaths = [];
    Object.keys(this.flatNodes).forEach(value => {
      if (this.flatNodes[value].isLeaf) {
        allLeafs.push(value);
        allPaths.push(this.flatNodes[value].data.file);
      }
    });
    return [allLeafs, allPaths];
  }
}

export default NodeModel;
