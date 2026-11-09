import { LatchLayout } from './LatchLayout.ts'

export type Bit = 0 | 1

export class LatchModel {
  public data: Bit = 0
  public enabled = false
  public stored: Bit = 0
  public outputEnabled = true
  public readonly history: { data: Bit, enabled: boolean, stored: Bit }[] = []

  public apply(data: Bit, enabled: boolean): void {
    this.data = data
    this.enabled = enabled
    if (enabled) this.stored = data
    this.history.push({ data, enabled, stored: this.stored })
  }

  public snapshot() { return LatchLayout.create(this) }
}
