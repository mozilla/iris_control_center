import * as React from 'react';
import Icon from '../Icon';
import { NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';

const Span = styled.span`
  font-size: 21px;
`;

const Li = styled.li`
  padding-left: 8px;
  ${props =>
    props.selected &&
    `
    box-shadow: inset 8px 0px 0px 0px rgba(69,161,255,1);
    background-color: white;
  `}
`;
const StyledNavLink = styled(NavLink)`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  height: 62px;
  padding: 0 24px;
  text-decoration: none;

  &:active,
  &:link,
  &:visited {
    color: inherit;
  }
  &:hover {
    text-decoration: none;
  }

  ${props =>
    props.selected &&
    `
    font-weight: bold;
    ${props.dark &&
      `
      background-color: rgba(0,15,64, 0.59);
      ${Span} {
        color: white;
      }
    `}
  `}
`;

const Ul = styled.ul`
  list-style: none;
  padding: 10px 0;
  margin: 0;
  background-color: #ededf0;
  ${StyledNavLink} {
    height: 48px;
    padding: 0 17px;
  }
`;
const ExpandIcon = styled(Icon)`
  margin: auto;
  margin-right: 0;
`;

const Logo = styled.img`
  margin-right: 17px;
  height: 30px;
`;

function NavbarItem(props) {
  return (
    <Li selected={props.match}>
      <StyledNavLink
        selected={props.match}
        to={props.sublinks ? `${props.basePath}${props.sublinks[0].path}` : props.basePath}
      >
        <Span>{props.label}</Span>
        <ExpandIcon icon={props.match ? 'close' : 'open'} />
      </StyledNavLink>
      {props.match && props.sublinks && (
        <Ul>
          {props.sublinks.map(item => (
            <li key={item.path}>
              <StyledNavLink
                dark="true"
                selected={props.location.pathname === `${props.basePath}${item.path}`}
                to={`${props.basePath}${item.path}`}
              >
                <Logo src={item.icon} />
                <Span>{item.label}</Span>
              </StyledNavLink>
            </li>
          ))}
        </Ul>
      )}
    </Li>
  );
}

export default withRouter(NavbarItem);
