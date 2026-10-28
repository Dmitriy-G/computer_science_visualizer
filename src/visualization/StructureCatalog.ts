import { LinkedList } from '../structures/LinkedList.ts'
import { LinkedListLayout } from './LinkedListLayout.ts'
import type { Scene, SceneEdge, SceneNode, StructureKind } from './Scene.ts'

export interface StructureDefinition {
  readonly kind: StructureKind
  readonly name: string
  readonly description: string
  readonly symbol: string
}

export class StructureCatalog {
  public static readonly structures: readonly StructureDefinition[] = [
    {
      kind: 'linked-list',
      name: 'Linked list',
      description: 'Nodes connected by next pointers',
      symbol: '→',
    },
    {
      kind: 'array',
      name: 'Array',
      description: 'Values in consecutive indexed slots',
      symbol: '[]',
    },
    {
      kind: 'binary-tree',
      name: 'Binary tree',
      description: 'A hierarchy of parent and child nodes',
      symbol: '⋔',
    },
    {
      kind: 'graph',
      name: 'Graph',
      description: 'Vertices connected by undirected edges',
      symbol: '◇',
    },
  ]

  public static getName(kind: StructureKind): string {
    for (const structure of this.structures) {
      if (structure.kind === kind) return structure.name
    }
    return 'Data structure'
  }

  public static createPreview(kind: StructureKind, list: LinkedList): Scene {
    if (kind === 'linked-list')
      return new LinkedListLayout().create(list.getEntries())

    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    for (let index = 0; index < 10; index += 1) {
      let x = 82 + index * 92
      let y = 240
      if (kind === 'binary-tree') {
        const depth = Math.floor(Math.log2(index + 1))
        const position = index - (2 ** depth - 1)
        x = ((position + 0.5) * 1000) / 2 ** depth
        y = 65 + depth * 100
      } else if (kind === 'graph') {
        const angle = (index * Math.PI * 2) / 10 - Math.PI / 2
        x = 500 + Math.cos(angle) * 340
        y = 245 + Math.sin(angle) * 170
      }
      nodes.push({
        id: `${kind}-${index}`,
        value: (index + 1) * 10,
        x,
        y,
        label: kind === 'array' ? `index ${index}` : `node ${index + 1}`,
        tone: 'default',
        opacity: 1,
      })

      if (kind === 'binary-tree' && index > 0) {
        edges.push(this.createEdge(kind, Math.floor((index - 1) / 2), index))
      } else if (kind === 'graph') {
        edges.push(this.createEdge(kind, index, (index + 1) % 10))
      }
    }
    if (kind === 'graph') {
      edges.push(this.createEdge(kind, 0, 4))
      edges.push(this.createEdge(kind, 2, 7))
      edges.push(this.createEdge(kind, 5, 9))
    }
    return {
      kind,
      nodes,
      edges,
      width: 1000,
      height: 480,
      focusId: null,
      count: 10,
    }
  }

  private static createEdge(
    kind: StructureKind,
    from: number,
    to: number,
  ): SceneEdge {
    return {
      id: `${kind}-edge-${from}-${to}`,
      from: `${kind}-${from}`,
      to: `${kind}-${to}`,
      directed: false,
      highlighted: false,
      opacity: 1,
    }
  }
}
