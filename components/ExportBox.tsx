import React, { useEffect } from 'react'
import styles from '@styles/ExportBox.module.scss'
import { useTransition, animated } from 'react-spring'
import Code from './Code'
import { Edge, Node } from '@utils/graph/types'
import { Concrete } from '@utils/types'
import { useGraphEditorStore } from '@providers/graphEditor'

export type ExportBoxProps = {
	show: boolean
}

function ExportBox({ show }: ExportBoxProps) {
	const state = useGraphEditorStore()

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
					<Code code={state.graph.convertToMatrix().map(line => line.join(' '))} />
					<p className={styles.title}>adjacency list :</p>
					<Code
						code={[
							...state.graph.nodes.map(node => node.id.split('_')[1]),
							...state.graph
								.normalizeEdges()
								.map(
									edge => `${edge.source.split('_')[1]} ${edge.target.split('_')[1]} ${edge.weight}`
								),
						]}
					/>
				</animated.div>
			)
	)
}

export default ExportBox
