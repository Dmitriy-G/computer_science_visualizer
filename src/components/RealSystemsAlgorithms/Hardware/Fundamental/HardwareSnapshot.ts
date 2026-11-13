import type { NodeTone } from '../../../../visualization/Scene.ts'
import type { HardwareDiagram } from '../../../../visualization/HardwareDiagram.ts'

export interface HardwareCell {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly tone?: NodeTone
  readonly status?: string
}

export interface HardwareBank {
  readonly name: string
  readonly cells: readonly HardwareCell[]
}

export class HardwareSnapshot {
  public readonly banks: readonly HardwareBank[]
  public readonly focusId: string | null
  public readonly events: number
  public readonly diagram: HardwareDiagram | null

  constructor(banks: readonly HardwareBank[] = [], focusId: string | null = null, events = 0, diagram: HardwareDiagram | null = null) {
    this.banks = banks
    this.focusId = focusId
    this.events = events
    this.diagram = diagram
  }

  public clone(): HardwareSnapshot {
    const banks: HardwareBank[] = []
    for (const bank of this.banks) {
      const cells: HardwareCell[] = []
      for (const cell of bank.cells) cells.push({ ...cell })
      banks.push({ name: bank.name, cells })
    }
    return new HardwareSnapshot(banks, this.focusId, this.events, this.diagram?.clone() ?? null)
  }
}
