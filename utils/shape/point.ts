export default class Point {
	x: number
	y: number

	constructor(x: number = 0, y: number = 0) {
		this.x = x
		this.y = y
	}

	static ZERO(): Point {
		return new Point(0, 0)
	}

	static ONE(): Point {
		return new Point(1, 1)
	}

	static middle(p1: Point, p2: Point): Point {
		return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
	}

	static slope(p1: Point, p2: Point): number {
		const m = (p2.y - p1.y) / (p2.x - p1.x)
		return isNaN(m) ? 0 : m
	}

	static min(p1: Point, p2: Point): Point {
		return new Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y))
	}

	static max(p1: Point, p2: Point): Point {
		return new Point(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y))
	}
	set(x: number, y: number): Point {
		this.x = x
		this.y = y
		return this
	}

	clear(): void {
		this.x = 0
		this.y = 0
	}

	add(vector: Point | undefined): Point {
		if (vector) {
			this.x += vector.x
			this.y += vector.y
		}
		return this
	}

	sub(vector: Point): Point {
		this.x -= vector.x
		this.y -= vector.y
		return this
	}

	clamp(min: number, max: number) {
		this.x = Math.max(min, Math.min(this.x, max))
		this.y = Math.max(min, Math.min(this.y, max))
		return this
	}

	multiply(scalar: number | Point): Point {
		if (scalar instanceof Point) {
			this.x *= scalar.x
			this.y *= scalar.y
		} else {
			this.x *= scalar
			this.y *= scalar
		}
		return this
	}

	divide(scalar: number | Point): Point {
		if (scalar instanceof Point) {
			this.x /= scalar.x
			this.y /= scalar.y
		} else {
			this.x /= scalar
			this.y /= scalar
		}
		return this
	}

	symmetry(): Point {
		this.x *= -1
		this.y *= -1
		return this
	}

	symmetryX(): Point {
		this.x *= -1
		return this
	}

	symmetryY(): Point {
		this.y *= -1
		return this
	}

	normalize(): Point {
		const mag = this.magnitude()
		if (mag === 0) {
			return Point.ZERO()
		}
		return this.divide(mag)
	}

	magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}

	squaredMagnitude(): number {
		return this.x * this.x + this.y * this.y
	}

	limit(max: number): Point {
		const mSq = this.squaredMagnitude()
		if (mSq > max * max) this.divide(Math.sqrt(mSq)).multiply(max)
		return this
	}

	distance(vector: Point): number {
		return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2)
	}

	angle(): number {
		return Math.atan2(this.x, this.y)
	}

	clone(): Point {
		return new Point(this.x, this.y)
	}
}
