import * as React from 'react';
import styled from 'styled-components';
import iconsDefinition from './icons-definition';

const iconSizes = {
  xs: 0.75,
  sm: 0.875,
  lg: 1.33,
  '2x': 2,
  '3x': 3,
  '4x': 4
};
const Svg = styled.svg`
  align-items: center;
  display: inline-flex;
  height: 1em;
  justify-content: center;
  font-size: ${props => `${iconSizes[props.size] || 1}em;`}
    ${props => props.danger && `color: ${props.theme.colors.danger};`};
`;

const ANIMATIONS = {
  spin: 'spin'
};

function getIconData(icon) {
  if (!icon) {
    return getNotFoundIcon();
  }
  return getIcon(icon);
}

function getIcon(icon) {
  const iconDefintion = iconsDefinition[icon];
  if (!iconDefintion) {
    return getNotFoundIcon();
  }
  return {
    height: iconDefintion[1] || 512,
    width: iconDefintion[0] || 512,
    definition: iconDefintion[2]
  };
}

function getNotFoundIcon() {
  // @TODO create notFound icon
  return {};
}

function Icon(props) {
  const iconData = getIconData(props.icon, props.prefix);
  return (
    <Svg
      className={
        (props.className || '') + (props.animation ? ` ${ANIMATIONS[props.animation]}` : '')
      }
      danger={props.danger}
      preserveAspectRatio="xMidYMid meet"
      size={props.size}
      style={iconData.style}
      viewBox={`0 0 ${iconData.width} ${iconData.height}`}
    >
      {/**
       * @TODO find a better approach to avoid dangerouslySetInnerHTML usage,
       * maybe a HOC decorator and each icon defined as a standalone component or
       * extract the tags from custom icons and generate the icon content using tags and children
       */}
      {iconData.definition && (
        <g fill="currentColor" dangerouslySetInnerHTML={{ __html: iconData.definition }} />
      )}
    </Svg>
  );
}

export default Icon;
