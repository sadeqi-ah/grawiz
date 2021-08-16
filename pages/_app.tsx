import '../styles/globals.scss'
import { GraphEditorProvider } from '@providers/graphEditor'
import { AlertProvider } from '@providers/alert'

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
