import React from 'react'
import { GraphEditorProvider } from '@providers/GraphEditorProvider'
import GraphEditorComponent from './GraphEditor'

const GraphEditor = () => {
	return (
		<GraphEditorProvider>
			<GraphEditorComponent />
		</GraphEditorProvider>
	)
}

export default GraphEditor
