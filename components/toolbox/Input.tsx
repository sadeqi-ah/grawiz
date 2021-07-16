import React, { ChangeEvent, useEffect, useState } from 'react'
import styles from '@styles/Toolbox.module.scss'

export type InputProps = {
	label: string
	type: 'text' | 'number'
	onChange?: (value: string | number | readonly string[] | undefined) => void
} & Omit<JSX.IntrinsicElements['input'], 'onChange' | 'type'>

const Input: React.FC<InputProps> = ({ label, value, onChange, type, ...props }) => {
	const [state, setstate] = useState(value)

	useEffect(() => {
		if (onChange) onChange(state)
	}, [state])

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setstate(e.target.value)
	}

	return (
		<div className={styles.input}>
			<label>{label}:</label>
			<input {...props} type={type} value={state} onChange={handleChange} />
		</div>
	)
}

export default Input
