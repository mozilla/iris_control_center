import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import NavbarItem from './NavbarItem';
import { Route } from 'react-router-dom';
import ApiClient from '../apiClient';
import EscapeOutside from 'react-escape-outside';
import Icon from '../Icon';

const Aside = styled.aside`
  display: flex;
  position: relative;
  width: 0;
  z-index: 10;
`;
const Ul = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;
const Nav = styled.nav`
  width: 100%;
`;
const NavWrapper = styled.div`
  align-items: center;
  background-color: #d7d7db;
  bottom: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: absolute;
  top: 0;
  ${props => props.collapsed && 'transform: translateX(-100%);'}
  transition: transform 0.4s ease-out;
  width: 270px;
  z-index: 10;
`;
const animGlow = keyframes`
  0% {
		box-shadow: 0 0 rgba(0, 96, 223, 1);
	}
	100% {
		box-shadow: 0 0 10px 8px transparent;
	}
`;
const Toggler = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-radius: 0 20% 20% 0;
  color: #0060df;
  cursor: pointer;
  display: flex;
  padding: 5px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  ${props =>
    props.collapsed &&
    `
    transform: translate(100%, -50%);
  `};
  ${props =>
    !props.collapsed &&
    `
    border-radius: 20% 0 0 20%;
  `};

  &:active,
  &:focus {
    outline: none;
    border: none;
  }
  &:hover {
    animation: ${animGlow} 1s ease infinite;
  }
`;
const Overlay = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-color: black;
  opacity: 0.5;
  z-index: 9;
`;

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targets: null,
      collapsed: true
    };
  }

  componentDidMount() {
    ApiClient.get('/data/targets.json').then(response => {
      const parsedResponse = response.targets.map(target => {
        return {
          path: `/${target.name.toLowerCase()}`,
          label: `${target.name}`,
          icon: `/images/${target.icon}`
        };
      });
      this.setState({ targets: parsedResponse });
    });
  }

  handleToggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  handleEscapeOutside = () => {
    this.setState({ collapsed: true });
  };

  render() {
    return (
      <Aside className={this.props.className}>
        {!this.state.collapsed && <Overlay />}
        <EscapeOutside onEscapeOutside={this.handleEscapeOutside}>
          <NavWrapper collapsed={this.state.collapsed}>
            <Nav>
              <Ul>
                <Route path="/runs">
                  <NavbarItem label="All Runs" basePath="/runs" />
                </Route>

                <Route path="/new">
                  <NavbarItem
                    label="Create New Run"
                    basePath="/new"
                    sublinks={this.state.targets}
                  />
                </Route>
              </Ul>
            </Nav>
            <Toggler collapsed={this.state.collapsed} onClick={this.handleToggleCollapsed}>
              <Icon icon={this.state.collapsed ? 'ChevronRight' : 'ChevronLeft'} size="lg" />
            </Toggler>
          </NavWrapper>
        </EscapeOutside>
      </Aside>
    );
  }
}

export default Navbar;
