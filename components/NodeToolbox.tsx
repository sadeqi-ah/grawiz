import React from 'react'
import Toolbox from './toolbox'

const NodeToolbox = () => {
	return (
		<Toolbox width={246}>
			<Toolbox.Row>
				<Toolbox.Group>
					<Toolbox.ColorPicker
						colors={['#F45890', '#B15DFF', '#42D7F8', '#6FCF97', '#232323', '#FF921E']}
						active={'#F45890'}
					/>
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
