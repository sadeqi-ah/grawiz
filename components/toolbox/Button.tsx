import React, { useState } from 'react'
import I from '@icons'
import styles from '@styles/Toolbox.module.scss'
import classNames from '@utils/classNames'

export type ButtonProps = {
	id?: string
	active?: string | string[]
	icon?: string
	options?: { id: string; icon: string }[]
	type: 'check-box' | 'radio-button' | 'button'
	onUpdate?: (id: string, active: string[]) => void
	onChange?: (id: string, active: string) => void
	onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({ id, active, icon, type, options = [], onClick, onUpdate, onChange }) => {
	const [_active, setActive] = useState<string | string[] | undefined>(active)

	const handleClick = (_id?: string) => {
		if (type === 'button' && onClick) onClick()
		if (type === 'radio-button' && _id) {
			setActive(_id)
			if (onChange && id) onChange(id, _id)
		}
		if (type === 'check-box' && _id) handleCheckboxClick(_id)
	}

	const handleCheckboxClick = (_id: string) => {
		let newState: string[]
		setActive(prev => {
			newState = prev as string[]
			if (newState.includes(_id)) newState.splice(newState.indexOf(_id), 1)
			else newState.push(_id)

			return newState
		})
		setTimeout(() => {
			if (onUpdate && id && newState) onUpdate(id, newState)
		}, 0)
	}

	const isActive = (_id: string) => {
		if (!_active) return false
		if (type === 'check-box') {
			return (_active as string[]).includes(_id)
		}
		return (_active as string) === _id
	}

	if (type === 'button') {
		return (
			<div className={styles.button} onClick={() => handleClick()}>
				<I name={icon} width={26} height={26} />
			</div>
		)
	} else {
		return (
			<div className={styles.radioButton}>
				{options.map(option => (
					<div
						key={option.id}
						className={classNames(styles.button, { [styles.active]: isActive(option.id) })}
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
