import React, { memo, useEffect } from 'react'
import Line from '@utils/shape/line'
import Point from '@utils/shape/point'
import Quadbezier from '@utils/shape/quadbezier'
import { calcEdgePosition, GraphEdge } from '@components/graph/Edge'
import Toolbox from '@components/Toolbox'
import isEqual from 'lodash/isEqual'
import { ButtonState } from '@components/Button'

export type EdgeToolboxProps = {
	edge?: GraphEdge
	onChangeDirection?: (id: string, state: ButtonState) => void
	onChangeEdgeType?: (id: string, state: ButtonState) => void
	onChangeWeight?: (id: string, weight?: string | number) => void
	defaultValue?: {
		direction?: string[]
		type?: string
		edgeWeight?: number
	}
}

const EdgeToolbox: React.FC<EdgeToolboxProps> = ({
	edge,
	onChangeDirection,
	onChangeEdgeType,
	onChangeWeight,
	defaultValue,
}) => {
	useEffect(() => {
		console.log('d', edge?.direction)
	})

	const calcEdgeToolboxPosition = (width: number, height: number) => {
		if (!edge) return
		const { first, control, last } = calcEdgePosition(
			edge.source.position.clone().add(edge.source.translate),
			edge.target.position.clone().add(edge.target.translate),
			edge.type
		)

		const line = new Line(first, last)
		const c = line.getPointByDistOnBisector(70)

		const _position = control ? new Quadbezier(first, control, last).getPoint(0.5) || line.middle() : line.middle()
		const _translate = Point.ZERO()

		const angle = Math.atan(line.slope())
		const p = (Math.abs(angle) * 50) / (Math.PI / 2)

		if (line.slope() <= 0) {
			_position.sub(c)
			_translate.x = (-1 * (p + 50) * width) / 100
		} else {
			_position.add(c)
			_translate.x = (-1 * (50 - p) * width) / 100
		}
		_translate.y = (-1 * (100 - p) * height) / 100

		_position.add(_translate)

		return _position
	}

	const position = calcEdgeToolboxPosition(240, 141)

	const activeDirection = () => {
		if (!edge || (edge && edge.direction === 'none')) return []
		if (edge.direction === 'both') return ['start', 'end']
		return [edge.direction]
	}

	return (
		<Toolbox width={240} height={141} position={position}>
			<Toolbox.Row>
				<Toolbox.Group>
					<Toolbox.Button
						id={edge?.id}
						type='checkbox'
						options={[
							{ id: 'start', icon: 'ArrowLeft' },
							{ id: 'end', icon: 'ArrowRight' },
						]}
						onUpdate={onChangeDirection}
						status={activeDirection()}
					/>
				</Toolbox.Group>
				<Toolbox.Group>
					<Toolbox.Button
						id={edge?.id}
						type='radio'
						options={[
							{ id: 'straight', icon: 'Line' },
							{ id: 'curve', icon: 'UpwardCurve' },
							{ id: 'reverse-curve', icon: 'DownwardCurve' },
						]}
						onUpdate={onChangeEdgeType}
						status={edge?.type && [edge?.type]}
					/>
				</Toolbox.Group>
			</Toolbox.Row>
			<Toolbox.Line />
			<Toolbox.Row>
				<Toolbox.Group>
					<Toolbox.Input
						id={edge?.id}
						type={'number'}
						label='weight'
						value={edge?.weight}
						onChange={onChangeWeight}
					/>
				</Toolbox.Group>
			</Toolbox.Row>
		</Toolbox>
	)
}

export default memo(EdgeToolbox, (prev, next) => isEqual(prev.edge?.id, next.edge?.id))