import { between } from '@utils/helper'
import Point from './point'
import Rectangle from './rectangle'

export default class Line {
	first: Point
	last: Point

	constructor(first: Point, last: Point) {
		this.first = first
		this.last = last
	}

	static ZERO(): Line {
		return new Line(Point.ZERO(), Point.ZERO())
	}

	middle(): Point {
		return new Point((this.first.x + this.last.x) / 2, (this.first.y + this.last.y) / 2)
	}

	slope(): number {
		const m = (this.last.y - this.first.y) / (this.last.x - this.first.x)
		return isNaN(m) ? 0 : m
	}

	getPointByDistOnBisector(dist: number, base: Point = Point.ZERO()): Point {
		return Line.getPointByDistWithSlope(dist, -1 / this.slope(), base)
	}

	getPointByDist(dist: number, base: Point = Point.ZERO()): Point {
		return Line.getPointByDistWithSlope(dist, this.slope(), base)
	}

	static getPointByDistWithSlope(dist: number, m: number, base: Point) {
		const a = m == Infinity || m == -Infinity ? 0 : Math.sqrt((dist * dist) / (1 + m * m))
		const b = m == Infinity || m == -Infinity ? dist : m * a
		return new Point(a, b).add(base)
	}

	intersectionWithLine(line: Line) {
		const det =
			(this.last.x - this.first.x) * (line.last.y - line.first.y) -
			(line.last.x - line.first.x) * (this.last.y - this.first.y)

		if (det === 0) return false

		const lambda =
			((line.last.y - line.first.y) * (line.last.x - this.first.x) +
				(line.first.x - line.last.x) * (line.last.y - this.first.y)) /
			det

		const gamma =
			((this.first.y - this.last.y) * (line.last.x - this.first.x) +
				(this.last.x - this.first.x) * (line.last.y - this.first.y)) /
			det
		return between(lambda, 0, 1) && between(gamma, 0, 1)
	}

	intersectionWithRect(rect: Rectangle) {
		return (
			(between(this.first.x, rect.minPoint.x, rect.maxPoint.x) &&
				between(this.first.y, rect.minPoint.y, rect.maxPoint.y)) ||
			(between(this.last.x, rect.minPoint.x, rect.maxPoint.x) &&
				between(this.last.y, rect.minPoint.y, rect.maxPoint.y)) ||
			this.intersectionWithLine(rect.top) ||
			this.intersectionWithLine(rect.right) ||
			this.intersectionWithLine(rect.bottom) ||
			this.intersectionWithLine(rect.left)
		)
	}

	clear(): void {
		this.first = Point.ZERO()
		this.last = Point.ZERO()
	}

	clone(): Line {
		return new Line(this.first.clone(), this.last.clone())
	}
}
