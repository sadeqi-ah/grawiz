import React, { useState } from 'react'
import GraphEditorComponent from '@components/graphEditor'
import Logo from '@components/Logo'
import Button from '@components/Button'
import styles from '@styles/GraphEditor.module.scss'
import ExportBox from '@components/ExportBox'
import Alert from '@components/Alert'
import { useAlert } from '@providers/alert'

const GraphEditor = () => {
	const [showExportBox, setShowExportBox] = useState(false)
	const alert = useAlert()

	return (
		<>
			<GraphEditorComponent />
			<Logo />
			<div className={styles.rightButtons}>
				<Button
					icon='Paper'
					type='checkbox'
					changeState={state => {
						let newState = false
						setShowExportBox(prev => {
							newState = !prev
							return !prev
						})
						return newState
					}}
				/>
				<ExportBox show={showExportBox} />
				<Alert text={alert.text} show={alert.show} />
			</div>
		</>
	)
}

export default GraphEditor
