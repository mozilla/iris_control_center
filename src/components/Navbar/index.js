import * as React from 'react';
import styled from 'styled-components';
import NavbarItem from './NavbarItem';
import { Route } from 'react-router-dom';
import ApiClient from '../apiClient';

const Aside = styled.aside`
  width: 271px;
  background-color: #d7d7db;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Ul = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const Nav = styled.nav`
  width: 100%;
`;

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targets: null
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

  render() {
    return (
      <Aside className={this.props.className}>
        <Nav>
          <Ul>
            <Route path="/runs">
              <NavbarItem label="All Runs" basePath="/runs" />
            </Route>

            <Route path="/new">
              <NavbarItem label="Create New Run" basePath="/new" sublinks={this.state.targets} />
            </Route>
          </Ul>
        </Nav>
      </Aside>
    );
  }
}

export default Navbar;
