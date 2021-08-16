import React, { memo } from 'react'
import { COLORS, NODE_RADIUS } from '@constants'
import Toolbox from '@components/Toolbox'
import { Node } from '@utils/graph/types'

import Point from '@utils/shape/point'
import isEqual from 'lodash/isEqual'

export type NodeToolboxProps = {
	node?: Node
	onChangeNodeColor?: (id: string, color: string) => void
	onChangeNodeLabel?: (id: string, label?: string | number) => void
}

const NodeToolbox: React.FC<NodeToolboxProps> = ({ node, onChangeNodeColor, onChangeNodeLabel }) => {
	const toolboxPos = (width: number, height: number) => {
		if (!node) return
		return new Point(width / -2, -1 * NODE_RADIUS - 20 - height).add(node.position).add(node.translate)
	}

	return (
		<Toolbox width={246} height={147} position={toolboxPos(246, 147)}>
			<Toolbox.Row>
				<Toolbox.Group>
					<Toolbox.ColorPicker
						id={node?.id}
						colors={COLORS}
						active={node?.color}
						onUpdate={onChangeNodeColor}
					/>
				</Toolbox.Group>
			</Toolbox.Row>
			<Toolbox.Line />
			<Toolbox.Row>
				<Toolbox.Input
					id={node?.id}
					type={'text'}
					label='label'
					value={node?.label}
					onChange={onChangeNodeLabel}
				/>
			</Toolbox.Row>
		</Toolbox>
	)
}

export default memo(NodeToolbox, (prev, next) => isEqual(prev.node?.id, next.node?.id))
