import { LinearScene } from './LinearScene.ts'
import type { SceneNode } from './Scene.ts'

export interface TextStateCell {
  readonly id: string
  readonly text: string
  readonly label: string
  readonly rank: number
}

export class StringTextScene {
  public static cell(id: string, text: string, label: string, column: number, row: number, width = 180, top = 115): SceneNode {
    return LinearScene.node(id, text, label, 90 + width / 2 + column * (width + 40), top + row * 155, width)
  }

  public static width(values: readonly string[], labels: readonly string[], minimum = 180): number {
    let width = minimum
    for (const value of values) width = Math.max(width, value.length * 14 + 32)
    for (const label of labels) width = Math.max(width, label.length * 6 + 24)
    return width
  }

  public static ranked(states: readonly TextStateCell[]): SceneNode[] {
    const width = this.width(states.map((state) => state.text), states.map((state) => state.label))
    const rows = new Map<number, number>()
    const nodes: SceneNode[] = []
    for (const state of states) {
      const row = rows.get(state.rank) ?? 0
      rows.set(state.rank, row + 1)
      nodes.push(this.cell(state.id, state.text, state.label, state.rank, row, width))
    }
    return nodes
  }
}
