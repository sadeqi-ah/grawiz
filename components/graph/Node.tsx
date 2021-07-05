import React, { useState } from 'react'
import Point from '../../utils/point'
import styles from '../../styles/GraphEditor.module.scss'

import { animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'

export type GraphNode = {
	position: Point
	translate?: Point
	id?: string
	label?: string
	color?: string
	draggable?: boolean
	onDrag?: (translate: Point, id: string) => void
}

const Node = React.forwardRef<SVGCircleElement, GraphNode>(({ color, label, position, id, onDrag, draggable }, ref) => {
	const [{ x, y }, setState] = useState(() => ({ x: 0, y: 0 }))

	const bind = useDrag(
		({ down, offset: [mx, my] }) => {
			if (onDrag && id) onDrag(new Point(mx, my), id)
			setState({ x: mx, y: my })
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
				id={id}
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
