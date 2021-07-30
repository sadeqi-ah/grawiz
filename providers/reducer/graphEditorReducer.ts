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
	| 'UPDATE_EDGE_DIRECTION'
	| 'UPDATE_EDGE_TYPE'
	| 'UPDATE_EDGE_WEIGHT'
	| 'DELETE_SELECTED_ITEMS'
	| 'UPDATE_NODE_COLOR'
	| 'UPDATE_NODE_LABEL'

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
				id: `node_${state.lastNodeId + 1}`,
				color: COLORS[(state.lastNodeId + 1) % COLORS.length],
				translate: Point.ZERO(),
			},
		],
		lastNodeId: state.lastNodeId + 1,
	}
}
actions.ADD_NEW_NODE = addNode

function updateEdgeWeight(state: GraphEditorProps, payload: any) {
	const edges = state.edges.map(edge => {
		if (edge.id !== payload.id) return edge
		return { ...edge, weight: payload.weight }
	})
	return { ...state, edges }
}

actions.UPDATE_EDGE_WEIGHT = updateEdgeWeight

function setNodeTranslate(state: GraphEditorProps, payload: any) {
	const { nodeId, translate } = payload
	return {
		...state,
		nodes: state.nodes.map(node => {
			if (node.id === nodeId) return { ...node, translate: translate } as GraphNode
			return node
		}),
		edges: state.edges.map(edge => {
			if (edge.source.id === nodeId) return { ...edge, source: { ...edge.source, translate } } as GraphEdge
			else if (edge.target.id === nodeId) return { ...edge, target: { ...edge.target, translate } } as GraphEdge
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
	return { ...state, edges: [...state.edges, { ...payload.newEdge, direction: 'none' }] }
}
actions.ADD_EDGE = addEdge

function updateEdgeDirection(state: GraphEditorProps, payload: any) {
	const edges = state.edges.map(edge => {
		if (edge.id !== payload.id) return edge
		if (payload.direction.length == 2) return { ...edge, direction: 'both' } as GraphEdge
		else if (payload.direction.length == 0) return { ...edge, direction: 'none' } as GraphEdge
		else return { ...edge, direction: payload.direction[0] } as GraphEdge
	})
	return { ...state, edges }
}
actions.UPDATE_EDGE_DIRECTION = updateEdgeDirection

function updateEdgeType(state: GraphEditorProps, payload: any) {
	const edges = state.edges.map(edge => {
		if (edge.id !== payload.id) return edge
		return { ...edge, type: payload.type }
	})
	return { ...state, edges }
}
actions.UPDATE_EDGE_TYPE = updateEdgeType

function updateNodeColor(state: GraphEditorProps, payload: any) {
	const nodes = state.nodes.map(node => {
		if (node.id !== payload.id) return node
		return { ...node, color: payload.color }
	})
	const edges = state.edges.map(edge => {
		if (edge.source.id == payload.id) return { ...edge, source: { ...edge.source, color: payload.color } }
		if (edge.target.id == payload.id) return { ...edge, target: { ...edge.target, color: payload.color } }
		return edge
	})
	return { ...state, nodes, edges }
}

actions.UPDATE_NODE_COLOR = updateNodeColor

function updateNodeLabel(state: GraphEditorProps, payload: any) {
	const nodes = state.nodes.map(node => {
		if (node.id !== payload.id) return node
		return { ...node, label: payload.label }
	})
	const edges = state.edges.map(edge => {
		if (edge.source.id == payload.id) return { ...edge, source: { ...edge.source, label: payload.label } }
		if (edge.target.id == payload.id) return { ...edge, target: { ...edge.target, label: payload.label } }
		return edge
	})
	return { ...state, nodes, edges }
}

actions.UPDATE_NODE_LABEL = updateNodeLabel

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

function deleteSelectedItems(state: GraphEditorProps, payload: any) {
	if (state.selectedItems.length == 0) return state
	let rmEdgesId: string[] = [],
		rmNodesId: string[] = []
	state.selectedItems.forEach(item => {
		if (item.hasOwnProperty('color')) rmNodesId.push((item as GraphNode).id)
		else rmEdgesId.push((item as GraphEdge).id)
	})
	return {
		...state,
		selectedItems: [],
		nodes: state.nodes.filter(node => !rmNodesId.includes(node.id)),
		edges: state.edges.filter(
			edge =>
				!rmEdgesId.includes(edge.id) &&
				!rmNodesId.includes(edge.source.id) &&
				!rmNodesId.includes(edge.target.id)
		),
	}
}
actions.DELETE_SELECTED_ITEMS = deleteSelectedItems

function clear(state: GraphEditorProps, payload: any) {
	return defultValue
}
actions.CLEAR = clear
