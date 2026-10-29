export type StructureKind = 'linked-list' | 'array' | 'binary-tree' | 'graph'
export type NodeTone = 'default' | 'visited' | 'active' | 'new'

export interface SceneNode {
  readonly id: string
  readonly value: number
  readonly x: number
  readonly y: number
  readonly label: string
  readonly tone: NodeTone
  readonly opacity: number
  readonly status?: string
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
}

export interface Scene {
  readonly kind: StructureKind
  readonly nodes: readonly SceneNode[]
  readonly edges: readonly SceneEdge[]
  readonly width: number
  readonly height: number
  readonly focusId: string | null
  readonly count: number
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
