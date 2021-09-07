import React, { memo } from 'react'
import EdgeComponent from '@components/graph/Edge'
import isEqual from 'lodash/isEqual'
import { FullEdge, PreviewEdge } from '@utils/graph/types'

export type EdgesProps = {
	edges: FullEdge[]
	previewEdge: PreviewEdge
}

const Edges = ({ edges, previewEdge }: EdgesProps) => {
	return (
		<>
			{previewEdge.source && previewEdge.target && (
				<EdgeComponent
					source={previewEdge.source.position.clone().add(previewEdge.source.translate)}
					target={previewEdge.target.position.clone().add(previewEdge.target.translate)}
					type={previewEdge.type}
					direction={previewEdge.direction}
					linked={previewEdge.target.id !== undefined}
				/>
			)}

			{edges.map(edge => (
				<EdgeComponent
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
