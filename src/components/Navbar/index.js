import * as React from 'react';
import styled from 'styled-components';
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
const Toggler = styled.button`
  align-items: center;
  border: none;
  background: none;
  border-radius: 0 4px 4px 0;
  display: flex;
  padding: 4px 10px 4px 4px;
  &:active,
  &:focus {
    outline: none;
    border: none;
  }
  cursor: pointer;
  color: #0060df;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  ${props =>
    props.collapsed &&
    `
    transform: translate(100%, -50%);
  `};
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
