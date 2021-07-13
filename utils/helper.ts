import Point from './point'

export function between(x: number | undefined, ...otherNumbers: number[]) {
	if (x === undefined) return false
	return (
		Math.min(...otherNumbers) === Math.min(x, ...otherNumbers) &&
		Math.max(...otherNumbers) === Math.max(x, ...otherNumbers)
	)
}

export function equation(m: number, p: Point, point: Partial<Point>, [a, b]: number[]) {
	if (point.x) {
		const x = m * (point.x - p.x) + p.y
		return between(x, a, b) ? x : undefined
	} else if (point.y) {
		const y = (point.y - p.y) / m + p.x
		return between(y, a, b) ? y : undefined
	}
}
