import type { ActionKind } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'
import type { TreeTraceObserver } from './TreeTrace.ts'

export type TreeInputValues = Readonly<Record<string, string | number>>

export interface TreeDiagramEntry {
  readonly id: string
  readonly text: string
  readonly label: string
  readonly children: readonly string[]
  readonly width?: number
}

export interface TreeOperationResult {
  readonly description: string
  readonly returnValue?: boolean | number | bigint | string | readonly (number | string)[] | null
  readonly error?: string
  readonly activeId?: string | null
  readonly status?: string
}

export abstract class AdditionalTreeModel {
  public abstract readonly kind: StructureKind
  public abstract get length(): number
  public abstract clone(): AdditionalTreeModel
  public abstract getDiagram(): readonly TreeDiagramEntry[]
  public abstract execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult

  public static integer(input: TreeInputValues, name: string): number {
    const value = input[name]
    if (typeof value !== 'number' || !Number.isSafeInteger(value)) throw new TypeError(`${name} must be a safe integer`)
    return value
  }
}
