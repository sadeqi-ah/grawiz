import React from 'react'
import styles from '../../styles/Toolbox.module.scss'
import Button, { ButtonProps } from './Button'
import Input, { InputProps } from './Input'

interface IToolboxComposition {
	Button: React.FC<ButtonProps>
	Row: React.FC
	Group: React.FC
	Input: React.FC<InputProps>
	Line: React.FC
}

const Toolbox: React.FC<{ width: number }> & IToolboxComposition = ({ children, width }) => {
	return (
		<div className={styles.container} style={{ width }}>
			{children}
		</div>
	)
}
Toolbox.Button = Button
Toolbox.Input = Input

const Row: React.FC = ({ children }) => <div className={styles.row}>{children}</div>
Toolbox.Row = Row

const Group: React.FC = ({ children }) => <div className={styles.group}>{children}</div>
Toolbox.Group = Group

const Line: React.FC = () => <div className={styles.line}></div>
Toolbox.Line = Line

export default Toolbox
