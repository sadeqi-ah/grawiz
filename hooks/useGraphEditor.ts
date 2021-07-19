import { useContext, useCallback } from 'react'
import { NODE_RADIUS } from '@constants'
import { GraphEditorContext, GraphEditorDispatchContext } from '@providers/GraphEditorProvider'
import Point from '@utils/shape/point'

export function useGraphEditor() {
	const state = useContext(GraphEditorContext)
	const dispatch = useContext(GraphEditorDispatchContext)

	const getNodeByLabel = useCallback((label: string) => state.nodes.find(node => node.label == label), [state.nodes])

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

	return { state, dispatch, getNodeByLabel, getNodeByPosition }
}
