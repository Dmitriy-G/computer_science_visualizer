import { LinearModel } from './LinearModel.ts'
import type { LinearObserver } from './LinearModel.ts'

export interface PriorityDiagramNode {
  readonly id: string
  readonly text: string
  readonly label: string
  readonly children: readonly string[]
}

export interface PriorityDiagram {
  readonly nodes: readonly PriorityDiagramNode[]
  readonly roots: readonly string[]
  readonly circularRoots?: boolean
}

export abstract class PriorityModel extends LinearModel {
  public abstract clone(): PriorityModel
  public abstract getDiagram(): PriorityDiagram

  public static parseValues(text: string): readonly number[] {
    if (text.length > 320 || !/^\s*-?\d+(?:\s*,\s*-?\d+)*\s*$/.test(text)) throw new TypeError('Enter comma-separated whole numbers')
    const values: number[] = []
    for (const item of text.split(',')) {
      const value = Number(item.trim())
      if (!Number.isSafeInteger(value)) throw new TypeError('Each value must be a safe integer')
      values.push(value)
    }
    if (values.length < 1 || values.length > 16) throw new RangeError('Use 1 to 16 donor values')
    return values
  }

  protected trace(observer: LinearObserver | undefined, id: string | null, description: string, code: string, status?: string): void {
    LinearModel.emit(observer, id, description, code, status)
  }
}
