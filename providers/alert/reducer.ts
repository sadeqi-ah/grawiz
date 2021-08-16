import { AlertProps } from '@providers/alert'
import { Action } from '@providers/types'

export type ActionType = 'SET_TEXT_ALERT' | 'HIDDEN'

export const defaultValue: AlertProps = {
	show: false,
	text: '',
}

export default function reducer(state: AlertProps, action: Action<ActionType, any>): AlertProps {
	const { type, payload } = action

	switch (type) {
		case 'SET_TEXT_ALERT':
			return { text: payload, show: true }
		case 'HIDDEN':
			return { ...state, show: false }
		default:
			throw new Error('unexpected action type')
	}
}
