import React from 'react'
import { AlertProvider } from './alert'
import { GraphEditorProvider } from './graphEditor'

const Providers: React.FC = ({ children }) => {
	return (
		<GraphEditorProvider>
			<AlertProvider>{children}</AlertProvider>
		</GraphEditorProvider>
	)
}

export default Providers
