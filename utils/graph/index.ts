import { NODE_RADIUS } from '@constants'
import { between } from '@utils/helper'
import Point from '@utils/shape/point'
import { Concrete } from '@utils/types'
import { Edge, EdgeType, FullEdge, Node } from './types'

class Graph {
	nodes: Node[] = []
	edges: Edge[] = []

	constructor(nodes?: Node[], edges?: Edge[]) {
		if (nodes) this.nodes = nodes
		if (edges) this.edges = edges
	}

	addNode(node: Node) {
		this.nodes.push(node)
		return this
	}

	addEdge(source: string, target: string) {
		const edgeType = this.validEdgeType(source, target)
		if (!edgeType) return

		this.edges.push({
			id: `edge_${source}${target}_${edgeType[0]}`,
			source,
			target,
			type: edgeType,
			direction: 'normal',
		})

		return this
	}

	getNode(id: string): Node | undefined
	getNode(position: Point): Node | undefined
	getNode(param: string | Point) {
		if (typeof param === 'string') return this.nodes.find(node => node.id == param)
		else if (param instanceof Point) {
			return this.nodes.find(node => {
				const nodePos = node.position.clone().add(node.translate)
				return (
					between(param.x, nodePos.x - NODE_RADIUS, nodePos.x + NODE_RADIUS) &&
					between(param.y, nodePos.y - NODE_RADIUS, nodePos.y + NODE_RADIUS)
				)
			})
		}
	}

	getEdge(id: string) {
		return this.edges.find(edge => edge.id == id)
	}

	getEdges(source: string, target: string): Edge[]
	getEdges(node: string): Edge[]
	getEdges(source: string, target?: string) {
		if (!target) return this.edges.filter(edge => edge.source == source || edge.target == source) || []

		return (
			this.edges.filter(
				edge =>
					(edge.source == source && edge.target == target) || (edge.source == target && edge.target == source)
			) || []
		)
	}

	canDrawingEdge(source: string, target: string): boolean {
		let edges = this.getEdges(source, target)
		if (!edges) return false

		if (edges.length == 0) return true
		else if (edges.length == 1) return edges[0].direction == 'normal'
		return false
	}

	validEdgeType(source: string, target: string): EdgeType | undefined {
		const edges = this.getEdges(source, target)
		if (!edges || !this.canDrawingEdge(source, target)) return

		const edgeTypes = edges.map(edge => edge.type)
		if (edgeTypes.length == 0) return 'straight'
		else if (edgeTypes.length == 1) {
			if (edgeTypes[0] === 'straight') return 'curve'
			else if (edgeTypes[0] === 'curve') return 'reverse-curve'
			else return 'curve'
		}
	}

	updateNode(id: string, node: Partial<Node>) {
		this.nodes = this.nodes.map(n => {
			if (n.id !== id) return n
			return { ...n, ...node }
		})
		return this
	}

	updateEdge(id: string, edge: Partial<Edge>) {
		this.edges = this.edges.map(e => {
			if (e.id !== id) return e
			return { ...e, ...edge }
		})
		return this
	}

	deleteNode(id: string) {
		this.nodes = this.nodes.filter(node => {
			if (node.id === id) {
				this.getEdges(id)?.forEach(edge => {
					this.deleteEdge(edge.id)
				})
				return false
			}
			return true
		})
		return this
	}

	deleteEdge(id: string) {
		this.edges = this.edges.filter(edge => edge.id !== id)
		return this
	}

	getFullEdge(id: string): FullEdge | undefined {
		const edge = this.getEdge(id)
		if (!edge) return

		const source = this.getNode(edge.source)
		const target = this.getNode(edge.target)

		return source && target && { ...edge, source, target }
	}

	getFullEdges() {
		const fullEdges = this.edges.map(edge => this.getFullEdge(edge.id))
		return fullEdges.filter((edge): edge is FullEdge => !!edge)
	}

	normalizeEdge(edge: Edge): Concrete<Edge>[] {
		const result: Concrete<Edge>[] = []

		result.push({
			...edge,
			direction: 'normal',
			weight: edge.weight || 1,
		})

		if (edge.direction !== 'normal') {
			result.push({
				...edge,
				source: edge.target,
				target: edge.source,
				direction: 'normal',
				weight: edge.weight || 1,
			})
		}

		return result
	}

	normalizeEdges(): Concrete<Edge>[] {
		const visited: string[][] = []
		let result: Concrete<Edge>[] = []
		this.edges.forEach(edge => {
			if (
				visited.some(item => !(item.includes(edge.source) && item.includes(edge.target))) ||
				visited.length == 0
			) {
				const edges = this.getEdges(edge.source, edge.target)
				if (edges.length == 1) {
					result = [...result, ...this.normalizeEdge(edges[0])]
				} else if (edges.length == 2) {
					if (edges[0].direction !== 'normal') {
						result = [...result, ...this.normalizeEdge(edges[0])]
					} else if (edges[1].direction !== 'normal') {
						result = [...result, ...this.normalizeEdge(edges[1])]
					} else {
						if (edges[0].source !== edges[1].source) {
							result = [...result, ...this.normalizeEdge(edges[0]), ...this.normalizeEdge(edges[1])]
						} else {
							result = [...result, ...this.normalizeEdge(edges[0])]
						}
					}
				}
				visited.push([edge.source, edge.target])
			}
		})
		return result
	}

	convertToList() {
		const edges = this.normalizeEdges()
		const nodes = this.nodes.map(node => node.id)
		let list = new Array<Array<number>>(edges.length)

		nodes.forEach((node, index) => {
			list.push([index])
		})
		edges.forEach(edge => {
			list.push([nodes.indexOf(edge.source), nodes.indexOf(edge.target), edge.weight])
		})

		return list
	}

	convertToMatrix() {
		let matrix = new Array<Array<number>>(this.nodes.length)
		const nodes = this.nodes.map(node => node.id)

		this.nodes.forEach((node, index) => {
			matrix[index] = new Array<number>(this.nodes.length)
			matrix[index].fill(0)
		})

		this.edges.forEach(edge => {
			matrix[nodes.indexOf(edge.source)][nodes.indexOf(edge.target)] = edge.weight || 1
			if (edge.direction != 'normal')
				matrix[nodes.indexOf(edge.target)][nodes.indexOf(edge.source)] = edge.weight || 1
		})

		return matrix
	}

	clone() {
		return new Graph(this.nodes.slice(), this.edges.slice())
	}
}

export default Graph
