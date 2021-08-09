import React, { useState } from 'react'
import I from '@icons'
import styles from '@styles/Button.module.scss'
import classNames from '@utils/classNames'
import { useUpdateEffect } from '@hooks/useUpdateEffect'

export type ButtonState = boolean | string[]

export type Option = { id: string; icon: string }

export type ButtonProps = {
	id?: string
	icon?: string
	type?: 'normal' | 'checkbox' | 'radio'
	options?: Option[]
	status?: ButtonState
	onClick?: () => void
	changeState?: (state: ButtonState) => ButtonState
	onUpdate?: (id: string, state: ButtonState) => void
}

function Button({
	icon,
	onClick,
	status,
	type = 'normal',
	options,
	id,
	changeState = (s: ButtonState) => s,
	onUpdate,
}: ButtonProps) {
	const [state, setState] = useState<ButtonState>(() => {
		if (status) return status
		if ((type === 'checkbox' && options) || type === 'radio') return []
		return false
	})

	useUpdateEffect(() => {
		if (onUpdate && id) onUpdate(id, state)
	}, [state])

	const handleClick = (_id?: string) => {
		let newState: ButtonState

		if (type === 'normal' && onClick) onClick()
		if (type === 'radio' && _id) setState(changeState([_id]))

		if (type === 'checkbox') {
			setState(prev => {
				if (typeof prev === 'object' && _id) {
					newState = prev.slice()
					if (newState.includes(_id)) newState.splice(newState.indexOf(_id), 1)
					else newState.push(_id)
				} else {
					newState = !prev
				}

				return changeState(newState)
			})
		}
	}

	const isActive = (_id?: string) => {
		if (type === 'normal') return false
		if (typeof state === 'boolean') return state
		if (typeof state === 'object' && _id) {
			return state.includes(_id)
		}

		return false
	}

	if (type === 'normal' || (!options && !id)) {
		return (
			<div className={classNames(styles.button, { [styles.active]: isActive() })} onClick={() => handleClick()}>
				<I name={icon} width={26} height={26} />
			</div>
		)
	} else {
		console.log(type)
		return (
			<div className={styles.container}>
				{options &&
					options.map(option => (
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
