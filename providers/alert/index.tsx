import React, { createContext, useContext, useReducer, useRef } from 'react'
import { Action } from '@providers/types'
import reducer, { ActionType, defaultValue } from './reducer'

export type AlertProps = {
	show: boolean
	text: string
}

export const AlertContext = createContext<AlertProps>(defaultValue)
export const AlertDispatchContext = createContext<React.Dispatch<Action<ActionType, any>>>(() => null)

export const AlertProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, defaultValue)
	return (
		<AlertDispatchContext.Provider value={dispatch}>
			<AlertContext.Provider value={state}>{children}</AlertContext.Provider>
		</AlertDispatchContext.Provider>
	)
}

export function useAlertDispatch() {
	const dispatch = useContext(AlertDispatchContext)

	const timeout = useRef<NodeJS.Timeout>()

	const alert = (text: string) => {
		dispatch({ type: 'SET_TEXT_ALERT', payload: text })
		if (timeout.current) clearTimeout(timeout.current)
		timeout.current = setTimeout(() => {
			dispatch({ type: 'HIDDEN' })
		}, 2000)
	}

	return alert
}

export function useAlert() {
	return useContext(AlertContext)
}
