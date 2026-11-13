import type { AppliedStructureKind } from './AppliedStructureKinds.ts'
import type { NumericalStructureKind } from './NumericalStructureKinds.ts'

export type StructureKind = NumericalStructureKind | AppliedStructureKind | 'disjoint-set' | 'ordered-set' | 'multiset' | 'interval-set' | 'suffix-array' | 'suffix-automaton' | 'aho-corasick-automaton' | 'dawg' | 'fm-index' | 'counting-bloom-filter' | 'cuckoo-filter' | 'quotient-filter' | 'count-min-sketch' | 'hyperloglog' | 'reservoir-sampling-buffer' | 'open-addressing-hash-table' | 'separate-chaining-hash-table' | 'robin-hood-hash-table' | 'cuckoo-hash-table' | 'hopscotch-hashing' | 'extendible-hashing' | 'linear-hashing' | 'perfect-hash-table' | 'consistent-hashing-ring' | 'general-tree' | 'unordered-binary-tree' | 'complete-binary-tree' | 'threaded-binary-tree' | 'splay-tree' | 'treap' | 'cartesian-tree' | 'scapegoat-tree' | 'aa-tree' | 'two-three-tree' | 'two-three-four-tree' | 'radix-tree' | 'ternary-search-tree' | 'suffix-tree' | 'interval-tree' | 'order-statistic-tree' | 'persistent-segment-tree' | 'sparse-table' | 'kd-tree' | 'quadtree' | 'octree' | 'bvh' | 'merkle-tree' | 'van-emde-boas-tree' | 'linked-list' | 'array' | 'binary-tree' | 'graph' | 'stack' | 'queue' | 'deque' | 'doubly-linked-list' | 'circular-buffer' | 'avl-tree' | 'red-black-tree' | 'b-tree' | 'b-plus-tree' | 'hash-map' | 'hash-set' | 'bloom-filter' | 'trie' | 'heap' | 'segment-tree' | 'fenwick-tree' | 'r-tree' | 'lsm-tree' | 'ast' | 'directed-graph' | 'weighted-graph' | 'dag' | 'multigraph' | 'skip-list' | 'unrolled-linked-list' | 'xor-linked-list' | 'gap-buffer' | 'rope' | 'bit-set' | 'sparse-array' | 'free-list' | 'priority-queue' | 'binary-max-heap' | 'binomial-heap' | 'fibonacci-heap' | 'pairing-heap' | 'leftist-heap' | 'skew-heap' | 'indexed-priority-queue' | 'monotonic-queue' | 'bipartite-graph' | 'complete-graph' | 'tree-graph' | 'hypergraph' | 'flow-network' | 'functional-graph' | 'adjacency-matrix' | 'adjacency-list' | 'edge-list' | 'compressed-sparse-row'
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
  readonly curveOffset?: number
  readonly loopRadius?: number
  readonly flow?: boolean
  readonly message?: string
}

export interface SceneRegion {
  readonly id: string
  readonly label: string
  readonly shortLabel?: string
  readonly role: 'cpu' | 'cache' | 'memory' | 'interconnect' | 'observer' | 'device'
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly level?: 'system' | 'component'
  readonly parentId?: string
}


export interface ScenePath {
  readonly id: string
  readonly d: string
  readonly label: string
  readonly highlighted: boolean
  readonly directed?: boolean
  readonly bidirectional?: boolean
  readonly dashed?: boolean
  readonly fill?: string
  readonly stroke?: string
  readonly strokeWidth?: number
  readonly caption?: { readonly text: string, readonly x: number, readonly y: number }
}

export interface Scene {
  readonly kind: StructureKind | 'cpu-hardware' | 'hardware-system' | 'hardware-component' | 'system-overview'
  readonly nodes: readonly SceneNode[]
  readonly edges: readonly SceneEdge[]
  readonly width: number
  readonly height: number
  readonly focusId: string | null
  readonly count: number
  readonly countLabel?: string
  readonly slots?: readonly SceneSlot[]
  readonly regions?: readonly SceneRegion[]
  readonly paths?: readonly ScenePath[]
  readonly camera?: SceneCamera
  readonly layers?: readonly SceneLayer[]
}

export interface SceneBounds {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export interface SceneCamera {
  readonly from: SceneBounds
  readonly to: SceneBounds
}

export interface SceneDetailRange {
  readonly startWidth: number
  readonly endWidth: number
}

export interface SceneLayer {
  readonly id: string
  readonly scene: Scene
  readonly x: number
  readonly y: number
  readonly scale: number
  readonly reveal?: SceneDetailRange
  readonly conceal?: SceneDetailRange
}

export interface AnimationStep {
  readonly phase: number
  readonly title: string
  readonly description: string
  readonly code: string
  readonly duration: number
  readonly scene: Scene
}
