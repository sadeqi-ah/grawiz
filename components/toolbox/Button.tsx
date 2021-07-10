import React, { useState } from 'react'
import I from '../../icons'
import styles from '../../styles/Toolbox.module.scss'
import classNames from '../../utils/classNames'

export type ButtonProps = {
	active: boolean | string
	icon?: string
	options?: { id: string; icon: string }[]
	type: 'check-box' | 'radio-button' | 'button'
	onUpdate?: (active: boolean | string) => void
	onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({ active, icon, type, options = [], onClick }) => {
	const [_active, setActive] = useState<boolean | string>(active)

	const handleClick = (id?: string) => {
		if (id) setActive(id)
		if (type === 'button' && onClick) onClick()
		if (type === 'check-box') setActive(prev => !prev)
	}

	if (type === 'button' || type === 'check-box') {
		return (
			<div className={classNames(styles.button, { [styles.active]: _active })} onClick={() => handleClick()}>
				<I name={icon} width={26} height={26} />
			</div>
		)
	} else {
		return (
			<div className={styles.radioButton}>
				{options.map(option => (
					<div
						key={option.id}
						className={classNames(styles.button, { [styles.active]: _active === option.id })}
						onClick={() => handleClick(option.id)}
					>
						<I name={option.icon} width={26} height={26} />
					</div>
				))}
			</div>
		)
	}
}

export default Button
