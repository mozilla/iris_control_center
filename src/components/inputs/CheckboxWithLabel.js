import * as React from 'react';
import styled from 'styled-components';

const Checkbox = styled.input`
  margin-left: 10px;
  border-radius: 2px;
  &:hover {
    box-shadow: inset 0px 0px 0px 2px rgba(0, 96, 223, 1);
  }
`;

const Description = styled.div`
  font-size: 12px;
  color: ${props => (props.isSelected ? 'white' : 'gray')};
  margin-left: 33px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 20px;
`;

const Label = styled.label`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Name = styled.span`
  margin-left: 10px;
`;
const Div = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 20px;
`;

const CheckboxWithLabel = props => (
  <Label key={0} htmlFor={props.id}>
    <Div>
      {props.showCheckbox && (
        <Checkbox
          type="checkbox"
          checked={props.checked === 1}
          onClick={props.onCheck}
          onChange={() => {}}
        />
      )}

      <Name key={1}>{props.name}</Name>
    </Div>
    {props.showDescription && (
      <Description isSelected={props.isSelected}>{props.description}</Description>
    )}
  </Label>
);

export default CheckboxWithLabel;
