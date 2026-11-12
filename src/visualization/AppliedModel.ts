import { LinearModel } from './LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from './LinearModel.ts'
import type { ActionKind } from './ActionCatalog.ts'

export interface DiagramItem {
  readonly id: string
  readonly text: string
  readonly label: string
  readonly children?: readonly string[]
}

export interface DiagramLink {
  readonly from: string
  readonly to: string
  readonly label: string
}

export interface AppliedDiagram {
  readonly rows: readonly (readonly DiagramItem[])[]
  readonly links?: readonly DiagramLink[]
}

export abstract class AppliedModel extends LinearModel {
  public abstract getDiagram(): AppliedDiagram
  public abstract readonly representation: string
  public readonly countLabel: string = 'entries'

  protected reject(description: string): LinearResult { return { description, status: 'REJECTED' } }

  protected inspect(observer?: LinearObserver): LinearResult {
    for (const row of this.getDiagram().rows) {
      for (const item of row) LinearModel.emit(observer, item.id, `${item.label}: ${item.text}.`, 'inspect stored entry')
    }
    return { description: this.representation, value: this.length }
  }

  public static bounded(input: LinearInputValues, name: string, minimum: number, maximum: number): number {
    const value = LinearModel.integer(input, name)
    if (value < minimum || value > maximum) throw new RangeError(`${name} must be between ${minimum} and ${maximum}`)
    return value
  }

  public static dna(input: LinearInputValues, minimum = 3, maximum = 64): string {
    const text = input.text
    if (typeof text !== 'string' || !/^[acgt]+$/.test(text) || text.length < minimum || text.length > maximum)
      throw new TypeError(`Enter ${minimum} to ${maximum} lowercase a/c/g/t bases`)
    return text
  }

  public static isQuery(action: ActionKind): boolean {
    return ['search-value', 'search-index', 'search-text', 'search-overlap', 'nearest-neighbor', 'find-gap', 'verify-proof', 'browse-node', 'breadth-first', 'depth-first', 'inspect-storage', 'peek'].includes(action)
  }
}
