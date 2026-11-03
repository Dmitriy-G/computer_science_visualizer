import type { LinearInputValues } from './LinearModel.ts'
import { AppliedModel } from './AppliedModel.ts'

export interface PointEntry {
  readonly id: number
  readonly x: number
  readonly y: number
}

export class PointData {
  public static read(input: LinearInputValues): { x: number, y: number } {
    return { x: AppliedModel.bounded(input, 'x', -1024, 1024), y: AppliedModel.bounded(input, 'y', -1024, 1024) }
  }

  public static parse(text: unknown): readonly { x: number, y: number }[] {
    if (typeof text !== 'string') throw new TypeError('Enter x:y pairs separated by commas')
    const parts = text.split(',')
    if (parts.length < 1 || parts.length > 64) throw new RangeError('Enter 1 to 64 points')
    const points: { x: number, y: number }[] = []
    for (const part of parts) {
      const match = /^\s*(-?\d+)\s*:\s*(-?\d+)\s*$/.exec(part)
      if (!match) throw new TypeError('Use x:y pairs separated by commas')
      points.push(this.read({ x: Number(match[1]), y: Number(match[2]) }))
    }
    return points
  }

  public static distance(a: { x: number, y: number }, b: { x: number, y: number }): number {
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2
  }

  public static defaults(): PointEntry[] {
    return [{ id: 1, x: 5, y: 8 }, { id: 2, x: 15, y: 4 }, { id: 3, x: 9, y: 24 }, { id: 4, x: 30, y: 18 }, { id: 5, x: 22, y: 31 }, { id: 6, x: 40, y: 7 }, { id: 7, x: 37, y: 40 }, { id: 8, x: 55, y: 26 }, { id: 9, x: 48, y: 52 }, { id: 10, x: 63, y: 44 }]
  }
}
