import React from 'react'
import { NODE_RADIUS } from '@constants'
import { useGraphEditor } from '@hooks/useGraphEditor'
import { calcEdgePosition, GraphEdge } from '@components/graph/Edge'
import { GraphNode } from '@components/graph/Node'
import Quadbezier from '@utils/shape/quadbezier'

const SelectedItems = () => {
	const { state } = useGraphEditor()

	function calcRectProps() {
		let minX = Infinity,
			minY = Infinity,
			maxX = 0,
			maxY = 0

		state.selectedItems.forEach(item => {
			if (item.hasOwnProperty('color')) {
				const node = item as GraphNode
				const nodeOffset = node.position.clone().add(node.translate)
				minX = Math.min(nodeOffset.x - NODE_RADIUS, minX)
				maxX = Math.max(nodeOffset.x + NODE_RADIUS, maxX)
				minY = Math.min(nodeOffset.y - NODE_RADIUS, minY)
				maxY = Math.max(nodeOffset.y + NODE_RADIUS, maxY)
			} else {
				const edge = item as GraphEdge
				const edgePos = calcEdgePosition(
					edge.source.position.clone().add(edge.source.translate),
					edge.target.position.clone().add(edge.target.translate),
					edge.type
				)

				minX = Math.min(edgePos.first.x, edgePos.last.x, minX)
				maxX = Math.max(edgePos.first.x, edgePos.last.x, maxX)
				minY = Math.min(edgePos.first.y, edgePos.last.y, minY)
				maxY = Math.max(edgePos.first.y, edgePos.last.y, maxY)

				if (edgePos.control) {
					const q = new Quadbezier(edgePos.first, edgePos.control, edgePos.last)
					const bbox = q.bbox()

					minX = Math.min(bbox.minPoint.x, minX)
					maxX = Math.max(bbox.maxPoint.x, maxX)
					minY = Math.min(bbox.minPoint.y, minY)
					maxY = Math.max(bbox.maxPoint.y, maxY)
				}
			}
		})

		if (minX * minY != Infinity)
			return {
				x: minX,
				y: minY,
				width: maxX - minX,
				height: maxY - minY,
			}
	}

	const rectProps = calcRectProps()
	return rectProps ? <rect {...rectProps} fill={`#42A1F810`} stroke={'#42A1F8'} /> : null
}

export default SelectedItems
