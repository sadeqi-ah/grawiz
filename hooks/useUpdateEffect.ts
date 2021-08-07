import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
	const didMountRef = useRef(false)

	useEffect(() => {
		if (didMountRef.current) effect()
		else didMountRef.current = true
	}, deps)
}
