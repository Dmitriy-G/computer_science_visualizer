import { HardwareModel } from './HardwareModel.ts'
import { PublicationLayout } from './PublicationLayout.ts'

// Shared publication primitive. Lessons choose their own instruction constraints.
export class PublicationModel {
  public flow = 'none'
  public data = 0
  public flag = 0
  public observedFlag: number | null = null
  public observedData: number | null = null
  public earlyData: number | null = null

  public publishData(): void {
    this.data = 42
    this.flow = 'data-store'
  }
  public publishFlag(ordered: boolean): boolean {
    if (ordered && this.data !== 42) {
      this.flow = 'blocked'
      return false
    }
    this.flag = 1
    this.flow = 'flag-store'
    return true
  }
  public readFlag(acquire: boolean): number {
    this.observedFlag = this.flag
    this.flow = 'flag-load'
    // The post-acquire load must observe a value consistent with synchronization.
    if (acquire && this.flag === 1) this.earlyData = null
    return this.flag
  }
  public readData(): number {
    this.observedData = this.earlyData ?? this.data
    this.flow = 'data-load'
    return this.observedData
  }
  public snapshot(detail: string, mode: 'plain' | 'dmb' | 'acquire-release' = 'plain'): HardwareModel {
    return new HardwareModel([
      { name: 'Shared', cells: [
        { id: 'data', label: 'data', value: `${this.data}` },
        { id: 'flag', label: 'flag', value: `${this.flag}` },
      ] },
      { name: 'Consumer', cells: [
        { id: 'seen-flag', label: 'flag register', value: `${this.observedFlag ?? '?'}` },
        { id: 'seen-data', label: 'data register', value: `${this.observedData ?? '?'}` },
        { id: 'early-data', label: 'early data read', value: `${this.earlyData ?? 'none'}` },
      ] },
    ], detail, null, 0, PublicationLayout.create(mode, this.flow, this.earlyData !== null))
  }
}
