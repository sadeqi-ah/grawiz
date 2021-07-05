import React, { useRef, useState, useEffect } from 'react'

import styles from '../../styles/GraphEditor.module.scss'

import Menu, { menuItem } from './Menu'
import Node, { GraphNode } from './Node'
import Edge, { GraphDirectedEdge } from './Edge'
import Point from '../../utils/point'

const nodeColors = ['#42D7F8', '#F45890', '#B15EFF', '#6FCF97']

export default function GraphEditor() {
	const [select, setSelect] = useState<string>(menuItem.SELECT)
	const [nodes, setNodes] = useState<GraphNode[]>([])
	const [links, setLinks] = useState<GraphDirectedEdge[]>([])
	const [edge, setEdge] = useState<Partial<GraphDirectedEdge>>({})
	const [draggable, setDraggable] = useState<boolean>(true)

	const svgRef = useRef<SVGSVGElement>(null)
	const nodeIdRef = useRef<number>(0)

	useEffect(() => {
		switch (select) {
			case menuItem.SELECT:
				setDraggable(true)
				break
			case menuItem.ADD_NODE:
				setDraggable(false)
				break
			case menuItem.ADD_EDGE:
				setDraggable(false)
				break
			case menuItem.CLEAR:
				setDraggable(false)
				break
			default:
				break
		}
	}, [select])

	const onClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
		if (select == menuItem.ADD_NODE) {
			const label = String(createNewLable())
			setNodes(prev => [
				...prev,
				{
					id: label,
					label,
					color: getRandomColor(),
					position: new Point(e.clientX, e.clientY),
					translate: Point.ZERO(),
				},
			])
		}
	}

	const handleMouseDown = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
		if (select == menuItem.ADD_EDGE && e.target instanceof SVGCircleElement)
			setEdge({ source: nodes.find(_node => _node.id == (e.target as SVGCircleElement).id) })
	}

	const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
		if (
			select == menuItem.ADD_EDGE &&
			edge.source &&
			edge.source.position.x != e.clientX &&
			edge.source.position.y != e.clientY
		) {
			if (e.target instanceof SVGCircleElement && e.target.id != edge.source.id) {
				setEdge(prev => ({
					...prev,

					target: nodes.find(_node => _node.id == (e.target as SVGCircleElement).id),
				}))
			} else {
				setEdge(prev => ({
					...prev,
					target: { position: new Point(e.clientX, e.clientY) },
				}))
			}
		}
	}

	const handleMouseUp = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
		if (select == menuItem.ADD_EDGE && edge.source && edge.target && edge.target.id) {
			setLinks(prev => {
				return [
					...prev,
					{
						source: edge.source as GraphNode,
						target: edge.target as GraphNode,
					},
				]
			})
		}
		if (edge.source) setEdge({})
	}

	const handlerNodeDrag = (translate: Point, id: string) => {
		setNodes(prev =>
			prev.map(node => {
				if (node.id === id) node.translate = translate
				return node
			})
		)

		if (links.length) {
			setLinks(prev =>
				prev.map(link => {
					if (link.source.id === id) {
						link.source.translate = translate
					} else if (link.target.id === id) {
						link.target.translate = translate
					}

					return link
				})
			)
		}
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
				<svg
					ref={svgRef}
					onClick={onClick}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
				>
					<defs>
						<marker
							id='head'
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

					{edge.source && edge.target && (
						<Edge
							source={edge.source.position
								.clone()
								.add(edge.source.translate ? edge.source.translate : Point.ZERO())}
							target={edge.target.position
								.clone()
								.add(edge.target.translate ? edge.target.translate : Point.ZERO())}
							linked={edge.target.id != undefined}
						/>
					)}

					{links.map(link => (
						<Edge
							key={`link_${link.source.id}${link.target.id}`}
							source={link.source.position
								.clone()
								.add(link.source.translate ? link.source.translate : Point.ZERO())}
							target={link.target.position
								.clone()
								.add(link.target.translate ? link.target.translate : Point.ZERO())}
							linked={true}
						/>
					))}

					{nodes.map(node => (
						<Node
							key={node.id}
							draggable={draggable}
							id={node.id}
							onDrag={handlerNodeDrag}
							label={node.label}
							color={node.color}
							position={node.position}
						/>
					))}
				</svg>
			</div>
			<Menu active={select} onUpdate={setSelect} />
		</div>
	)
}
