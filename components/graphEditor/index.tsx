import React, { useCallback } from 'react'
import Menu, { Tool } from './Menu'
import Node from '@components/graph/Node'
import Edge from '@components/graph/Edge'
import Point from '@utils/shape/point'
import { useGraphEditor } from '@hooks/useGraphEditor'
import { useDrag } from 'react-use-gesture'
import SelectedItems from './SelectedItems'
// import EdgeToolbox from '@components/EdgeToolbox'

import styles from '@styles/GraphEditor.module.scss'

export default function GraphEditor() {
	const { state, dispatch, getNodeByLabel, getNodeByPosition } = useGraphEditor()

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

	const startDrawingEdge = (nodeLabel: string) => {
		if (state.activeTool === 'add-edge') {
			dispatch({
				type: 'SET_PREVIEW_EDGE',
				payload: {
					source: getNodeByLabel(nodeLabel),
				},
			})
		}
	}

	const drawEdge = (position: Point) => {
		if (state.activeTool == 'add-edge' && state.previewEdge.source) {
			const target = getNodeByPosition(position)
			dispatch({
				type: 'SET_PREVIEW_EDGE',
				payload: {
					target: target && target.label != state.previewEdge.source.label ? target : { position },
				},
			})
		}
	}

	const finishDrawingEdge = () => {
		if (state.previewEdge.target?.label) {
			dispatch({
				type: 'ADD_EDGE',
				payload: { newEdge: { source: state.previewEdge.source, target: state.previewEdge.target } },
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
		(translate: Point, label: string) => {
			dispatch({ type: 'SET_NODE_TRANSLATE', payload: { nodeLabel: label, translate } })
		},
		[dispatch]
	)

	const handleNodeSelect = useCallback(
		(label: string) => {
			const node = getNodeByLabel(label)
			if (node) dispatch({ type: 'ADD_SELECTED_ITEM', payload: node })
		},
		[getNodeByLabel, dispatch]
	)

	return (
		<div className={styles.container}>
			<div className={styles.board}>
				<svg {...handleDrag()} onClick={handleClick}>
					<defs>
						<marker
							id='arrow'
							orient='auto'
							viewBox='0 0 8 8'
							refX='8'
							refY='4'
							markerWidth='5'
							markerHeight='5'
						>
							<path d='M 0 0 L 8 4 L 0 8 z' fill='#343a40' />
						</marker>
					</defs>

					{state.previewEdge.source && state.previewEdge.target && (
						<Edge
							source={state.previewEdge.source.position.clone().add(state.previewEdge.source.translate)}
							target={state.previewEdge.target.position.clone().add(state.previewEdge.target.translate)}
							linked={Boolean(state.previewEdge.target.label)}
						/>
					)}

					{state.edges.map(edge => (
						<Edge
							key={`edge_${edge.source.label}${edge.target.label}`}
							source={edge.source.position.clone().add(edge.source.translate)}
							target={edge.target.position.clone().add(edge.target.translate)}
							linked={true}
						/>
					))}

					{state.nodes.map(node => (
						<Node
							key={`node_${node.label}`}
							label={node.label}
							draggable={state.draggable}
							onDrag={handleNodeDrag}
							onSelect={handleNodeSelect}
							color={node.color}
							position={node.position}
						/>
					))}

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
			{/* <EdgeToolbox /> */}
		</div>
	)
}
