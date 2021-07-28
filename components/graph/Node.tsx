import React, { useState, memo } from 'react'
import Point from '@utils/shape/point'
import styles from '@styles/GraphEditor.module.scss'
import { animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import { isEqual } from 'lodash'
import { NODE_RADIUS } from '@constants'

export type GraphNode = {
	id: string
	label: string
	position: Point
	translate?: Point
	color: string
}

export type NodeProps = {
	id: string
	draggable?: boolean
	onDrag?: (translate: Point, id: string) => void
	onSelect?: (id: string) => void
	animateValue?: any
} & GraphNode

const Node = React.forwardRef<SVGCircleElement, NodeProps>(
	({ id, color, label, position, onDrag, onSelect, draggable, animateValue: { opacity, scale } }, ref) => {
		const [{ x, y }, setState] = useState(() => ({ x: 0, y: 0 }))

		const handleDrag = useDrag(
			({ offset: [_x, _y], tap }) => {
				if (tap && onSelect) onSelect(id)
				if (onDrag) onDrag(new Point(_x, _y), id)
				setState({ x: _x, y: _y })
			},
			{ useTouch: true, enabled: draggable }
		)

		return (
			<animated.g
				{...handleDrag()}
				style={{ x, y, opacity, scale, transformBox: 'fill-box', transformOrigin: '50% 50%' }}
				ref={ref}
			>
				{label && (
					<text
						className={styles.node}
						x={position.x}
						y={1 + position.y}
						dominantBaseline='middle'
						textAnchor='middle'
						fill={color}
						style={{ transition: 'fill 0.2s' }}
					>
						{label}
					</text>
				)}

				<circle
					id={id}
					className={styles.node}
					r={NODE_RADIUS}
					cx={position.x}
					cy={position.y}
					fill={`${color}5E`}
					strokeWidth='2'
					stroke={color}
					style={{ transition: 'fill 0.2s, stroke 0.2s' }}
				/>
			</animated.g>
		)
	}
)
Node.displayName = 'Node'
export default memo(Node, isEqual)
