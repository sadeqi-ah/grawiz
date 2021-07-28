import React, { memo } from 'react'
import Node, { GraphNode } from '@components/graph/Node'
import { useTransition } from 'react-spring'
import Point from '@utils/shape/point'
import { isEqual } from 'lodash'

export type NodesProps = {
	nodes: GraphNode[]
	draggable: boolean
	onDrag?: (translate: Point, id: string) => void
	onSelect?: (id: string) => void
}

const Nodes: React.FC<NodesProps> = ({ nodes, onDrag, onSelect, draggable }) => {
	const transitions = useTransition(nodes, {
		from: { scale: 0, opacity: 0 },
		enter: { scale: 1, opacity: 1 },
		leave: { scale: 0, opacity: 0 },
		config: {
			tension: 180,
			friction: 12,
		},
		keys: item => item.id,
	})

	return transitions((vals, item) => (
		<Node
			key={item.id}
			id={item.id}
			label={item.label}
			draggable={draggable}
			onDrag={onDrag}
			onSelect={onSelect}
			color={item.color}
			position={item.position}
			animateValue={vals}
		/>
	))
}

export default memo(Nodes, isEqual)
