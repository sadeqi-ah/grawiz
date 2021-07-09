import React from 'react'
import styles from '../../styles/GraphEditor.module.scss'
import I from '../../icons'
import { useGraphEditor } from '../../hooks/useGraphEditor'

const menuItems: { name: Tool; icon: string }[] = [
	{
		name: 'select',
		icon: 'Cursor',
	},
	{
		name: 'add-node',
		icon: 'Node',
	},
	{
		name: 'add-edge',
		icon: 'DirectedEdge',
	},

	{
		name: 'clear',
		icon: 'Delete',
	},
]

export type Tool = 'select' | 'add-node' | 'add-edge' | 'clear'

// type MenuProps = {
// 	active: Tool
// 	onUpdate: (active: Tool) => void
// }

const Menu: React.FC = () => {
	const { state, dispatch } = useGraphEditor()

	return (
		<ul className={styles.menu}>
			{menuItems.map(item => (
				<li
					key={item.name}
					className={state.activeTool == item.name ? styles.active : ''}
					onClick={() => {
						dispatch({ type: 'SELECT_TOOL', payload: { toolName: item.name } })
					}}
				>
					<I name={item.icon} width={32} height={32} />
				</li>
			))}
		</ul>
	)
}

export default Menu
