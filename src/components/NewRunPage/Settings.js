import * as React from 'react';
import styled from 'styled-components';
import { Checkbox, Select } from '../inputs';

const LaunchButton = styled.button`
  background-color: #45a1ff;
  border: none;
  border-radius: 5px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12),
    0 1px 5px 0 rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 21px;
  height: 62px;
  margin: 10px;
  width: 192px;
  ${props => props.disabled && 'opacity: 0.5;'}
  cursor: pointer;
`;
const Title = styled.h1`
  color: #737373;
  font-size: 28px;
  font-weight: normal;
  margin: 50px 0 0 0;
`;
const Section = styled.div`
  margin: 18px 0 19px 0;
`;
const ContentContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 30px;

  ${LaunchButton} {
    align-self: center;
  }
`;

class Settings extends React.Component {
  handleChange = (name, value) => {
    this.props.onSelect({
      ...this.props.selections,
      [name]: value
    });
  };

  render() {
    return (
      <ContentContainer>
        <LaunchButton type="button" onClick={this.props.onLaunch} disabled={this.props.disabled}>
          Launch Tests
        </LaunchButton>
        <Title>Settings</Title>
        <Section>
          {this.props.settings.map(
            item =>
              item.type === 'list' && (
                <Select
                  key={item.name}
                  label={item.label}
                  name={item.name}
                  options={item.value}
                  value={this.props.selections[item.name] || item.default}
                  onChange={this.handleChange}
                />
              )
          )}
        </Section>

        <Section>
          {this.props.settings.map(
            item =>
              item.type === 'checkbox' && (
                <Checkbox
                  key={item.name}
                  label={item.label}
                  name={item.name}
                  checked={
                    this.props.selections[item.name] === undefined
                      ? item.value
                      : this.props.selections[item.name]
                  }
                  onChange={this.handleChange}
                />
              )
          )}
        </Section>
      </ContentContainer>
    );
  }
}

export default Settings;
