export function between(x: number | undefined, ...otherNumbers: number[]) {
	if (x === undefined) return false
	return (
		Math.min(...otherNumbers) === Math.min(x, ...otherNumbers) &&
		Math.max(...otherNumbers) === Math.max(x, ...otherNumbers)
	)
}
