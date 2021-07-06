import React, { useEffect, useState } from 'react'
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
	const [{ ps, pt, pq }, setPoints] = useState<{ ps: Point; pt: Point; pq: Point }>(() => calcPoints(undefined))

	useEffect(() => {
		setPoints(prev => calcPoints(prev))
	}, [source, target, linked])

	function calcPoints(prevState: any) {
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

		const midPoint = prevState ? prevState.pq : Point.middle(psource, ptarget)
		const k = 20

		const ma = -1 / m
		const a = Math.sqrt(Math.pow(k, 2) / (Math.pow(ma, 2) + 1))
		const b = ma * a

		console.log('ps', ps)
		console.log('pt', pt)
		console.log('ma', ma)
		console.log('a', a)
		console.log('b', b)

		return {
			ps: psource,
			pt: ptarget,
			// pq: prevState ? prevState.pq : Point.middle(psource, ptarget),
			pq: new Point(a, b),
		}
	}

	function calcX(r: number, m: number) {
		return Math.sqrt(Math.pow(r, 2) / (Math.pow(m, 2) + 1))
	}

	function calcY(x: number, m: number) {
		return x * m
	}

	function createEdge() {
		// return (
		// 	<line
		// 		ref={ref}
		// 		x1={ps.x}
		// 		y1={ps.y}
		// 		x2={pt.x}
		// 		y2={pt.y}
		// 		markerEnd='url(#head)'
		// 		stroke='#343a40'
		// 		strokeWidth='2'
		// 	/>
		// )
		return (
			<>
				<path
					d={`M ${ps.x} ${ps.y} Q ${pq.x} ${pq.y} ${pt.x} ${pt.y}`}
					fill='transparent'
					markerEnd='url(#head)'
					stroke='#343a40'
					strokeWidth='2'
				/>
				<circle cx={pq.x} cy={pq.y} fill='red' r={5} />
			</>
		)
	}

	return createEdge()
})

export default Edge
