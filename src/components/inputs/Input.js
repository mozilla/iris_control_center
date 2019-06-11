import * as React from 'react';
import withLabel from './withLabel';
import { Input as StyledInput } from '../styledComponents';

class Input extends React.Component {
  handleChange = event => {
    this.props.onChange(event.target.name, event.target.value);
  };

  render() {
    const { value, onChange, ...rest } = this.props;

    return (
      <StyledInput
        type="text"
        /** check for null and undefined by ignoring data type
         * (equality operator is used instead of identity)
         */
        // eslint-disable-next-line eqeqeq
        value={value == undefined ? '' : value}
        {...rest}
        onChange={this.handleChange}
      />
    );
  }
}

export default withLabel(Input);
