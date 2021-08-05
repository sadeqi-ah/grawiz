export function copy(text: string) {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text)
		return
	}
	navigator.clipboard.writeText(text)
}

function fallbackCopyTextToClipboard(text: string) {
	const textArea = document.createElement('textarea')
	textArea.value = text
	document.body.appendChild(textArea)
	textArea.focus()
	textArea.select()

	try {
		document.execCommand('copy')
	} catch (err) {}

	document.body.removeChild(textArea)
}
