import { NODE_RADIUS } from '@constants'
import { between } from '@utils/helper'
import Point from '@utils/shape/point'
import { Edge, Graph, Node } from './types'

export function getNodeById(nodes: Node[], id: string) {
	return nodes.find(node => node.id == id)
}

export function getEdgeById(edges: Edge[], id: string) {
	return edges.find(edge => edge.id == id)
}

export function nodeIdsToNodes(nodes: Node[], ids: string[]) {
	return ids.map(id => getNodeById(nodes, id))
}

export function edgeIdsToEdges(edges: Edge[], ids: string[]) {
	return ids.map(id => getEdgeById(edges, id))
}

export function getNodeByPosition(nodes: Node[], position: Point) {
	return nodes.find(node => {
		const nodePos = node.position.clone().add(node.translate)
		return (
			between(position.x, nodePos.x - NODE_RADIUS, nodePos.x + NODE_RADIUS) &&
			between(position.y, nodePos.y - NODE_RADIUS, nodePos.y + NODE_RADIUS)
		)
	})
}

export function getValidEdgeType(graph: Graph, source?: string, target?: string) {
	if (source == undefined || target == undefined) return
	const edges = graph.edges.filter(
		edge =>
			(edge.source.id == source && edge.target.id == target) ||
			(edge.source.id == target && edge.target.id == source)
	)

	if (edges.length >= 3) return
	const edgeTypes = edges.map(edge => edge.type)
	if (!edgeTypes.includes('straight')) return 'straight'
	if (!edgeTypes.includes('curve')) return 'curve'
	if (!edgeTypes.includes('reverse-curve')) return 'reverse-curve'
}
