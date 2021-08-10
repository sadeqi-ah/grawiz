import '../styles/globals.scss'
import { GraphEditorProvider } from '@providers/GraphEditorProvider'
import { AlertProvider } from '@providers/AlertProvider'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<GraphEditorProvider>
			<AlertProvider>
				<Component {...pageProps} />
			</AlertProvider>
		</GraphEditorProvider>
	)
}
export default MyApp
