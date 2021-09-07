import React, { useCallback, useEffect } from 'react'
import Menu, { Tool } from './Menu'
import Point from '@utils/shape/point'
import { useDrag } from 'react-use-gesture'
import SelectedItems from './SelectedItems'
import EdgeToolbox from '@components/graphEditor/EdgeToolbox'
import Nodes from './Nodes'
import Edges from './Edges'
import { useKeys } from '@hooks/useKeys'
import NodeToolbox from '@components/graphEditor/NodeToolbox'
import { useGraphEditorDispatch, useGraphEditorStore } from '@providers/graphEditor'

import styles from '@styles/GraphEditor.module.scss'
import { FullEdge, Node } from '@utils/graph/types'

export default function GraphEditor() {
	const state = useGraphEditorStore()
	const dispatch = useGraphEditorDispatch()

	useEffect(() => {
		function contextmenu(e: MouseEvent) {
			e.preventDefault()
		}
		document.addEventListener('contextmenu', contextmenu)
		return () => document.removeEventListener('contextmenu', contextmenu)
	}, [])

	/*
	 * Definition of shortcuts
	 * backspace: Delete selected items
	 * ctrl+s: active select tool
	 * ctrl+g: active node brush
	 * ctrl+e: active edge brush
	 * ctrl+d: clear page
	 */

	useKeys(
		{
			backspace: () => {
				if (state.selectedItems.nodes.length || state.selectedItems.edges.length)
					dispatch({ type: 'DELETE_SELECTED_ITEMS' })
			},
			'ctrl+s': () => dispatch({ type: 'SELECT_TOOL', payload: { toolName: 'select' } }),
			'ctrl+g': () => dispatch({ type: 'SELECT_TOOL', payload: { toolName: 'add-node' } }),
			'ctrl+e': () => dispatch({ type: 'SELECT_TOOL', payload: { toolName: 'add-edge' } }),
			'ctrl+d': () => dispatch({ type: 'CLEAR' }),
		},
		[state.selectedItems]
	)

	const startSelectingArea = (position: Point) => {
		dispatch({ type: 'CLEAR_SELECTED_ITEMS' })
		if (state.activeTool === 'select') {
			dispatch({ type: 'SET_SELECTED_AREA', payload: { point: position } })
		}
	}

	const finishAreaSelection = () => {
		if (state.activeTool === 'select')
			dispatch({ type: 'SET_SELECTED_AREA', payload: { point: Point.ZERO(), width: 0, height: 0 } })
	}

	const changeSelectionArea = (position: Point, movement: Point) => {
		if (state.activeTool === 'select') {
			const point = state.selectionArea.point
			if (movement.x < 0) point.x = position.x
			if (movement.y < 0) point.y = position.y
			dispatch({
				type: 'SET_SELECTED_AREA',
				payload: { point, width: Math.abs(movement.x), height: Math.abs(movement.y) },
			})
		}
	}

	const startDrawingEdge = (nodeId: string) => {
		if (state.activeTool === 'add-edge') {
			dispatch({
				type: 'SET_PREVIEW_EDGE',
				payload: {
					source: state.graph.getNode(nodeId),
					direction: 'normal',
				},
			})
		}
	}

	const drawEdge = (position: Point) => {
		if (state.activeTool == 'add-edge' && state.previewEdge.source) {
			const target = state.graph.getNode(position)
			const edgeType = target && state.graph.validEdgeType(state.previewEdge.source.id, target.id)
			const canDraw = target && target.id != state.previewEdge.source.id && edgeType
			dispatch({
				type: 'SET_PREVIEW_EDGE',
				payload: {
					target: canDraw ? target : { position },
					type: edgeType ? edgeType : 'straight',
					id: !canDraw ? undefined : `edge_${state.previewEdge.source.id}${target!.id}_${edgeType![0]}`,
				},
			})
		}
	}

	const finishDrawingEdge = () => {
		if (state.previewEdge.id && state.previewEdge.source && state.previewEdge.target) {
			dispatch({
				type: 'ADD_EDGE',
				payload: {
					source: state.previewEdge.source.id,
					target: state.previewEdge.target.id,
				},
			})
		}
		dispatch({ type: 'CLEAR_PREVIEW_EDGE' })
	}

	const handleDrag = useDrag(
		({ event: { target }, xy: [x, y], movement: [mx, my], first, last }) => {
			if (target instanceof SVGSVGElement) {
				if (first) startSelectingArea(new Point(x, y))
				else if (last) finishAreaSelection()
				else changeSelectionArea(new Point(x, y), new Point(mx, my))
			} else if (target instanceof SVGCircleElement) {
				if (first) startDrawingEdge(target.id)
				else if (last) finishDrawingEdge()
				else drawEdge(new Point(x, y))
			}
		},
		{ useTouch: true }
	)

	const handleClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
		if (state.activeTool == 'add-node') {
			dispatch({
				type: 'ADD_NEW_NODE',
				payload: {
					newNode: {
						position: new Point(e.clientX, e.clientY),
					},
				},
			})
		}
	}

	const handleMenu = useCallback(
		(active: Tool) => {
			dispatch({ type: active === 'clear' ? 'CLEAR' : 'SELECT_TOOL', payload: { toolName: active } })
		},
		[dispatch]
	)

	const handleNodeDrag = useCallback(
		(translate: Point, id: string) => {
			dispatch({ type: 'UPDATE_NODE', payload: { id, data: { translate } } })
		},
		[dispatch]
	)

	const handleNodeSelect = useCallback(
		(id: string) => {
			dispatch({ type: 'ADD_SELECTED_ITEM', payload: id })
		},
		[dispatch]
	)

	const handleNodeColor = useCallback(
		(id: string, color: string) => {
			dispatch({
				type: 'UPDATE_NODE',
				payload: { id, data: { color } },
			})
		},
		[dispatch]
	)

	const handleNodeLabel = useCallback(
		(id: string, label?: string | number) => {
			dispatch({
				type: 'UPDATE_NODE',
				payload: { id, data: { label } },
			})
		},
		[dispatch]
	)

	return (
		<>
			<div className={styles.board}>
				<svg {...handleDrag()} onClick={handleClick}>
					<defs>
						<marker
							id='arrow_right'
							orient='auto'
							viewBox='0 0 8 8'
							refX='8'
							refY='4'
							markerWidth='5'
							markerHeight='5'
						>
							<path d='M 0 0 L 8 4 L 0 8 z' fill='#343a40' />
						</marker>
						<marker
							id='arrow_left'
							orient='auto'
							viewBox='0 0 8 8'
							refX='0'
							refY='4'
							markerWidth='5'
							markerHeight='5'
						>
							<path d='M 0 4 L 8 0 L 8 8 z' fill='#343a40' />
						</marker>
					</defs>

					<Edges edges={state.graph.getFullEdges()} previewEdge={state.previewEdge} />

					<Nodes
						nodes={state.graph.nodes}
						onDrag={handleNodeDrag}
						onSelect={handleNodeSelect}
						draggable={state.draggable}
					/>

					<rect
						x={state.selectionArea.point.x}
						y={state.selectionArea.point.y}
						width={state.selectionArea.width}
						height={state.selectionArea.height}
						fill={`#42A1F810`}
						stroke={'#42A1F8'}
					/>
					<SelectedItems
						items={{
							nodes: state.selectedItems.nodes
								.map(id => state.graph.getNode(id))
								.filter((node): node is Node => !!node),
							edges: state.selectedItems.edges
								.map(id => state.graph.getFullEdge(id))
								.filter((edge): edge is FullEdge => !!edge),
						}}
					/>
				</svg>
			</div>
			<Menu active={state.activeTool} onUpdate={handleMenu} />
			<EdgeToolbox
				edge={
					state.selectedItems.nodes.length === 0 && state.selectedItems.edges.length === 1
						? state.graph.getFullEdge(state.selectedItems.edges[0])
						: undefined
				}
			/>
			<NodeToolbox
				node={
					state.selectedItems.nodes.length === 1 && state.selectedItems.edges.length === 0
						? state.graph.getNode(state.selectedItems.nodes[0])
						: undefined
				}
				onChangeNodeColor={handleNodeColor}
				onChangeNodeLabel={handleNodeLabel}
			/>
		</>
	)
}
