import React, { useRef } from 'react'

import styles from '../../styles/GraphEditor.module.scss'

import Menu from './Menu'
import Node from '../graph/Node'
import Point from '../../utils/point'
import { useGraphEditor } from '../../hooks/useGraphEditor'

import dynamic from 'next/dynamic'
import EdgeToolbox from '../EdgeToolbox'

const Edges = dynamic(() => import('./Edges'), { ssr: false })

const nodeColors = ['#42D7F8', '#F45890', '#B15EFF', '#6FCF97']

export default function GraphEditor() {
	const { state, dispatch } = useGraphEditor()

	const svgRef = useRef<SVGSVGElement>(null)
	const nodeIdRef = useRef<number>(0)

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
		return nodeColors[Math.floor(Math.random() * nodeColors.length)]
	}

	const createNewLable = (): number => {
		nodeIdRef.current++
		return nodeIdRef.current - 1
	}

	return (
		<div className={styles.container}>
			<div className={styles.board}>
				<svg ref={svgRef} onClick={onClick}>
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
				</svg>
			</div>
			<Menu />
			<EdgeToolbox />
		</div>
	)
}
