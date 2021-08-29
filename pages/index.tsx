import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import React, { useState } from 'react'
import GraphEditorComponent from '@components/graphEditor'
import Logo from '@components/Logo'
import Button from '@components/Button'
import ExportBox from '@components/ExportBox'
import Alert from '@components/Alert'
import { useAlert } from '@providers/alert'

export default function Home() {
	const [showExportBox, setShowExportBox] = useState(false)
	const alert = useAlert()

	return (
		<div className={styles.container}>
			<Head>
				<title>grawiz</title>
				<meta name='description' content='graph builder' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

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
		</div>
	)
}
