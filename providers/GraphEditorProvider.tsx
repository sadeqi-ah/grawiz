import React, { createContext, useReducer } from 'react'
import { GraphEdge } from '../components/graph/Edge'
import { Tool } from '../components/graphEditor/Menu'
import { GraphNode } from '../components/graph/Node'
import Point from '../utils/point'
import { Action } from './types'

type GraphEditorProps = {
	activeTool: Tool
	nodes: GraphNode[]
	edges: GraphEdge[]
	previewEdge: Partial<GraphEdge>
	draggable: boolean
}

export type ActionType =
	| 'ADD_NEW_NODE'
	| 'SELECT_TOOL'
	| 'CLEAR'
	| 'SET_PREVIEW_EDGE'
	| 'CLEAR_PREVIEW_EDGE'
	| 'SET_NODE_TRANSLATE'
	| 'ADD_EDGE'

const defultValue: GraphEditorProps = {
	activeTool: 'select',
	nodes: [],
	edges: [],
	previewEdge: {},
	draggable: true,
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
function reducer(state: GraphEditorProps, action: Action<ActionType, any>): GraphEditorProps {
	const { type, payload } = action
	switch (type) {
		case 'SELECT_TOOL':
			return { ...state, activeTool: payload.toolName, draggable: payload.toolName === 'select' ? true : false }
		case 'ADD_NEW_NODE':
			return { ...state, nodes: [...state.nodes, payload.newNode] }
		case 'SET_NODE_TRANSLATE':
			return setNodeTranslate(state, payload.nodeId, payload.translate)
		case 'SET_PREVIEW_EDGE':
			return { ...state, previewEdge: { ...state.previewEdge, ...payload } }
		case 'CLEAR_PREVIEW_EDGE':
			return { ...state, previewEdge: {} }
		case 'ADD_EDGE':
			return { ...state, edges: [...state.edges, payload.newEdge] }
		case 'CLEAR':
			return defultValue
		default:
			return defultValue
	}
}

function setNodeTranslate(state: GraphEditorProps, nodeId: string, translate: Point): GraphEditorProps {
	return {
		...state,
		nodes: state.nodes.map(node => {
			if (node.id === nodeId) node.translate = translate
			return node
		}),
		edges: state.edges.map(edge => {
			if (edge.source.id === nodeId) edge.source.translate = translate
			else if (edge.target.id === nodeId) edge.target.translate = translate
			return edge
		}),
	}
}
