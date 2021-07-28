import { useEffect, useState } from 'react'

type ShortCutConfig = {
	[key: string]: () => void
}

const modifiers = ['alt', 'ctrl', 'shift'] as const

export type Key = {
	[key in typeof modifiers[number]]?: boolean
} & { key?: string }

const normalizeKey = (key: string | KeyboardEvent) => {
	if (typeof key === 'string') {
		const keyArr = key.toLowerCase().split('+')
		const result: Key = {}

		for (const modifier of modifiers) {
			if (keyArr.includes(modifier)) {
				result[modifier] = true
				keyArr.splice(keyArr.indexOf(modifier), 1)
			} else result[modifier] = false
		}

		result.key = keyArr[0]
		return result
	}
	return {
		alt: key.altKey,
		ctrl: key.ctrlKey,
		shift: key.shiftKey,
		key: key.key.toLowerCase(),
	}
}

const keyToString = (key: Key) => {
	return Object.keys(key)
		.map(k => {
			if (!key[k as keyof Key]) return ''
			if (typeof key[k as keyof Key] === 'string') return key[k as keyof Key]
			return k
		})
		.filter(k => k != '')
		.join('+')
}

const normalizeConfig = (config: ShortCutConfig) => {
	const result: ShortCutConfig = {}
	Object.keys(config).forEach(key => {
		result[keyToString(normalizeKey(key))] = config[key]
	})
	return result
}

export function useKeys(config: ShortCutConfig, deps: any[]) {
	const [_config, setConfig] = useState(() => normalizeConfig(config))

	const isEditableElement = (event: KeyboardEvent) =>
		(event.target as HTMLInputElement).isContentEditable ||
		((event.target instanceof HTMLInputElement ||
			event.target instanceof HTMLTextAreaElement ||
			event.target instanceof HTMLSelectElement) &&
			!(event.target as HTMLInputElement)?.readOnly)

	const handleKeyDown = (event: KeyboardEvent) => {
		if (!isEditableElement(event)) {
			const key = keyToString(normalizeKey(event))
			if (_config[key]) {
				event.preventDefault()
				_config[key]()
			}
		}
	}

	useEffect(() => {
		setConfig(normalizeConfig(config))
	}, deps)

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [_config])
}
