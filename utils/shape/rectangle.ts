import Line from './line'
import Point from './point'

export default class Rectangle {
	minPoint: Point
	maxPoint: Point

	readonly top: Line
	readonly left: Line
	readonly right: Line
	readonly bottom: Line

	constructor(minPoint: Point, maxPoint: Point) {
		this.minPoint = minPoint
		this.maxPoint = maxPoint

		this.top = new Line(minPoint, new Point(maxPoint.x, minPoint.y))
		this.right = new Line(new Point(maxPoint.x, minPoint.y), maxPoint)
		this.bottom = new Line(new Point(minPoint.x, maxPoint.y), maxPoint)
		this.left = new Line(minPoint, new Point(minPoint.x, maxPoint.y))
	}

	clone(): Rectangle {
		return new Rectangle(this.minPoint.clone(), this.maxPoint.clone())
	}
}
