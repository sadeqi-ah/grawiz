import React from "react";
import { IconOpt } from "..";

const Search: React.FC<IconOpt> = ({
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
      d="M3.52808 11.7666C3.52808 7.21657 7.2166 3.52805 11.7666 3.52805C16.3167 3.52805 20.0052 7.21657 20.0052 11.7666C20.0052 16.3166 16.3167 20.0052 11.7666 20.0052C7.2166 20.0052 3.52808 16.3166 3.52808 11.7666ZM11.7666 2.02805C6.38818 2.02805 2.02808 6.38815 2.02808 11.7666C2.02808 17.1451 6.38818 21.5052 11.7666 21.5052C14.067 21.5052 16.181 20.7076 17.8474 19.3739L21.0127 22.531C21.306 22.8235 21.7808 22.8229 22.0734 22.5297C22.3659 22.2364 22.3653 21.7615 22.072 21.469L18.9439 18.349C20.5344 16.6157 21.5052 14.3045 21.5052 11.7666C21.5052 6.38815 17.1451 2.02805 11.7666 2.02805Z"
      fill={color}
    />
  </svg>
);

export default Search;
