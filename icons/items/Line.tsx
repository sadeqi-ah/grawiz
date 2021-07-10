import React from 'react'
import { IconOpt } from '..'

const Line: React.FC<IconOpt> = ({ width, height, color, onClick, className }) => (
	<svg
		width={width}
		height={height}
		onClick={onClick}
		className={className}
		viewBox='0 0 24 24'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			fillRule='evenodd'
			clipRule='evenodd'
			d='M3.75 12C3.75 11.5858 4.08579 11.25 4.5 11.25H19.5C19.9142 11.25 20.25 11.5858 20.25 12C20.25 12.4142 19.9142 12.75 19.5 12.75L4.5 12.75C4.08579 12.75 3.75 12.4142 3.75 12Z'
			fill={color}
		/>
	</svg>
)

export default Line
