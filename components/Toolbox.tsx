import React, { memo, NamedExoticComponent } from 'react'
import styles from '@styles/Toolbox.module.scss'
import Point from '@utils/shape/point'
import Button, { ButtonProps } from './Button'
import ColorPicker, { ColorPickerProps } from './ColorPicker'
import Input, { InputProps } from './Input'
import { useTransition, animated } from 'react-spring'
import isEqual from 'lodash/isEqual'

interface IToolboxComposition extends NamedExoticComponent<ToolboxProps> {
	Button: React.FC<ButtonProps>
	Row: React.FC
	Group: React.FC
	Input: React.FC<InputProps>
	Line: React.FC
	ColorPicker: React.FC<ColorPickerProps>
}

export type ToolboxProps = {
	width: number
	height: number
	position?: Point
	children?: React.ReactNode
}

const Toolbox = memo(({ children, width, height, position }) => {
	const transitions = useTransition(position, {
		from: { scale: 0, opacity: 0 },
		enter: { scale: 1, opacity: 1 },
		leave: { scale: 0, opacity: 0 },
		config: { tension: 120, mass: 1, friction: 14, velocity: 0, precision: 0.01 },
	})

	return transitions(
		(style, pos) =>
			pos && (
				<animated.div
					className={styles.container}
					style={{
						width,
						height,
						top: pos.y,
						left: pos.x,
						...style,
					}}
				>
					{children}
				</animated.div>
			)
	)
}, isEqual) as IToolboxComposition

Toolbox.Button = Button
Toolbox.Input = Input
Toolbox.ColorPicker = ColorPicker

const Row: React.FC = ({ children }) => <div className={styles.row}>{children}</div>
Toolbox.Row = Row

const Group: React.FC = ({ children }) => <div className={styles.group}>{children}</div>
Toolbox.Group = Group

const Line: React.FC = () => <div className={styles.line}></div>
Toolbox.Line = Line

export default Toolbox
