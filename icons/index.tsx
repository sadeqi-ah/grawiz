import React, { createElement } from "react";

import * as icons from "./icons";

export type IconOpt = {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  onClick?: () => void;
};

export type IconProps = {
  name: any;
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  onClick?: () => void;
};

const I: React.FC<IconProps> = ({
  name,
  width = 24,
  height = 24,
  ...props
}) => {
  const component = (icons as any)[name];

  const propsComponent = {
    width,
    height,
    color: props.color,
    className: props.className,
    onClick: props.onClick,
  };

  return createElement(component, propsComponent, props.children);
};

export default I;
