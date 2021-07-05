import React from "react";
import { IconOpt } from "..";

const DirectedEdge: React.FC<IconOpt> = ({
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
      d="M5.65011 17.4465C5.35722 17.7394 5.35722 18.2143 5.65011 18.5072C5.94301 18.8001 6.41788 18.8001 6.71077 18.5072L12.5132 12.7047C13.0856 13.2561 13.6618 13.7717 14.1778 14.1837C14.519 14.456 14.8483 14.6948 15.1421 14.8694C15.289 14.9566 15.4402 15.0359 15.5893 15.0951C15.729 15.1507 15.9169 15.2092 16.1229 15.2092C16.4041 15.209 16.6298 15.0934 16.7844 14.9785C16.9386 14.864 17.0633 14.7211 17.1631 14.5847C17.3625 14.312 17.5387 13.9589 17.6934 13.5845C18.0064 12.8268 18.2903 11.8347 18.5055 10.8362C18.7212 9.83596 18.8758 8.79303 18.9174 7.92785C18.9381 7.49751 18.9322 7.08642 18.8832 6.73617C18.8403 6.43049 18.7444 5.99898 18.4471 5.70167C18.1471 5.40165 17.7119 5.30885 17.4061 5.26863C17.0552 5.22245 16.6437 5.22053 16.2135 5.24528C15.3486 5.29505 14.3063 5.45919 13.3077 5.68084C12.3101 5.90226 11.3214 6.18875 10.5677 6.49522C10.1954 6.64661 9.84628 6.81645 9.57719 7.00444C9.44318 7.09805 9.30046 7.2157 9.18467 7.36167C9.07073 7.5053 8.93962 7.7322 8.93962 8.02593C8.93962 8.23295 9.00194 8.41984 9.05551 8.55065C9.11402 8.69355 9.19185 8.83949 9.27714 8.98155C9.44802 9.26619 9.68189 9.58966 9.94963 9.92762C10.3665 10.4538 10.8924 11.0488 11.4559 11.6407L5.65011 17.4465ZM16.307 13.0118C16.1925 13.2891 16.0871 13.4946 15.9987 13.6314C15.9713 13.6165 15.9412 13.5994 15.9084 13.5799C15.6975 13.4545 15.4281 13.2625 15.1137 13.0115C14.4877 12.5117 13.7405 11.8245 13.0193 11.0973C12.2983 10.3703 11.619 9.61925 11.1254 8.99616C10.8774 8.68315 10.6873 8.41626 10.5632 8.20949C10.5546 8.19525 10.5466 8.18154 10.5389 8.16837C10.6777 8.08596 10.8752 7.98948 11.1327 7.88473C11.7829 7.62035 12.6845 7.35566 13.6327 7.14521C14.5798 6.93499 15.5388 6.78659 16.2997 6.7428C16.6825 6.72078 16.9901 6.72681 17.2105 6.75581C17.281 6.76508 17.3319 6.77539 17.3673 6.78406C17.3765 6.81996 17.3875 6.87201 17.3977 6.94438C17.4286 7.16534 17.4376 7.47322 17.4192 7.85572C17.3825 8.61622 17.2431 9.57449 17.0392 10.5201C16.835 11.4673 16.574 12.3656 16.307 13.0118Z"
      fill={color}
    />
  </svg>
);

export default DirectedEdge;
