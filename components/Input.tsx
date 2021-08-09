import React, { ChangeEvent, useState } from 'react'
import styles from '@styles/Input.module.scss'

export type InputProps = {
	id: string | undefined
	label: string
	type: 'text' | 'number'
	value?: string | number
	onChange?: (id: string, value?: string | number) => void
} & Omit<JSX.IntrinsicElements['input'], 'onChange' | 'type' | 'value'>

const Input: React.FC<InputProps> = ({ id, label, value, onChange, type, ...props }) => {
	const [state, setstate] = useState(value !== undefined ? value : '')

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setstate(e.target.value)
		if (onChange && id) onChange(id, e.target.value)
	}

	return (
		<div className={styles.input}>
			<label>{label}:</label>
			<input {...props} type={type} value={state} onChange={handleChange} />
		</div>
	)
}

export default Input
