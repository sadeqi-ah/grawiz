import React, { createElement, memo } from 'react'

import * as icons from './icons'

export type IconOpt = {
	width?: number
	height?: number
	className?: string
	color?: string
	onClick?: () => void
}

export type IconProps = {
	name: any
	width?: number
	height?: number
	className?: string
	color?: string
	onClick?: () => void
}

const I: React.FC<IconProps> = ({ name, width = 24, height = 24, ...props }) => {
	const component = (icons as any)[name]

	const propsComponent = {
		width,
		height,
		...props,
	}

	return createElement(component, propsComponent, props.children)
}

export default memo(I)
