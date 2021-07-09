import { useContext } from 'react'
import { Tool } from '../components/graphEditor/Menu'
import { ActionType, GraphEditorContext, GraphEditorDispatchContext } from '../providers/GraphEditorProvider'
import { Action } from '../providers/types'
import Point from '../utils/point'

export function useGraphEditor() {
	const state = useContext(GraphEditorContext)
	const dispatch = useContext(GraphEditorDispatchContext)

	const getNodeById = (id: string) => state.nodes.find(node => node.id == id)

	const getNodeByPosition = (position: Point) =>
		state.nodes.find(
			node =>
				node.position.x - 20 <= position.x &&
				node.position.x + 20 >= position.x &&
				node.position.y + 20 >= position.y &&
				node.position.y - 20 <= position.y
		)

	return { state, dispatch, getNodeById, getNodeByPosition }
}
