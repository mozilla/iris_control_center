import * as React from 'react';
import styled from 'styled-components';
import { InputLabel, InputWrapper } from '../styledComponents';

function withLabel(WrappedComponent) {
  const StyledWrappedComponent = styled(({ error, ...rest }) => <WrappedComponent {...rest} />)`
    min-width: 200px;
    max-width: 400px;
  `;
  return function WithLabel({ label, ...rest }) {
    return (
      <InputWrapper>
        {label && <InputLabel>{label}:</InputLabel>}

        <StyledWrappedComponent {...rest} />
      </InputWrapper>
    );
  };
}

export default withLabel;
