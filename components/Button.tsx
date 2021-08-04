import React, { useState } from 'react'
import I from '@icons'
import styles from '@styles/Button.module.scss'
import classNames from '@utils/classNames'

export type ButtonProps = {
	icon: string
	switchMode?: boolean
	status?: boolean
	onClick?: (status: boolean) => void
}

const Button: React.FC<ButtonProps> = ({ icon, onClick, switchMode, status }) => {
	const [state, setState] = useState(false)
	const _status = status !== undefined ? status : state

	const handleClick = () => {
		if (switchMode && status !== undefined) setState(prev => !prev)
		setTimeout(() => {
			if (onClick) onClick(_status)
		}, 0)
	}

	return (
		<div className={classNames(styles.button, { [styles.active]: _status })} onClick={() => handleClick()}>
			<I name={icon} width={26} height={26} />
		</div>
	)
}

export default Button
