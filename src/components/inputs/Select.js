import * as React from 'react';
import withLabel from './withLabel';
import styled from 'styled-components';
import ReactSelect from 'react-select';

const StyledSelect = styled(ReactSelect)``;

class Select extends React.Component {
  handleChange = value => {
    if (!this.props.isMulti && Array.isArray(value) && value.length === 0) {
      value = null;
    }

    if (value.value) {
      value = value.value;
    }

    if (this.props.name) {
      this.props.onChange(this.props.name, value);
    } else {
      this.props.onChange(value);
    }
  };

  render() {
    let { disabled, name, onChange, options, value, ...rest } = this.props;

    if (options && typeof options[0] === 'string') {
      options = options.map(value => ({ label: value, value: value }));
    }
    if (typeof value === 'string') {
      value = {
        label: value,
        value: value
      };
    }

    return (
      <StyledSelect
        className="icc-select"
        classNamePrefix="icc"
        isDisabled={disabled}
        options={options}
        value={value}
        {...rest}
        onChange={this.handleChange}
      />
    );
  }
}

export default withLabel(Select);
