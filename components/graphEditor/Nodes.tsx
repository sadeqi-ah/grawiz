import React, { memo } from 'react'
import NodeComponent from '@components/graph/Node'
import { useTransition } from 'react-spring'
import Point from '@utils/shape/point'
import { isEqual } from 'lodash'
import { Node } from '@utils/graph/types'

export type NodesProps = {
	nodes: Node[]
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
		<NodeComponent
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
