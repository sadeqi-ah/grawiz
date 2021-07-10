import React from 'react'
import Toolbox from './toolbox'

const EdgeToolbox = () => {
	return (
		<Toolbox width={240}>
			<Toolbox.Row>
				<Toolbox.Group>
					<Toolbox.Button type='check-box' icon={'ArrowLeft'} active={false} />
					<Toolbox.Button type='check-box' icon={'ArrowRight'} active={false} />{' '}
				</Toolbox.Group>
				<Toolbox.Group>
					<Toolbox.Button
						active={'straight'}
						type='radio-button'
						options={[
							{ id: 'straight', icon: 'Line' },
							{ id: 'upward-curve', icon: 'UpwardCurve' },
							{ id: 'downward-curve', icon: 'DownwardCurve' },
						]}
					/>
				</Toolbox.Group>
			</Toolbox.Row>
			<Toolbox.Line />
			<Toolbox.Row>
				<Toolbox.Input type={'number'} label='weight' value={10} />
			</Toolbox.Row>
		</Toolbox>
	)
}

export default EdgeToolbox
