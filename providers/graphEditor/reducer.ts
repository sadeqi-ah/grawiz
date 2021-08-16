import { COLORS, NODE_RADIUS } from '@constants'
import { calcEdgePosition } from '@components/graph/Edge'
import { Action } from '@providers/types'
import { GraphEditorProps, SelectedItems } from './'
import Point from '@utils/shape/point'
import Quadbezier from '@utils/shape/quadbezier'
import Rectangle from '@utils/shape/rectangle'
import Line from '@utils/shape/line'
import { Edge, Node } from '@utils/graph/types'

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
	| 'UPDATE_EDGE_DIRECTION'
	| 'UPDATE_EDGE_TYPE'
	| 'UPDATE_EDGE_WEIGHT'
	| 'DELETE_SELECTED_ITEMS'
	| 'UPDATE_NODE_COLOR'
	| 'UPDATE_NODE_LABEL'

export const defaultSelectedItems = {
	nodes: [],
	edges: [],
}

export const defaultGraph = {
	nodes: [],
	edges: [],
}

export const defaultValue: GraphEditorProps = {
	activeTool: 'select',
	graph: defaultGraph,
	previewEdge: {},
	draggable: true,
	selectedItems: defaultSelectedItems,
	selectionArea: {
		point: Point.ZERO(),
		width: 0,
		height: 0,
	},
	lastNodeId: -1,
}

type Actions = {
	[key in ActionType]: (state: GraphEditorProps, payload: any) => GraphEditorProps
}

const actions: Partial<Actions> = {}

export default function reducer(state: GraphEditorProps, action: Action<ActionType, any>): GraphEditorProps {
	const { type, payload } = action

	const _action = actions[type]
	if (_action) return _action(state, payload)
	else throw new Error('unexpected action type')
}

actions.SELECT_TOOL = function (state: GraphEditorProps, payload: any) {
	return {
		...state,
		activeTool: payload.toolName,
		draggable: payload.toolName === 'select' ? true : false,
		selectedItems: defaultSelectedItems,
	}
}

actions.ADD_NEW_NODE = function (state: GraphEditorProps, payload: any) {
	const { graph } = state
	return {
		...state,
		graph: {
			...graph,
			nodes: [
				...graph.nodes,
				{
					...payload.newNode,
					id: `node_${state.lastNodeId + 1}`,
					color: COLORS[(state.lastNodeId + 1) % COLORS.length],
					translate: Point.ZERO(),
				},
			],
		},
		lastNodeId: state.lastNodeId + 1,
	}
}

actions.UPDATE_EDGE_WEIGHT = function (state: GraphEditorProps, payload: any) {
	const { graph } = state

	const edges = graph.edges.map(edge => {
		if (edge.id !== payload.id) return edge
		return { ...edge, weight: payload.weight }
	})
	return {
		...state,
		graph: {
			...graph,
			edges,
		},
	}
}

actions.SET_NODE_TRANSLATE = function (state: GraphEditorProps, payload: any) {
	const { nodeId, translate } = payload
	return {
		...state,
		graph: {
			nodes: state.graph.nodes.map(node => {
				if (node.id === nodeId) return { ...node, translate: translate } as Node
				return node
			}),
			edges: state.graph.edges.map(edge => {
				if (edge.source.id === nodeId) return { ...edge, source: { ...edge.source, translate } } as Edge
				else if (edge.target.id === nodeId) return { ...edge, target: { ...edge.target, translate } } as Edge
				return edge
			}),
		},
	}
}

actions.SET_PREVIEW_EDGE = function (state: GraphEditorProps, payload: any) {
	return { ...state, previewEdge: { ...state.previewEdge, ...payload } }
}

actions.CLEAR_PREVIEW_EDGE = function (state: GraphEditorProps, payload: any) {
	return { ...state, previewEdge: {} }
}

actions.ADD_EDGE = function (state: GraphEditorProps, payload: any) {
	const { graph } = state
	return {
		...state,
		graph: {
			...graph,
			edges: [...state.graph.edges, { ...payload.newEdge, direction: 'none' }],
		},
	}
}

actions.UPDATE_EDGE_DIRECTION = function (state: GraphEditorProps, payload: any) {
	const { graph } = state

	const edges = state.graph.edges.map(edge => {
		if (edge.id !== payload.id) return edge
		if (payload.direction.length == 2) return { ...edge, direction: 'both' } as Edge
		else if (payload.direction.length == 0) return { ...edge, direction: 'none' } as Edge
		else return { ...edge, direction: payload.direction[0] } as Edge
	})
	return {
		...state,
		graph: {
			...graph,
			edges,
		},
	}
}

