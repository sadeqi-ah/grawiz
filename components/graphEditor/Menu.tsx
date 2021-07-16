import React, { memo } from 'react'
import styles from '@styles/GraphEditor.module.scss'
import I from '@icons'

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

export type MenuProps = {
	active: Tool
	onUpdate: (active: Tool) => void
}

const Menu: React.FC<MenuProps> = ({ active, onUpdate }) => {
	return (
		<ul className={styles.menu}>
			{menuItems.map(item => (
				<li
					key={item.name}
					className={active == item.name ? styles.active : ''}
					onClick={() => onUpdate(item.name)}
				>
					<I name={item.icon} width={32} height={32} />
				</li>
			))}
		</ul>
	)
}

export default memo(Menu)
