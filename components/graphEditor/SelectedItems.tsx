import React, { memo } from 'react'
import { NODE_RADIUS } from '@constants'
import { calcEdgePosition } from '@components/graph/Edge'
import Quadbezier from '@utils/shape/quadbezier'
import isEqual from 'lodash/isEqual'
import { Node, Edge } from '@utils/graph/types'

export type SelectedItemsProps = {
	items: {
		nodes: (Node | undefined)[]
		edges: (Edge | undefined)[]
	}
}

const SelectedItems = ({ items }: SelectedItemsProps) => {
	function calcRectProps() {
		let minX = Infinity,
			minY = Infinity,
			maxX = 0,
			maxY = 0

		if (items.nodes)
			items.nodes.forEach(node => {
				if (node) {
					const nodeOffset = node.position.clone().add(node.translate)
					minX = Math.min(nodeOffset.x - NODE_RADIUS, minX)
					maxX = Math.max(nodeOffset.x + NODE_RADIUS, maxX)
					minY = Math.min(nodeOffset.y - NODE_RADIUS, minY)
					maxY = Math.max(nodeOffset.y + NODE_RADIUS, maxY)
				}
			})

		if (items.edges)
			items.edges.forEach(edge => {
				if (edge) {
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

export default memo(SelectedItems, isEqual)
