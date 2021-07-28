import React, { memo } from 'react'
import Edge, { GraphEdge } from '@components/graph/Edge'
import isEqual from 'lodash/isEqual'

export type EdgesProps = {
	edges: GraphEdge[]
	previewEdge: Partial<GraphEdge>
}

const Edges = ({ edges, previewEdge }: EdgesProps) => {
	return (
		<>
			{previewEdge.source && previewEdge.target && (
				<Edge
					source={previewEdge.source.position.clone().add(previewEdge.source.translate)}
					target={previewEdge.target.position.clone().add(previewEdge.target.translate)}
					type={previewEdge.type}
					linked={previewEdge.target.id !== undefined}
				/>
			)}

			{edges.map(edge => (
				<Edge
					key={edge.id}
					source={edge.source.position.clone().add(edge.source.translate)}
					target={edge.target.position.clone().add(edge.target.translate)}
					type={edge.type}
					direction={edge.direction}
					linked={true}
					weight={edge.weight}
				/>
			))}
		</>
	)
}

export default memo(Edges, isEqual)
