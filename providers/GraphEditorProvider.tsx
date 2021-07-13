import React, { createContext, useReducer } from 'react'
import { calcEdgePosition, GraphEdge } from '../components/graph/Edge'
import { Tool } from '../components/graphEditor/Menu'
import { GraphNode } from '../components/graph/Node'
import Point from '../utils/point'
import { Action } from './types'
import { NODE_RADIUS } from '../constants'
import { between, equation } from '../utils/helper'

type GraphEditorProps = {
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
}

export type ActionType =
	| 'ADD_NEW_NODE'
	| 'SELECT_TOOL'
	| 'CLEAR'
	| 'SET_PREVIEW_EDGE'
	| 'CLEAR_PREVIEW_EDGE'
	| 'SET_NODE_TRANSLATE'
	| 'ADD_EDGE'
	| 'SET_SELECTED_AREA'
	| 'ADD_SELECTED_ITEM'
	| 'CLEAR_SELECTED_ITEMS'

const defultValue: GraphEditorProps = {
	activeTool: 'select',
	nodes: [],
	edges: [],
	previewEdge: {},
	draggable: true,
	selectedItems: [],
	selectionArea: {
		point: Point.ZERO(),
		width: 0,
		height: 0,
	},
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
			return setNodeTranslate(state, payload.nodeLable, payload.translate)
		case 'SET_PREVIEW_EDGE':
			return { ...state, previewEdge: { ...state.previewEdge, ...payload } }
		case 'CLEAR_PREVIEW_EDGE':
			return { ...state, previewEdge: {} }
		case 'ADD_EDGE':
			return { ...state, edges: [...state.edges, payload.newEdge] }
		case 'SET_SELECTED_AREA':
			return {
				...state,
				selectionArea: { ...state.selectionArea, ...payload },
				selectedItems: setSelectedItem(state, { ...state.selectionArea, ...payload }),
			}
		case 'ADD_SELECTED_ITEM':
			return {
				...state,
				selectedItems: [payload],
			}
		case 'CLEAR_SELECTED_ITEMS':
			return {
				...state,
				selectedItems: [],
			}
		case 'CLEAR':
			return defultValue
		default:
			return defultValue
	}
}

function setNodeTranslate(state: GraphEditorProps, nodeLable: string, translate: Point): GraphEditorProps {
	return {
		...state,
		nodes: state.nodes.map(node => {
			if (node.label === nodeLable) node.translate = translate
			return node
		}),
		edges: state.edges.map(edge => {
			if (edge.source.label === nodeLable) edge.source.translate = translate
			else if (edge.target.label === nodeLable) edge.target.translate = translate
			return edge
		}),
	}
}

function setSelectedItem(
	state: GraphEditorProps,
	selectionArea: { point: Point; width: number; height: number }
): (GraphEdge | GraphNode)[] {
	if (
		selectionArea.width == 0 ||
		selectionArea.height == 0 ||
		selectionArea.point.x == 0 ||
		selectionArea.point.y == 0
	) {
		return state.selectedItems
	}

	const nodes = state.nodes.slice().filter(node => {
		const nodeOffset = node.position.clone().add(node.translate)
		return (
			nodeOffset.x + NODE_RADIUS >= selectionArea.point.x &&
			nodeOffset.x - NODE_RADIUS <= selectionArea.point.x + selectionArea.width &&
			nodeOffset.y + NODE_RADIUS >= selectionArea.point.y &&
			nodeOffset.y - NODE_RADIUS <= selectionArea.point.y + selectionArea.height
		)
	})

	const edges = state.edges.slice().filter(edge => {
		if (nodes.includes(edge.source) || nodes.includes(edge.target)) return edge
		const { first, last, control } = calcEdgePosition(
			edge.source.position.clone().add(edge.source.translate),
			edge.target.position.clone().add(edge.target.translate),
			'curve'
		)

		const slope = Point.slope(first, last)

		const y1 = equation(slope, first, { x: selectionArea.point.x }, [first.y, last.y])
		const x1 = equation(slope, first, { y: selectionArea.point.y }, [first.x, last.x])

		const y2 = equation(slope, first, { x: selectionArea.point.x + selectionArea.width }, [first.y, last.y])
		const x2 = equation(slope, first, { y: selectionArea.point.y + selectionArea.height }, [first.x, last.x])

		return (
			between(y1, selectionArea.point.y + selectionArea.height, selectionArea.point.y) ||
			between(y2, selectionArea.point.y + selectionArea.height, selectionArea.point.y) ||
			between(x1, selectionArea.point.x + selectionArea.width, selectionArea.point.x) ||
			between(x2, selectionArea.point.x + selectionArea.width, selectionArea.point.x)
		)
	})

	return [...nodes, ...edges]
}
