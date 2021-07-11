import React from 'react'
import { COLORS } from '../constants'
import Toolbox, { ToolboxProps } from './toolbox'

export type NodeToolboxProps = Omit<ToolboxProps, 'width'>

const NodeToolbox: React.FC<NodeToolboxProps> = ({ position, show }) => {
	return (
		<Toolbox width={246} position={position} show={show}>
			<Toolbox.Row>
				<Toolbox.Group>
					<Toolbox.ColorPicker colors={COLORS} active={'#F45890'} />
				</Toolbox.Group>
			</Toolbox.Row>
			<Toolbox.Line />
			<Toolbox.Row>
				<Toolbox.Input type={'text'} label='label' value={10} />
			</Toolbox.Row>
		</Toolbox>
	)
}

export default NodeToolbox
