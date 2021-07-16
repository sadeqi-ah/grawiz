import React, { useState, memo } from 'react'
import Point from '@utils/point'
import styles from '@styles/GraphEditor.module.scss'
import { animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import { isEqual } from 'lodash'

export type GraphNode = {
	label: string
	position: Point
	translate?: Point
	color: string
}

export type NodeProps = {
	draggable?: boolean
	onDrag?: (translate: Point, id: string) => void
	onSelect?: (label: string) => void
} & GraphNode

const Node = React.forwardRef<SVGCircleElement, NodeProps>(
	({ color, label, position, onDrag, onSelect, draggable }, ref) => {
		const [{ x, y }, setState] = useState(() => ({ x: 0, y: 0 }))

		const handleDrag = useDrag(
			({ offset: [_x, _y], tap }) => {
				if (tap && onSelect) onSelect(label)
				if (onDrag) onDrag(new Point(_x, _y), label)
				setState({ x: _x, y: _y })
			},
			{ useTouch: true, enabled: draggable }
		)

		return (
			<animated.g {...handleDrag()} style={{ x, y }} ref={ref}>
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
	}
)
Node.displayName = 'Node'
export default memo(Node, isEqual)
