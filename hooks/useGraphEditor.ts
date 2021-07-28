import { useContext, useCallback } from 'react'
import { NODE_RADIUS } from '@constants'
import { GraphEditorContext, GraphEditorDispatchContext } from '@providers/GraphEditorProvider'
import Point from '@utils/shape/point'
import { EdgeType } from '@components/graph/Edge'

export function useGraphEditor() {
	const state = useContext(GraphEditorContext)
	const dispatch = useContext(GraphEditorDispatchContext)

	const getNodeById = useCallback((id: string) => state.nodes.find(node => node.id == id), [state.nodes])

	const getNodeByPosition = useCallback(
		(position: Point) =>
			state.nodes.find(node => {
				const nodePos = node.position.clone().add(node.translate)
				return (
					nodePos.x - NODE_RADIUS <= position.x &&
					nodePos.x + NODE_RADIUS >= position.x &&
					nodePos.y + NODE_RADIUS >= position.y &&
					nodePos.y - NODE_RADIUS <= position.y
				)
			}),
		[state.nodes]
	)

	const typeEdge: (source: string | undefined, target: string | undefined) => EdgeType | undefined = useCallback(
		(source, target) => {
			if (source == undefined || target == undefined) return
			const edges = state.edges.filter(
				edge =>
					(edge.source.id == source && edge.target.id == target) ||
					(edge.source.id == target && edge.target.id == source)
			)

			if (edges.length >= 3) return
			const edgeTypes = edges.map(edge => edge.type)
			if (!edgeTypes.includes('straight')) return 'straight'
			if (!edgeTypes.includes('curve')) return 'curve'
			if (!edgeTypes.includes('reverse-curve')) return 'reverse-curve'
			return undefined
		},
		[state.edges]
	)

	return { state, dispatch, getNodeById, getNodeByPosition, typeEdge }
}
