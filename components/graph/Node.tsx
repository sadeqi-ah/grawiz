import React, { useState } from 'react'
import Point from '../../utils/point'
import styles from '../../styles/GraphEditor.module.scss'

import { animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import { useGraphEditor } from '../../hooks/useGraphEditor'

export type GraphNode = {
	label: string
	position: Point
	translate?: Point
	color: string
}

export type NodeProps = {
	draggable?: boolean
	onDrag?: (translate: Point, id: string) => void
} & GraphNode

const Node = React.forwardRef<SVGCircleElement, NodeProps>(({ color, label, position, onDrag, draggable }, ref) => {
	const [{ x, y }, setState] = useState(() => ({ x: 0, y: 0 }))
	const { dispatch, getNodeByLabel } = useGraphEditor()

	const bind = useDrag(
		({ offset: [_x, _y], tap }) => {
			if (tap) {
				const node = getNodeByLabel(label)
				if (node) dispatch({ type: 'ADD_SELECTED_ITEM', payload: node })
			}
			if (onDrag && label) onDrag(new Point(_x, _y), label)
			setState({ x: _x, y: _y })
		},
		{ useTouch: true, enabled: draggable }
	)

	return (
		<animated.g {...bind()} style={{ x, y }} ref={ref}>
			<text
				className={styles.node}
				x={position.x}
				y={1 + position.y}
				dominantBaseline='middle'
				textAnchor='middle'
				fill={color}
			>
				{label}
			</text>
			<circle
				id={label}
				className={styles.node}
				r='20'
				cx={position.x}
				cy={position.y}
				fill={`${color}5E`}
				strokeWidth='2'
				stroke={color}
			/>
		</animated.g>
	)
})

export default Node
