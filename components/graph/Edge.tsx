import React, { memo } from 'react'
import Point from '@utils/shape/point'
import { NODE_RADIUS } from '@constants'
import isEqual from 'lodash/isEqual'
import Quadbezier from '@utils/shape/quadbezier'
import Line from '@utils/shape/line'
import { EdgeDirection, EdgeType } from '@utils/graph/types'

export type EdgeProps = {
	linked: boolean
	source: Point
	target: Point
	direction?: EdgeDirection
	type?: EdgeType
	weight?: number
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

function calcWeightPosition(first: Point, last: Point, control?: Point) {
	const line = new Line(first, last)
	const k = 20
	if (control) {
		const q = new Quadbezier(first, control, last)
		return line.getPointByDistOnBisector(k, q.getPoint(0.5))
	}
	return line.getPointByDistOnBisector(k, line.middle())
}

const Edge = React.forwardRef<SVGLineElement, EdgeProps>(
	({ source, target, linked, weight, direction = 'none', type = 'straight' }, ref) => {
		function createEdge() {
			const { first, last, control } = calcEdgePosition(source, target, type, linked)
			const weightPos = calcWeightPosition(first, last, control)

			const markerProps = {
				...(direction === 'normal' && { markerEnd: 'url(#arrow_right)' }),
				...(direction === 'both' && { markerStart: 'url(#arrow_left)', markerEnd: 'url(#arrow_right)' }),
			}

			return (
				<>
					{type === 'straight' ? (
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
					) : (
						<path
							d={`M ${first.x} ${first.y} Q ${control?.x} ${control?.y} ${last.x} ${last.y}`}
							fill='transparent'
							{...markerProps}
							stroke='#343a40'
							strokeWidth='2'
						/>
					)}

					{weight && (
						<text x={weightPos.x} y={weightPos.y} dominantBaseline='middle' textAnchor='middle' fill='#000'>
							{weight}
						</text>
					)}
				</>
			)
		}

		return createEdge()
	}
)

Edge.displayName = 'Edge'
export default memo(Edge, isEqual)
