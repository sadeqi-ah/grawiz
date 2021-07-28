import React, { createContext, useReducer } from 'react'
import { GraphEdge } from '@components/graph/Edge'
import { Tool } from '@components/graphEditor/Menu'
import { GraphNode } from '@components/graph/Node'
import Point from '@utils/shape/point'
import { Action } from './types'
import reducer, { ActionType, defultValue } from './reducer/graphEditorReducer'

export type GraphEditorProps = {
	activeTool: Tool
	nodes: GraphNode[]
	edges: GraphEdge[]
	previewEdge: Partial<GraphEdge>
	draggable: boolean
	selectedItems: (GraphEdge | GraphNode)[]
	selectionArea: {
		point: Point
		width: number
		height: number
	}
	lastNodeId: number
}

export const GraphEditorContext = createContext<GraphEditorProps>(defultValue)
export const GraphEditorDispatchContext = createContext<React.Dispatch<Action<ActionType, any>>>(() => null)

export const GraphEditorProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, defultValue)
	return (
		<GraphEditorDispatchContext.Provider value={dispatch}>
			<GraphEditorContext.Provider value={state}>{children}</GraphEditorContext.Provider>
		</GraphEditorDispatchContext.Provider>
	)
}
