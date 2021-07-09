import React from 'react'
import { GraphNode } from './Node'
import Point from '../../utils/point'

export type GraphEdge = {
	source: GraphNode
	target: GraphNode
}

export type EdgeProps = {
	linked: boolean
	source: Point
	target: Point
	direction?: 'none' | 'start' | 'end' | 'both'
	type?: 'straight' | 'curve' | 'upward-curve' | 'downward-curve'
}

const Edge = React.forwardRef<SVGLineElement, EdgeProps>(
	({ source, target, linked, direction = 'none', type = 'straight' }, ref) => {
		function calcPoints() {
			const m = Point.slope(source, target)

			let sourceX = m == Infinity || m == -Infinity ? 0 : calcX(20, Math.abs(m))
			let sourceY = m == Infinity || m == -Infinity ? 20 : calcY(sourceX, Math.abs(m))
			let targetX = sourceX
			let targetY = sourceY

			if (source.x > target.x) sourceX *= -1
			else targetX *= -1

			if (source.y > target.y) sourceY *= -1
			else targetY *= -1

			const psource = new Point(source.x + sourceX, source.y + sourceY)
			const ptarget = new Point(linked ? target.x + targetX : target.x, linked ? target.y + targetY : target.y)

			return {
				ps: psource,
				pt: ptarget,
			}
		}

		function calcX(r: number, m: number) {
			return Math.sqrt(Math.pow(r, 2) / (Math.pow(m, 2) + 1))
		}

		function calcY(x: number, m: number) {
			return x * m
		}

		function findQ(ps: Point, pt: Point) {
			const m = -1 / Point.slope(source, target)

			const midPoint = Point.middle(ps, pt)
			const k = (ps.distance(pt) * 20) / 100

			const a = m == Infinity || m == -Infinity ? 0 : Math.sqrt(Math.pow(k, 2) / (Math.pow(m, 2) + 1))
			let b = m == Infinity || m == -Infinity ? k : m * a

			if (type === 'upward-curve') b = -1 * Math.abs(b)
			else if (type === 'downward-curve') b = Math.abs(b)

			return new Point(midPoint.x + a, midPoint.y + b)
		}

		function createEdge() {
			const { ps, pt } = calcPoints()

			const markerProps = {
				...(direction === 'end' && { markerEnd: 'url(#arrow)' }),
				...(direction === 'start' && { markerStart: 'url(#arrow)' }),
				...(direction === 'both' && { markerStart: 'url(#arrow)', markerEnd: 'url(#arrow)' }),
			}

			if (type === 'straight') {
				return (
					<line
						ref={ref}
						x1={ps.x}
						y1={ps.y}
						x2={pt.x}
						y2={pt.y}
						{...markerProps}
						stroke='#343a40'
						strokeWidth='2'
					/>
				)
			}

			const pq = findQ(ps, pt)

			return (
				<path
					d={`M ${ps.x} ${ps.y} Q ${pq.x} ${pq.y} ${pt.x} ${pt.y}`}
					fill='transparent'
					{...markerProps}
					stroke='#343a40'
					strokeWidth='2'
				/>
			)
		}

		return createEdge()
	}
)

export default Edge
