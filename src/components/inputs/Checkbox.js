import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.label`
  align-items: center;
  display: inline-flex;
  margin: 5px 0;
`;
const Label = styled.span`
  padding: 0 5px;
`;

class Checkbox extends React.Component {
  handleChange = event => {
    event.target.name
      ? this.props.onChange(event.target.name, event.target.checked ? true : false)
      : this.props.onChange(event.target.checked ? true : false);
  };

  render() {
    return (
      <div className="checkbox">
        <Wrapper>
          <input {...this.props} type="checkbox" onChange={this.handleChange} />
          {this.props.label && <Label>{this.props.label}</Label>}
        </Wrapper>
      </div>
    );
  }
}

export default Checkbox;
