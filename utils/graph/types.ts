import Point from '@utils/shape/point'

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
	source: string
	target: string
	type: EdgeType
	direction: EdgeDirection
	weight?: number
}

export type FullEdge = {
	source: Node
	target: Node
} & Omit<Edge, 'source' | 'target'>

export type EdgePosition = {
	first: Point
	last: Point
	control?: Point
}

export type PreviewEdge = Partial<FullEdge>
