import React from 'react'
import { GraphNode } from './Node'
import Point from '../../utils/point'

export type GraphDirectedEdge = {
	source: GraphNode
	target: GraphNode
}

export type EdgeProps = {
	linked: boolean
	source: Point
	target: Point
}

const Edge = React.forwardRef<SVGLineElement, EdgeProps>(({ source, target, linked }, ref) => {
	function createEdge() {
		const m = calcM(source, target)

		let sourceX = calcX(20, Math.abs(m))
		let sourceY = calcY(sourceX, Math.abs(m))

		let targetX = sourceX
		let targetY = sourceY

		if (m == Infinity || m == -Infinity) {
			sourceX = 0
			sourceY = 20
			targetX = 0
			targetY = 20
		}

		if (source.x > target.x) {
			sourceX *= -1
		} else {
			targetX *= -1
		}

		if (source.y > target.y) {
			sourceY *= -1
		} else {
			targetY *= -1
		}

		return (
			<line
				ref={ref}
				x1={source.x + sourceX}
				y1={source.y + sourceY}
				x2={linked ? target.x + targetX : target.x}
				y2={linked ? target.y + targetY : target.y}
				markerEnd='url(#head)'
				stroke='#343a40'
				strokeWidth='2'
			/>
		)
	}

	function calcX(r: number, m: number) {
		return Math.sqrt(Math.pow(r, 2) / (Math.pow(m, 2) + 1))
	}

	function calcM(s: Point, t: Point) {
		const m = (t.y - s.y) / (t.x - s.x)
		return isNaN(m) ? 0 : m
	}

	function calcY(x: number, m: number) {
		return x * m
	}

	return createEdge()
})

export default Edge
