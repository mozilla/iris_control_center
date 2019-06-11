import * as React from 'react';
import CheckboxTree from '../../tree/CheckboxTree';

class TestsList extends React.Component {
  render() {
    return (
      <div>
        {this.props.list && (
          <CheckboxTree
            nodes={this.props.list}
            checked={this.props.checked}
            expanded={this.props.expanded}
            onCheck={this.props.onCheck}
            onExpand={this.props.onExpand}
            onTestClick={this.props.onTestClick}
            selectedItem={this.props.selectedTest}
            expandBtnPosition="left"
          />
        )}
      </div>
    );
  }
}

export default TestsList;
