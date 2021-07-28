import React, { useState, useEffect, MouseEvent } from 'react'
import styles from '@styles/Toolbox.module.scss'

export type ColorPickerProps = {
	id?: string
	colors: string[]
	active?: string
	onUpdate?: (id: string, active: string) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({ id, colors, onUpdate, active }) => {
	const [_active, setActive] = useState<string | undefined>(active)
	const [hover, setHover] = useState<string | undefined>()

	const handleClick = (color: string) => {
		setActive(color)
		if (_active && onUpdate && id != undefined) onUpdate(id, color)
	}

	return (
		<div className={styles.colorPicker}>
			{colors.map(color => (
				<div
					key={color}
					className={styles.color}
					style={{
						background: `${color}${_active === color || hover === color ? '' : '5E'}`,
						border: `2px solid ${color}`,
					}}
					onMouseEnter={() => setHover(color)}
					onMouseLeave={() => setHover(undefined)}
					onClick={() => handleClick(color)}
				></div>
			))}
		</div>
	)
}

export default ColorPicker