actions.UPDATE_EDGE_TYPE = function (state: GraphEditorProps, payload: any) {
	const { graph } = state

	let newEdge: Edge | undefined
	const edges = state.graph.edges.map(edge => {
		if (edge.id !== payload.id) return edge
		newEdge = { ...edge, type: payload.type }
		return newEdge
	})

	return {
		...state,
		graph: {
			...graph,
			edges,
		},
	}
}

actions.UPDATE_NODE_COLOR = function (state: GraphEditorProps, payload: any) {
	const nodes = state.graph.nodes.map(node => {
		if (node.id !== payload.id) return node
		return { ...node, color: payload.color }
	})
	const edges = state.graph.edges.map(edge => {
		if (edge.source.id == payload.id) return { ...edge, source: { ...edge.source, color: payload.color } }
		if (edge.target.id == payload.id) return { ...edge, target: { ...edge.target, color: payload.color } }
		return edge
	})
	return { ...state, graph: { nodes, edges } }
}

actions.UPDATE_NODE_LABEL = function (state: GraphEditorProps, payload: any) {
	const nodes = state.graph.nodes.map(node => {
		if (node.id !== payload.id) return node
		return { ...node, label: payload.label }
	})
	const edges = state.graph.edges.map(edge => {
		if (edge.source.id == payload.id) return { ...edge, source: { ...edge.source, label: payload.label } }
		if (edge.target.id == payload.id) return { ...edge, target: { ...edge.target, label: payload.label } }
		return edge
	})
	return { ...state, graph: { nodes, edges } }
}

actions.SET_SELECTED_AREA = function (state: GraphEditorProps, payload: any) {
	const selectedItems = setSelectedItem(state, { ...state.selectionArea, ...payload })
	return {
		...state,
		selectionArea: { ...state.selectionArea, ...payload },
		selectedItems: selectedItems,
		draggable: selectedItems.nodes.length == 0 && selectedItems.edges.length == 0,
	}
}

function setSelectedItem(
	state: GraphEditorProps,
	selectionArea: { point: Point; width: number; height: number }
): SelectedItems {
	if (
		selectionArea.width == 0 ||
		selectionArea.height == 0 ||
		selectionArea.point.x == 0 ||
		selectionArea.point.y == 0
	) {
		return state.selectedItems
	}

	const nodes = state.graph.nodes
		.slice()
		.filter(node => {
			const nodeOffset = node.position.clone().add(node.translate)
			return (
				nodeOffset.x + NODE_RADIUS >= selectionArea.point.x &&
				nodeOffset.x - NODE_RADIUS <= selectionArea.point.x + selectionArea.width &&
				nodeOffset.y + NODE_RADIUS >= selectionArea.point.y &&
				nodeOffset.y - NODE_RADIUS <= selectionArea.point.y + selectionArea.height
			)
		})
		.map(node => node.id)

	const edges = state.graph.edges
		.slice()
		.filter(edge => {
			const { first, last, control } = calcEdgePosition(
				edge.source.position.clone().add(edge.source.translate),
				edge.target.position.clone().add(edge.target.translate),
				edge.type
			)

			const rect = new Rectangle(
				new Point(
					Math.min(selectionArea.point.x, selectionArea.point.x + selectionArea.width),
					Math.min(selectionArea.point.y, selectionArea.point.y + selectionArea.height)
				),
				new Point(
					Math.max(selectionArea.point.x, selectionArea.point.x + selectionArea.width),
					Math.max(selectionArea.point.y, selectionArea.point.y + selectionArea.height)
				)
			)

			if (control) return new Quadbezier(first, control, last).intersectionWithRect(rect)
			return new Line(first, last).intersectionWithRect(rect)
		})
		.map(edge => edge.id)

	return { nodes, edges }
}

actions.ADD_SELECTED_ITEM = function (state: GraphEditorProps, payload: any) {
	return {
		...state,
		selectedItems: {
			nodes: [payload],
			edges: [],
		},
		draggable: false,
	}
}

actions.CLEAR_SELECTED_ITEMS = function (state: GraphEditorProps, payload: any) {
	return {
		...state,
		selectedItems: defaultSelectedItems,
		draggable: state.activeTool === 'select',
	}
}

actions.DELETE_SELECTED_ITEMS = function (state: GraphEditorProps, payload: any) {
	if (state.selectedItems.nodes.length == 0 && state.selectedItems.edges.length == 0) return state
	return {
		...state,
		selectedItems: defaultSelectedItems,
		graph: {
			nodes: state.graph.nodes.filter(node => !state.selectedItems.nodes.includes(node.id)),
			edges: state.graph.edges.filter(
				edge =>
					!state.selectedItems.edges.includes(edge.id) &&
					!state.selectedItems.nodes.includes(edge.source.id) &&
					!state.selectedItems.nodes.includes(edge.target.id)
			),
		},
	}
}

actions.CLEAR = function (state: GraphEditorProps, payload: any) {
	return defaultValue
}
