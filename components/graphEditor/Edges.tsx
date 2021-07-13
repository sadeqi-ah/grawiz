import React from 'react'
import Point from '../../utils/point'
import Edge from '../graph/Edge'
import { useDrag } from 'react-use-gesture'
import { useGraphEditor } from '../../hooks/useGraphEditor'

const Edges: React.FC = () => {
	const { state, dispatch, getNodeByLabel, getNodeByPosition } = useGraphEditor()

	const onDragStart = (event: React.PointerEvent<Element> | PointerEvent) => {
		if (state.activeTool == 'add-edge' && event.target instanceof SVGCircleElement)
			dispatch({
				type: 'SET_PREVIEW_EDGE',
				payload: {
					source: getNodeByLabel(event.target.id),
				},
			})
	}

	const onDrag = (xy: number[]) => {
		const [x, y] = xy
		if (state.activeTool == 'add-edge' && state.previewEdge.source) {
			const target = getNodeByPosition(new Point(x, y))
			dispatch({
				type: 'SET_PREVIEW_EDGE',
				payload: {
					target:
						target && target.label != state.previewEdge.source.label
							? target
							: { position: new Point(x, y) },
				},
			})
		}
	}

	const onDragEnd = () => {
		if (state.previewEdge.target?.label) {
			dispatch({
				type: 'ADD_EDGE',
				payload: { newEdge: { source: state.previewEdge.source, target: state.previewEdge.target } },
			})
		}
		dispatch({ type: 'CLEAR_PREVIEW_EDGE' })
	}

	useDrag(
		({ first, xy, last, event }) => {
			if (first) onDragStart(event)
			else if (last) onDragEnd()
			else onDrag(xy)
		},
		{ useTouch: true, domTarget: window }
	)

	return (
		<>
			{state.previewEdge.source && state.previewEdge.target && (
				<Edge
					source={state.previewEdge.source.position.clone().add(state.previewEdge.source.translate)}
					target={state.previewEdge.target.position.clone().add(state.previewEdge.target.translate)}
					linked={Boolean(state.previewEdge.target.label)}
				/>
			)}

			{state.edges.map(edge => (
				<Edge
					key={`edge_${edge.source.label}${edge.target.label}`}
					source={edge.source.position.clone().add(edge.source.translate)}
					target={edge.target.position.clone().add(edge.target.translate)}
					linked={true}
				/>
			))}
		</>
	)
}

export default Edges
