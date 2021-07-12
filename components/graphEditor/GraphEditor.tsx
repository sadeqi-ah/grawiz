import React, { useRef } from 'react'

import styles from '../../styles/GraphEditor.module.scss'

import Menu from './Menu'
import Node from '../graph/Node'
import Point from '../../utils/point'
import { useGraphEditor } from '../../hooks/useGraphEditor'

import dynamic from 'next/dynamic'
import EdgeToolbox from '../EdgeToolbox'
import { COLORS } from '../../constants'
import { useDrag } from 'react-use-gesture'

const Edges = dynamic(() => import('./Edges'), { ssr: false })

export default function GraphEditor() {
	const { state, dispatch } = useGraphEditor()

	const nodeIdRef = useRef<number>(0)

	const bind = useDrag(
		({ event, xy: [x, y], movement: [mx, my], first, last }) => {
			if (event.target instanceof SVGSVGElement) {
				if (first) {
					dispatch({ type: 'SET_SELECTED_AREA', payload: { point: new Point(x, y) } })
				} else if (last) {
					dispatch({ type: 'SET_SELECTED_AREA', payload: { point: Point.ZERO(), width: 0, height: 0 } })
				} else {
					const width = Math.abs(mx)
					const height = Math.abs(my)
					const point = state.selectionArea.point
					if (mx < 0) point.x = x
					if (my < 0) point.y = y
					dispatch({ type: 'SET_SELECTED_AREA', payload: { point, width, height } })
				}
			}
		},
		{ useTouch: true }
	)

	const onClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
		if (state.activeTool == 'add-node') {
			const label = String(createNewLable())

			dispatch({
				type: 'ADD_NEW_NODE',
				payload: {
					newNode: {
						id: label,
						label,
						color: getRandomColor(),
						position: new Point(e.clientX, e.clientY),
						translate: Point.ZERO(),
					},
				},
			})
		}
	}

	const handleNodeDrag = (translate: Point, id: string) => {
		dispatch({ type: 'SET_NODE_TRANSLATE', payload: { nodeId: id, translate } })
	}

	const getRandomColor = (): string => {
		return COLORS[Math.floor(Math.random() * COLORS.length)]
	}

	const createNewLable = (): number => {
		nodeIdRef.current++
		return nodeIdRef.current - 1
	}

	return (
		<div className={styles.container}>
			<div className={styles.board}>
				<svg {...bind()} onClick={onClick}>
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

					<Edges />

					{state.nodes.map(node => (
						<Node
							key={node.id}
							draggable={state.draggable}
							id={node.id}
							onDrag={handleNodeDrag}
							label={node.label}
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
				</svg>
			</div>
			<Menu />
			{/* <EdgeToolbox /> */}
		</div>
	)
}
