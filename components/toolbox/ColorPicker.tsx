import React, { useState } from 'react'
import styles from '@styles/Toolbox.module.scss'

export type ColorPickerProps = {
	colors: string[]
	active: string
	onUpdate?: (active: string) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, onUpdate, active }) => {
	const [_active, setActive] = useState<string | undefined>(active)
	const [hover, setHover] = useState<string | undefined>()

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
					onClick={() => setActive(color)}
				></div>
			))}
		</div>
	)
}

export default ColorPicker
