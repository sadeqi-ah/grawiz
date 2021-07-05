import React from "react";
import { IconOpt } from "..";

const Node: React.FC<IconOpt> = ({
  width,
  height,
  color,
  onClick,
  className,
}) => (
  <svg
    width={width}
    height={height}
    onClick={onClick}
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
      fill={color}
    />
  </svg>
);

export default Node;
