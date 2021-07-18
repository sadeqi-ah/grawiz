import { between } from '@utils/helper'
import Point from './point'
import { calcPolynomialRoots } from '@utils/polynomial'
import Line from './line'
import Rectangle from './rectangle'

export default class Quadbezier {
	first: Point
	control: Point
	last: Point

	constructor(first: Point, control: Point, last: Point) {
		this.first = first
		this.control = control
		this.last = last
	}

	intersectionWithLine(line: Line): boolean {
		const minx = Math.min(line.first.x, line.last.x),
			miny = Math.min(line.first.y, line.last.y),
			maxx = Math.max(line.first.x, line.last.x),
			maxy = Math.max(line.first.y, line.last.y)

		const c2 = this.first.clone().add(this.control.clone().multiply(-2)).add(this.last)
		const c1 = this.first.clone().multiply(-2).add(this.control.clone().multiply(2))
		const c0 = this.first.clone()

		const n = new Point(line.first.y - line.last.y, line.last.x - line.first.x)
		const cl = line.first.x * line.last.y - line.last.x * line.first.y

		const roots = calcPolynomialRoots(
			n.x * c2.x + n.y * c2.y,
			n.x * c1.x + n.y * c1.y,
			n.x * c0.x + n.y * c0.y + cl
		)

		for (const t of roots) {
			if (!between(t, 0, 1)) continue

			const p4 = this.control.clone().sub(this.first).multiply(t).add(this.first)
			const p5 = this.last.clone().sub(this.control).multiply(t).add(this.control)
			const p6 = p5.clone().sub(p4).multiply(t).add(p4)

			if (
				(line.first.x === line.last.x && between(p6.y, miny, maxy)) ||
				(line.first.y === line.last.y && between(p6.x, minx, maxx)) ||
				(between(p6.x, minx, maxx) && between(p6.y, miny, maxy))
			) {
				return true
			}
		}

		return false
	}

	intersectionWithRect(rect: Rectangle): boolean {
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

	clone(): Quadbezier {
		return new Quadbezier(this.first.clone(), this.control.clone(), this.last.clone())
	}
}
