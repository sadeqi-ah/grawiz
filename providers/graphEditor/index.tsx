import React, { createContext, useContext, useReducer } from 'react'
import { GraphEdge } from '@components/graph/Edge'
import { Tool } from '@components/graphEditor/Menu'
import Point from '@utils/shape/point'
import { Action } from '../types'
import reducer, { ActionType, defaultValue } from './reducer'
import { Edge, Graph } from '@utils/graph/types'

export type GraphEditorProps = {
	activeTool: Tool
	graph: Graph
	previewEdge: Partial<Edge>
	draggable: boolean
	selectedItems: SelectedItems
	selectionArea: {
		point: Point
		width: number
		height: number
	}
	lastNodeId: number
}

export type SelectedItems = {
	edges: string[]
	nodes: string[]
}

export const GraphEditorContext = createContext<GraphEditorProps>(defaultValue)
export const GraphEditorDispatchContext = createContext<React.Dispatch<Action<ActionType, any>>>(() => null)

export const GraphEditorProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, defaultValue)
	return (
		<GraphEditorDispatchContext.Provider value={dispatch}>
			<GraphEditorContext.Provider value={state}>{children}</GraphEditorContext.Provider>
		</GraphEditorDispatchContext.Provider>
	)
}

export const useGraphEditorStore = () => useContext(GraphEditorContext)
export const useGraphEditorDispatch = () => useContext(GraphEditorDispatchContext)
