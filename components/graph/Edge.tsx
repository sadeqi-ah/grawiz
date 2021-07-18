import React, { memo } from 'react'
import { GraphNode } from './Node'
import Point from '@utils/shape/point'
import { NODE_RADIUS } from '@constants'
import isEqual from 'lodash/isEqual'

export type EdgeType = 'straight' | 'curve' | 'reverse-curve'

export type GraphEdge = {
	source: GraphNode
	target: GraphNode
	type: EdgeType
}

export type EdgeProps = {
	linked: boolean
	source: Point
	target: Point
	direction?: 'none' | 'start' | 'end' | 'both'
	type?: EdgeType
}

export type EdgePosition = {
	first: Point
	last: Point
	control?: Point
}

export function calcEdgePosition(
	source: Point,
	target: Point,
	type: EdgeType = 'straight',
	linked: boolean = true
): EdgePosition {
	const m = Point.slope(source, target)

	const spd = calc(NODE_RADIUS, Math.abs(m))
	const tpd = spd.clone()

	if (source.x > target.x) spd.symmetryX()
	else tpd.symmetryX()

	if (source.y > target.y) spd.symmetryY()
	else tpd.symmetryY()

	const first = source.clone().add(spd)
	const last = linked ? target.clone().add(tpd) : target

	if (type === 'straight')
		return {
			first,
			last,
		}

	const k = (first.distance(last) * 20) / 100
	const cpd = calc(k, -1 / m)

	if (type === 'reverse-curve') cpd.symmetry()

	return {
		first,
		last,
		control: Point.middle(first, last).add(cpd),
	}
}

function calc(k: number, m: number) {
	const dx = m == Infinity || m == -Infinity ? 0 : Math.sqrt(Math.pow(k, 2) / (Math.pow(m, 2) + 1))
	const dy = m == Infinity || m == -Infinity ? k : m * dx
	return new Point(dx, dy)
}

const Edge = React.forwardRef<SVGLineElement, EdgeProps>(
	({ source, target, linked, direction = 'none', type = 'straight' }, ref) => {
		function createEdge() {
			const { first, last, control } = calcEdgePosition(source, target, type, linked)

			const markerProps = {
				...(direction === 'end' && { markerEnd: 'url(#arrow)' }),
				...(direction === 'start' && { markerStart: 'url(#arrow)' }),
				...(direction === 'both' && { markerStart: 'url(#arrow)', markerEnd: 'url(#arrow)' }),
			}

			if (type === 'straight') {
				return (
					<line
						ref={ref}
						x1={first.x}
						y1={first.y}
						x2={last.x}
						y2={last.y}
						{...markerProps}
						stroke='#343a40'
						strokeWidth='2'
					/>
				)
			}

			return (
				<path
					d={`M ${first.x} ${first.y} Q ${control?.x} ${control?.y} ${last.x} ${last.y}`}
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

Edge.displayName = 'Edge'
export default memo(Edge, isEqual)
