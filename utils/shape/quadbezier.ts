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
			const p = this.getPoint(t)
			if (!p) continue

			if (
				(line.first.x === line.last.x && between(p.y, miny, maxy)) ||
				(line.first.y === line.last.y && between(p.x, minx, maxx)) ||
				(between(p.x, minx, maxx) && between(p.y, miny, maxy))
			) {
				return true
			}
		}

		return false
	}

	getPoint(t: number) {
		if (!between(t, 0, 1)) return undefined
		const p0 = this.control.clone().sub(this.first).multiply(t).add(this.first)
		const p1 = this.last.clone().sub(this.control).multiply(t).add(this.control)
		return p1.clone().sub(p0).multiply(t).add(p0)
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

	bbox() {
		let mi = Point.min(this.first, this.last)
		let ma = Point.max(this.first, this.last)

		if (this.control.x < mi.x || this.control.x > ma.x || this.control.y < mi.y || this.control.y > ma.y) {
			const t = this.first
				.clone()
				.sub(this.control)
				.divide(this.first.clone().sub(this.control.clone().multiply(2)).add(this.last))
				.clamp(0, 1)
			const s = Point.ONE().sub(t)
			const qt0 = s.clone().multiply(s).multiply(this.first)
			const qt1 = new Point(2, 2).multiply(s).multiply(t).multiply(this.control)
			const qt2 = t.clone().multiply(t).multiply(this.last)
			const q = qt0.clone().add(qt1).add(qt2)
			mi = Point.min(mi, q)
			ma = Point.max(ma, q)
		}

		return new Rectangle(mi, ma)
	}

	clone(): Quadbezier {
		return new Quadbezier(this.first.clone(), this.control.clone(), this.last.clone())
	}
}
