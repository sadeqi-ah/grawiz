import React, { useCallback, useEffect } from 'react'
import Menu, { Tool } from './Menu'
import { GraphEdge } from '@components/graph/Edge'
import Point from '@utils/shape/point'
import { useGraphEditor } from '@hooks/useGraphEditor'
import { useDrag } from 'react-use-gesture'
import SelectedItems from './SelectedItems'
import EdgeToolbox from '@components/EdgeToolbox'

import styles from '@styles/GraphEditor.module.scss'
import Nodes from './Nodes'
import Edges from './Edges'
import { useKeys } from '@hooks/useKeys'
import NodeToolbox from '@components/NodeToolbox'
import { GraphNode } from '@components/graph/Node'

export default function GraphEditor() {
	const { state, dispatch, getNodeById, getNodeByPosition, typeEdge } = useGraphEditor()

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
				if (state.selectedItems.length) dispatch({ type: 'DELETE_SELECTED_ITEMS' })
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
					source: getNodeById(nodeId),
				},
			})
		}
	}

	const drawEdge = (position: Point) => {
		if (state.activeTool == 'add-edge' && state.previewEdge.source) {
			const target = getNodeByPosition(position)
			const edgeType = typeEdge(state.previewEdge.source.id, target?.id)

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
		if (state.previewEdge.id) {
			dispatch({
				type: 'ADD_EDGE',
				payload: {
					newEdge: {
						id: state.previewEdge.id,
						source: state.previewEdge.source,
						target: state.previewEdge.target,
						type: state.previewEdge.type,
					},
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
			dispatch({ type: 'SET_NODE_TRANSLATE', payload: { nodeId: id, translate } })
		},
		[dispatch]
	)

	const handleNodeSelect = useCallback(
		(id: string) => {
			const node = getNodeById(id)
			if (node) dispatch({ type: 'ADD_SELECTED_ITEM', payload: node })
		},
		[getNodeById, dispatch]
	)

	const handleEdgeDirection = useCallback(
		(id: string, direction: string[]) => dispatch({ type: 'UPDATE_EDGE_DIRECTION', payload: { id, direction } }),
		[dispatch]
	)

	const handleEdgeType = useCallback(
		(id: string, type: string) => dispatch({ type: 'UPDATE_EDGE_TYPE', payload: { id, type } }),
		[dispatch]
	)

	const handleEdgeWeight = useCallback(
		(id: string, weight?: string | number) =>
			dispatch({
				type: 'UPDATE_EDGE_WEIGHT',
				payload: { id, weight: weight !== undefined ? Number(weight) : weight },
			}),
		[dispatch]
	)

	const handleNodeColor = useCallback(
		(id: string, color: string) => {
			dispatch({
				type: 'UPDATE_NODE_COLOR',
				payload: { id, color },
			})
		},
		[dispatch]
	)

	const handleNodeLabel = useCallback(
		(id: string, label?: string | number) => {
			dispatch({
				type: 'UPDATE_NODE_LABEL',
				payload: { id, label },
			})
		},
		[dispatch]
	)

	return (
		<div className={styles.container}>
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

					<Edges edges={state.edges} previewEdge={state.previewEdge} />

					<Nodes
						nodes={state.nodes}
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
					<SelectedItems />
				</svg>
			</div>
			<Menu active={state.activeTool} onUpdate={handleMenu} />
			<EdgeToolbox
				edge={
					state.selectedItems.length === 1 && !state.selectedItems[0].hasOwnProperty('color')
						? (state.selectedItems[0] as GraphEdge)
						: undefined
				}
				onChangeDirection={handleEdgeDirection}
				onChangeEdgeType={handleEdgeType}
				onChangeWeight={handleEdgeWeight}
			/>
			<NodeToolbox
				node={
					state.selectedItems.length === 1 && state.selectedItems[0].hasOwnProperty('color')
						? (state.selectedItems[0] as GraphNode)
						: undefined
				}
				onChangeNodeColor={handleNodeColor}
				onChangeNodeLabel={handleNodeLabel}
			/>
		</div>
	)
}
