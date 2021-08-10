import React from 'react'
import styles from '@styles/ExportBox.module.scss'
import { useTransition, animated } from 'react-spring'
import Code from './Code'

export type ExportBoxProps = {
	show: boolean
}

function ExportBox({ show }: ExportBoxProps) {
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
					<p className={styles.title}>adjacency matrix :</p>
					<Code code={['0 1 0 1 1', '1 0 0 0 1', '1 1 1 0 1', '1 1 0 0 0']} />
					<p className={styles.title}>adjacency list :</p>
					<Code code={['0 1', '1 2', '2 3', '3 4', '4 5']} />
				</animated.div>
			)
	)
}

export default ExportBox
