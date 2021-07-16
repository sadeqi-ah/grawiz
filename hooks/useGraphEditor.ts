import { useContext, useCallback } from 'react'
import { NODE_RADIUS } from '@constants'
import { GraphEditorContext, GraphEditorDispatchContext } from '@providers/GraphEditorProvider'
import Point from '@utils/point'

export function useGraphEditor() {
	const state = useContext(GraphEditorContext)
	const dispatch = useContext(GraphEditorDispatchContext)

	const getNodeByLabel = useCallback((label: string) => state.nodes.find(node => node.label == label), [state.nodes])

	const getNodeByPosition = useCallback(
		(position: Point) =>
			state.nodes.find(
				node =>
					node.position.x - NODE_RADIUS <= position.x &&
					node.position.x + NODE_RADIUS >= position.x &&
					node.position.y + NODE_RADIUS >= position.y &&
					node.position.y - NODE_RADIUS <= position.y
			),
		[state.nodes]
	)

	return { state, dispatch, getNodeByLabel, getNodeByPosition }
}
