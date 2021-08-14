import Point from '@utils/shape/point'

export type Graph = {
	nodes: Node[]
	edges: Edge[]
}

export type Node = {
	id: string
	label: string
	position: Point
	translate?: Point
	color: string
}

export type EdgeType = 'straight' | 'curve' | 'reverse-curve'

export type EdgeDirection = 'none' | 'start' | 'end' | 'both'

export type Edge = {
	id: string
	source: Node
	target: Node
	type: EdgeType
	direction: EdgeDirection
	weight?: number
}

export type EdgePosition = {
	first: Point
	last: Point
	control?: Point
}
