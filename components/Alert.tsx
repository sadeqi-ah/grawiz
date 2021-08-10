import React from 'react'
import styles from '@styles/Alert.module.scss'
import { AlertProps } from '@providers/AlertProvider'
import { useTransition, animated } from 'react-spring'

function Alert({ text, show }: AlertProps) {
	const transitions = useTransition(show, {
		from: { y: 100, opacity: 0 },
		enter: { y: 0, opacity: 1 },
		leave: { y: 100, opacity: 0 },
		config: {
			tension: 210,
			friction: 20,
		},
	})

	return transitions(
		({ opacity, y }, _show) =>
			_show && (
				<animated.div
					className={styles.container}
					style={{ transform: y.to(_y => `translate3d(0,${_y}px,0)`), opacity }}
				>
					{text}
				</animated.div>
			)
	)
}

export default Alert
