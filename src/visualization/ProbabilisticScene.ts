import { LinearScene } from './LinearScene.ts'
import type { SceneNode } from './Scene.ts'

// Shared geometry only. Models and layouts own their representation and labels.
export class ProbabilisticScene {
  public static cell(id: string, value: string, label: string, column: number, row: number, width = 150): SceneNode {
    return LinearScene.node(id, value, label, 90 + width / 2 + column * (width + 36), 115 + row * 160, width)
  }

  public static width(values: readonly string[], labels: readonly string[], minimum = 150): number {
    let width = minimum
    for (const value of values) width = Math.max(width, value.length * 14 + 32)
    for (const label of labels) width = Math.max(width, label.length * 6 + 24)
    return width
  }
}
