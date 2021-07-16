import React from 'react'
import styles from '@styles/Toolbox.module.scss'
import Point from '@utils/point'
import Button, { ButtonProps } from './Button'
import ColorPicker, { ColorPickerProps } from './ColorPicker'
import Input, { InputProps } from './Input'

interface IToolboxComposition {
	Button: React.FC<ButtonProps>
	Row: React.FC
	Group: React.FC
	Input: React.FC<InputProps>
	Line: React.FC
	ColorPicker: React.FC<ColorPickerProps>
}

export type ToolboxProps = {
	width: number
	position: Point
	show: boolean
}

const Toolbox: React.FC<ToolboxProps> & IToolboxComposition = ({ children, width, position, show }) => {
	return show ? (
		<div className={styles.container} style={{ width, top: position.y, left: position.x }}>
			{children}
		</div>
	) : null
}
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
