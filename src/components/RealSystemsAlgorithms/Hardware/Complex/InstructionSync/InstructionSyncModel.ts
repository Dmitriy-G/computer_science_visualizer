import { HardwareModel } from '../HardwareModel.ts'
import { InstructionSyncLayout } from './InstructionSyncLayout.ts'

export class InstructionSyncModel {
  private flow = 'none'
  private flowCore = 0
  public data = 1
  public pou = 1
  public instruction: (number | null)[] = [1, 1]
  public pipeline: (number | null)[] = [1, 1]
  public cleanPending = false
  public invalidatePending = false
  public write(): void {
    this.data = 2
    this.flow = 'write'
  }
  public dcCvau(): void {
    this.cleanPending = true
    this.flow = 'request'
  }
  public dsb(): void {
    this.flow = this.cleanPending ? 'clean' : 'complete'
    if (this.cleanPending) {
      this.pou = this.data
      this.cleanPending = false
    }
    if (this.invalidatePending) {
      this.instruction = [null, null]
      this.invalidatePending = false
    }
  }
  public icIvau(): void {
    if (this.cleanPending || this.pou !== this.data) throw new Error('Complete data clean first')
    this.invalidatePending = true
    this.flow = 'invalidate'
  }
  public isb(core: number): void {
    if (this.invalidatePending || this.cleanPending) throw new Error('Complete maintenance before ISB')
    this.flow = 'isb'
    this.flowCore = core
    this.pipeline[core] = null
  }
  public execute(core: number): number {
    this.flow = this.pipeline[core] === null ? 'fetch' : 'execute'
    this.flowCore = core
    if (this.pipeline[core] === null) {
      if (this.instruction[core] === null) this.instruction[core] = this.pou
      this.pipeline[core] = this.instruction[core]
    }
    return this.pipeline[core]!
  }
  public snapshot(): HardwareModel {
    return new HardwareModel([
      { name: 'Code data', cells: [
        { id: 'dcache', label: 'D-cache write', value: `MOV w0,#${this.data}`, status: this.cleanPending ? 'clean pending' : 'data side' },
        { id: 'pou', label: 'unification point', value: `MOV w0,#${this.pou}` },
      ] },
      { name: 'Core 0', cells: [
        { id: 'ic-0', label: 'I-cache', value: this.instruction[0] === null ? 'invalid' : `MOV w0,#${this.instruction[0]}` },
        { id: 'pipe-0', label: 'fetched stream', value: this.pipeline[0] === null ? 'refetch needed' : `MOV w0,#${this.pipeline[0]}` },
      ] },
      { name: 'Core 1', cells: [
        { id: 'ic-1', label: 'I-cache', value: this.instruction[1] === null ? 'invalid' : `MOV w0,#${this.instruction[1]}` },
        { id: 'pipe-1', label: 'fetched stream', value: this.pipeline[1] === null ? 'refetch needed' : `MOV w0,#${this.pipeline[1]}` },
      ] },
    ], 'Arm AArch64 generated-code example: cacheable Inner Shareable code, distinct data/instruction paths, explicit maintenance required (no IDC/DIC shortcuts). Both cores cooperate before executing modified code. IC invalidation is scoped to participating caches; ISB affects only the executing core. No concurrent unsafe patching or persistence claim.', null, 0, InstructionSyncLayout.create(this.flow, this.flowCore))
  }
}
