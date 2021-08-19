import { COLORS, NODE_RADIUS } from '@constants'
import { calcEdgePosition } from '@components/graph/Edge'
import { Action } from '@providers/types'
import { GraphEditorProps, SelectedItems } from './'
import Point from '@utils/shape/point'
import Quadbezier from '@utils/shape/quadbezier'
import Rectangle from '@utils/shape/rectangle'
import Line from '@utils/shape/line'
import Graph from '@utils/graph'

export type ActionType =
	| 'ADD_NEW_NODE'
	| 'ADD_EDGE'
	| 'UPDATE_NODE'
	| 'UPDATE_EDGE'
	| 'SELECT_TOOL'
	| 'CLEAR'
	| 'SET_PREVIEW_EDGE'
	| 'CLEAR_PREVIEW_EDGE'
	| 'SET_NODE_TRANSLATE'
	| 'SET_SELECTED_AREA'
	| 'ADD_SELECTED_ITEM'
	| 'CLEAR_SELECTED_ITEMS'
	| 'DELETE_SELECTED_ITEMS'

export const defaultSelectedItems = {
	nodes: [],
	edges: [],
}

export const defaultValue: GraphEditorProps = {
	activeTool: 'select',
	graph: new Graph(),
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
		graph: graph.clone().addNode({
			...payload.newNode,
			id: `node_${state.lastNodeId + 1}`,
			color: COLORS[(state.lastNodeId + 1) % COLORS.length],
			translate: Point.ZERO(),
		}),
		lastNodeId: state.lastNodeId + 1,
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

	const newGraph = graph.clone().addEdge(payload.source, payload.target)
	return {
		...state,
		graph: newGraph || graph,
	}
}

actions.UPDATE_EDGE = function (state: GraphEditorProps, payload: any) {
	const { graph } = state
	return {
		...state,
		graph: graph.clone().updateEdge(payload.id, payload.data),
	}
}

actions.UPDATE_NODE = function (state: GraphEditorProps, payload: any) {
	const { graph } = state
	const newGraph = graph.clone().updateNode(payload.id, payload.data)
	return { ...state, graph: newGraph }
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
		.filter(edge => {
			const source = state.graph.getNode(edge.source)
			const target = state.graph.getNode(edge.target)
			if (!source || !target) return false
			const { first, last, control } = calcEdgePosition(
				source.position.clone().add(source.translate),
				target.position.clone().add(target.translate),
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
	const { graph } = state
	const newGraph = graph.clone()
	state.selectedItems.nodes.forEach(id => newGraph.deleteNode(id))
	state.selectedItems.edges.forEach(id => newGraph.deleteEdge(id))

	return {
		...state,
		selectedItems: defaultSelectedItems,
		graph: newGraph,
	}
}

actions.CLEAR = function (state: GraphEditorProps, payload: any) {
	return defaultValue
}
