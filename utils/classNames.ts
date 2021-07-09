export default function classNames(...params: any[]) {
	const classes: string[] = []

	params.forEach(param => {
		if (typeof param === 'object') {
			for (let key in param) {
				if (param[key]) classes.push(key)
			}
		} else if (typeof param === 'string') {
			classes.push(param)
		}
	})

	return classes.join(' ')
}
