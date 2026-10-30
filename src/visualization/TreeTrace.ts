export type TreeTracePhase = 'compare' | 'create' | 'connect' | 'rotate' | 'recolor' | 'split' | 'borrow' | 'merge' | 'remove' | 'visit'

export interface TreeTraceEvent {
  readonly phase: TreeTracePhase
  readonly activeId: string | null
  readonly title: string
  readonly description: string
  readonly code: string
  readonly pendingId?: string
}

export interface TreeTraceObserver {
  onTreeChange(event: TreeTraceEvent): void
}

export interface BinarySearchEntry {
  readonly id: string
  readonly value: number
  readonly leftId: string | null
  readonly rightId: string | null
  readonly height?: number
  readonly color?: 'red' | 'black'
}

export interface MultiwayTreeEntry {
  readonly id: string
  readonly keys: readonly number[]
  readonly childIds: readonly string[]
  readonly leaf: boolean
  readonly nextId?: string | null
}

export class TreeTrace {
  public static validate(value: number): void {
    if (!Number.isSafeInteger(value)) throw new TypeError('Tree keys must be safe integers')
  }

  public static emit(observer: TreeTraceObserver | undefined, phase: TreeTracePhase, activeId: string | null, title: string, description: string, code: string, pendingId?: string): void {
    observer?.onTreeChange({ phase, activeId, title, description, code, pendingId })
  }
}
