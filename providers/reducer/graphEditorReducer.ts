import { COLORS, NODE_RADIUS } from '@constants'
import { calcEdgePosition, GraphEdge } from '@components/graph/Edge'
import { Action } from '@providers/types'
import { GraphEditorProps } from '@providers/GraphEditorProvider'
import { GraphNode } from '@components/graph/Node'
import Point from '@utils/shape/point'
import Quadbezier from '@utils/shape/quadbezier'
import Rectangle from '@utils/shape/rectangle'
import Line from '@utils/shape/line'

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

export const defultValue: GraphEditorProps = {
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
	lastLabel: -1,
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

function selectTool(state: GraphEditorProps, payload: any) {
	return { ...state, activeTool: payload.toolName, draggable: payload.toolName === 'select' ? true : false }
}
actions.SELECT_TOOL = selectTool

function addNode(state: GraphEditorProps, payload: any) {
	return {
		...state,
		nodes: [
			...state.nodes,
			{
				...payload.newNode,
				label: state.lastLabel + 1,
				color: COLORS[(state.lastLabel + 1) % COLORS.length],
				translate: Point.ZERO(),
			},
		],
		lastLabel: state.lastLabel + 1,
	}
}
actions.ADD_NEW_NODE = addNode

function setNodeTranslate(state: GraphEditorProps, payload: any) {
	const { nodeLabel: nodeLabel, translate } = payload
	return {
		...state,
		nodes: state.nodes.map(node => {
			if (node.label === nodeLabel) node.translate = translate
			return node
		}),
		edges: state.edges.map(edge => {
			if (edge.source.label === nodeLabel) edge.source.translate = translate
			else if (edge.target.label === nodeLabel) edge.target.translate = translate
			return edge
		}),
	}
}
actions.SET_NODE_TRANSLATE = setNodeTranslate

function setPreviewEdge(state: GraphEditorProps, payload: any) {
	return { ...state, previewEdge: { ...state.previewEdge, ...payload } }
}
actions.SET_PREVIEW_EDGE = setPreviewEdge

function clearPreviewEdge(state: GraphEditorProps, payload: any) {
	return { ...state, previewEdge: {} }
}
actions.CLEAR_PREVIEW_EDGE = clearPreviewEdge

function addEdge(state: GraphEditorProps, payload: any) {
	return { ...state, edges: [...state.edges, payload.newEdge] }
}
actions.ADD_EDGE = addEdge

function setSelectedArea(state: GraphEditorProps, payload: any) {
	return {
		...state,
		selectionArea: { ...state.selectionArea, ...payload },
		selectedItems: setSelectedItem(state, { ...state.selectionArea, ...payload }),
	}
}
actions.SET_SELECTED_AREA = setSelectedArea

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

		if (control) {
			const q = new Quadbezier(first, control, last)
			return q.intersectionWithRect(rect)
		}

		const line = new Line(first, last)
		return line.intersectionWithRect(rect)
	})

	return [...nodes, ...edges]
}

function addSelectedItem(state: GraphEditorProps, payload: any) {
	return {
		...state,
		selectedItems: [payload],
	}
}
actions.ADD_SELECTED_ITEM = addSelectedItem

function clearSelectedItems(state: GraphEditorProps, payload: any) {
	return {
		...state,
		selectedItems: [],
	}
}
actions.CLEAR_SELECTED_ITEMS = clearSelectedItems

function clear(state: GraphEditorProps, payload: any) {
	return defultValue
}
actions.CLEAR = clear
