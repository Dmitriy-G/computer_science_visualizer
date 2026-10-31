export type StructureKind = 'linked-list' | 'array' | 'binary-tree' | 'graph' | 'stack' | 'queue' | 'deque' | 'doubly-linked-list' | 'circular-buffer' | 'avl-tree' | 'red-black-tree' | 'b-tree' | 'b-plus-tree' | 'hash-map' | 'hash-set' | 'bloom-filter' | 'trie' | 'heap' | 'segment-tree' | 'fenwick-tree' | 'r-tree' | 'lsm-tree' | 'ast'
export type NodeTone = 'default' | 'visited' | 'active' | 'new'

export interface SceneNode {
  readonly id: string
  readonly value: number
  readonly displayValue?: string
  readonly x: number
  readonly y: number
  readonly label: string
  readonly tone: NodeTone
  readonly opacity: number
  readonly status?: string
  readonly width?: number
  readonly height?: number
  readonly labelPlacement?: 'below' | 'right'
  readonly keys?: readonly number[]
  readonly nodeColor?: 'red' | 'black'
}

export interface SceneSlot {
  readonly id: string
  readonly x: number
  readonly y: number
  readonly label: string
  readonly empty: boolean
  readonly highlighted: boolean
  readonly opacity: number
}

export interface SceneEdge {
  readonly id: string
  readonly from: string
  readonly to: string
  readonly directed: boolean
  readonly highlighted: boolean
  readonly opacity: number
  readonly label?: string
  readonly bend?: number
}

export interface SceneHint {
  readonly title: string
  readonly description: string
  readonly code?: string
}

export interface Scene {
  readonly kind: StructureKind
  readonly nodes: readonly SceneNode[]
  readonly edges: readonly SceneEdge[]
  readonly width: number
  readonly height: number
  readonly focusId: string | null
  readonly count: number
  readonly countLabel?: string
  readonly hint?: SceneHint
  readonly slots?: readonly SceneSlot[]
}

export interface AnimationStep {
  readonly phase: number
  readonly title: string
  readonly description: string
  readonly code: string
  readonly duration: number
  readonly scene: Scene
}
