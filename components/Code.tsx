import React from 'react'
import styles from '@styles/Code.module.scss'
import { copy } from '@utils/copyTextToClipboard'
import { useAlertDispatch } from '@providers/alert'

export type CodeProps = {
	code: string[]
}

function Code({ code }: CodeProps) {
	const alert = useAlertDispatch()

	const handleClick = () => {
		copy(code.join('\n'))
		alert('The text was successfully copied to the clipboard')
	}

	return (
		<div className={styles.container}>
			<div className={styles.code}>
				{code.map((line, index) => (
					<p key={`code_line_${index}`}>{line}</p>
				))}
			</div>
			<div className={styles.copy} onClick={() => handleClick()}>
				copy
			</div>
		</div>
	)
}

export default Code
