export function calcPolynomialRoots(...coefficients: number[]) {
	const n = coefficients.length - 1
	let degree = n
	const results: number[] = []

	coefficients.some(c => {
		if (Math.abs(c) <= 1e-12) {
			degree--
			return true
		}
		return false
	})

	if (degree === 1) calcLinearRoots(coefficients[n], coefficients[n - 1], results)
	else if (degree === 2) calcQuadraticRoots(coefficients[n], coefficients[n - 1], coefficients[n - 2], results)

	return results
}

function calcLinearRoots(c0: number, c1: number, results: number[] = []) {
	if (c1 !== 0) results.push(-c0 / c1)
	return results
}

function calcQuadraticRoots(c0: number, c1: number, c2: number, results: number[] = []) {
	const a = c2
	const b = c1 / a
	const c = c0 / a

	const d = b * b - 4 * c

	if (d > 0) {
		results.push((-b + Math.sqrt(d)) / 2)
		results.push((-b - Math.sqrt(d)) / 2)
	} else if (d === 0) {
		results.push(0.5 * -b)
	}

	return results
}
