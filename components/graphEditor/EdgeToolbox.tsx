import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Line from '@utils/shape/line'
import Point from '@utils/shape/point'
import Quadbezier from '@utils/shape/quadbezier'
import { calcEdgePosition } from '@components/graph/Edge'
import Toolbox from '@components/Toolbox'
import isEqual from 'lodash/isEqual'
import Button, { ButtonState } from '@components/Button'
import { EdgeDirection, FullEdge } from '@utils/graph/types'
import { useGraphEditorDispatch } from '@providers/graphEditor'
import Input from '@components/Input'
import { useUpdateEffect } from '@hooks/useUpdateEffect'

export type EdgeToolboxProps = {
	edge?: FullEdge
}

const EdgeToolbox: React.FC<EdgeToolboxProps> = ({ edge }) => {
	const dispatch = useGraphEditorDispatch()

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

	const position = useMemo(() => calcEdgeToolboxPosition(240, 141), [edge?.id])

	const handleUpdateDirection = (id: string, direction: ButtonState) => {
		if (!edge) return
		let _direction: EdgeDirection = (direction as string[]).length === 2 ? 'both' : 'none'
		let reverse = false

		if ((direction as string[]).length == 1) {
			_direction = 'normal'
			if (
				edge.source.position.clone().add(edge.source.translate).x <=
				edge.target.position.clone().add(edge.target.translate).x
			) {
				reverse = (direction as string[])[0] === 'start'
			} else {
				reverse = (direction as string[])[0] === 'end'
			}
		}

		dispatch({
			type: 'UPDATE_EDGE',
			payload: {
				id,
				data: { ...(reverse && { source: edge.target.id, target: edge.source.id }), direction: _direction },
			},
		})
	}

	const handleUpdateEdgeType = (id: string, type: ButtonState) => {
		if (typeof type === 'object' && type.length === 1)
			dispatch({ type: 'UPDATE_EDGE', payload: { id, data: { type: type[0] } } })
	}

	const handleChangeEdgeWeight = (id: string, weight?: string | number) =>
		dispatch({
			type: 'UPDATE_EDGE',
			payload: { id, data: { weight: weight !== undefined ? Number(weight) : weight } },
		})

	const activeDirection = () => {
		if (!edge || (edge && edge.direction === 'none')) return []
		if (edge.direction === 'both') return ['start', 'end']
		if (
			edge.source.position.clone().add(edge.source.translate).x <=
			edge.target.position.clone().add(edge.target.translate).x
		)
			return ['end']
		return ['start']
	}

	return (
		<Toolbox width={240} height={141} position={position}>
			<Toolbox.Row>
				<Toolbox.Group>
					<Button
						id={edge?.id}
						type='checkbox'
						options={[
							{ id: 'start', icon: 'ArrowLeft' },
							{ id: 'end', icon: 'ArrowRight' },
						]}
						onUpdate={handleUpdateDirection}
						status={activeDirection()}
					/>
				</Toolbox.Group>
				<Toolbox.Group>
					<Button
						id={edge?.id}
						type='radio'
						options={[
							{ id: 'straight', icon: 'Line' },
							{ id: 'curve', icon: 'UpwardCurve' },
							{ id: 'reverse-curve', icon: 'DownwardCurve' },
						]}
						onUpdate={handleUpdateEdgeType}
						status={edge?.type && [edge?.type]}
					/>
				</Toolbox.Group>
			</Toolbox.Row>
			<Toolbox.Line />
			<Toolbox.Row>
				<Toolbox.Group>
					<Input
						id={edge?.id}
						type={'number'}
						label='weight'
						value={edge?.weight}
						onChange={handleChangeEdgeWeight}
					/>
				</Toolbox.Group>
			</Toolbox.Row>
		</Toolbox>
	)
}

export default memo(EdgeToolbox, isEqual)
