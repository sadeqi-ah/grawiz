import React from 'react'
import { GraphEditorProvider } from '@providers/GraphEditorProvider'
import GraphEditorComponent from '@components/graphEditor'

const GraphEditor = () => {
	return (
		<GraphEditorProvider>
			<GraphEditorComponent />
		</GraphEditorProvider>
	)
}

export default GraphEditor
