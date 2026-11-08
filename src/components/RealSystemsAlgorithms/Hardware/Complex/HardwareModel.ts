import type { NodeTone } from '../../../../visualization/Scene.ts'
import type { HardwareDiagram } from '../../../../visualization/HardwareDiagram.ts'

export type HardwareAlgorithmKind = 'store-buffering' | 'memory-fences' | 'dmb' | 'dsb' | 'acquire-release' | 'exclusive-loop' | 'lse-atomics' | 'locked-atomics' | 'moesi' | 'mesif' | 'translation' | 'instruction-sync'

export interface HardwareCell {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly status?: string
  readonly tone?: NodeTone
}

export interface HardwareBank {
  readonly name: string
  readonly cells: readonly HardwareCell[]
}

// Immutable visual state, separate from the mechanism models in each lesson.
export class HardwareModel {
  public readonly banks: readonly HardwareBank[]
  public readonly detail: string
  public readonly focusId: string | null
  public readonly events: number
  public readonly diagram: HardwareDiagram | null

  constructor(
    banks: readonly HardwareBank[] = [],
    detail = 'Choose a mechanism to explore interacting cores, caches, and memory.',
    focusId: string | null = null,
    events = 0,
    diagram: HardwareDiagram | null = null,
  ) {
    this.banks = banks
    this.detail = detail
    this.focusId = focusId
    this.events = events
    this.diagram = diagram
  }

  public clone(): HardwareModel {
    const banks: HardwareBank[] = []
    for (const bank of this.banks) {
      const cells: HardwareCell[] = []
      for (const cell of bank.cells) cells.push({ ...cell })
      banks.push({ name: bank.name, cells })
    }
    return new HardwareModel(banks, this.detail, this.focusId, this.events, this.diagram?.clone() ?? null)
  }
}
