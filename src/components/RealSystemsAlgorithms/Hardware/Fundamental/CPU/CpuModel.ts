import type { NodeTone } from '../../../../../visualization/Scene.ts'

export type CpuAlgorithmKind = 'register-renaming' | 'out-of-order' | 'branch-prediction' | 'return-stack'

export interface CpuCell {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly tone?: NodeTone
  readonly status?: string
}

export interface CpuBank {
  readonly name: string
  readonly cells: readonly CpuCell[]
}

export class CpuModel {
  public readonly banks: readonly CpuBank[]
  public readonly detail: string
  public readonly focusId: string | null
  public readonly events: number

  constructor(banks: readonly CpuBank[] = [], detail = 'Choose a CPU mechanism to inspect its hardware state.', focusId: string | null = null, events = 0) {
    this.banks = banks
    this.detail = detail
    this.focusId = focusId
    this.events = events
  }

  public clone(): CpuModel {
    const banks: CpuBank[] = []
    for (const bank of this.banks) {
      const cells: CpuCell[] = []
      for (const cell of bank.cells) cells.push({ ...cell })
      banks.push({ name: bank.name, cells })
    }
    return new CpuModel(banks, this.detail, this.focusId, this.events)
  }
}
