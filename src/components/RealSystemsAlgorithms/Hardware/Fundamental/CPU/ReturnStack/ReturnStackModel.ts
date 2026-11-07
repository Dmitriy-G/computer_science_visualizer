import { CpuModel } from '../CpuModel.ts'
import type { CpuCell } from '../CpuModel.ts'

export class ReturnStackModel {
  public readonly predictions: number[] = []
  public readonly actualReturns: number[] = []
  public lost = 0
  public underflows = 0
  public matched = 0
  public returns = 0
  public predicted: number | null = null
  public actual: number | null = null
  private last = 'Initial state'

  public call(returnAddress: number): void {
    if (this.actualReturns.length >= 10) throw new RangeError('Example call depth is bounded at ten')
    this.actualReturns.push(returnAddress)
    if (this.predictions.length === 8) {
      this.predictions.shift()
      this.lost += 1
    }
    this.predictions.push(returnAddress)
    this.predicted = null
    this.actual = null
    this.last = `call → save ${this.hex(returnAddress)}`
  }

  public returnFromCall(): boolean {
    if (this.actualReturns.length === 0) throw new RangeError('No actual call to return from')
    this.predicted = this.predictions.pop() ?? null
    this.actual = this.actualReturns.pop()!
    this.returns += 1
    if (this.predicted === null) this.underflows += 1
    const correct = this.predicted === this.actual
    if (correct) this.matched += 1
    this.last = correct ? 'return predicted' : 'prediction unavailable'
    return correct
  }

  private hex(value: number): string { return `0x${value.toString(16).toUpperCase()}` }

  public snapshot(): CpuModel {
    const slots: CpuCell[] = []
    for (let index = 0; index < 8; index += 1) slots.push({
      id: `return-${index}`, label: `slot ${index}`, value: index < this.predictions.length ? this.hex(this.predictions[index]) : 'empty',
      tone: index === this.predictions.length - 1 ? 'active' : 'default', status: 'TOP',
    })
    return new CpuModel([
      { name: 'Return stack', cells: slots },
      { name: 'Flow', cells: [
        { id: 'depth', label: 'call depth', value: String(this.actualReturns.length) },
        { id: 'predicted', label: 'prediction', value: this.predicted === null ? 'unavailable' : this.hex(this.predicted) },
        { id: 'actual', label: 'actual target', value: this.actual === null ? '—' : this.hex(this.actual) },
        { id: 'event', label: 'event', value: this.last },
      ] },
      { name: 'Results', cells: [
        { id: 'matches', label: 'matched returns', value: `${this.matched}/${this.returns}` },
        { id: 'lost', label: 'overflow losses', value: String(this.lost) },
        { id: 'underflow', label: 'empty predictions', value: String(this.underflows) },
      ] },
    ], 'Cortex-A53 documents an eight-entry hardware return stack. This model drops the oldest prediction when full and reports no prediction when empty; those boundary rules are teaching choices, not documented A53 behavior. Actual return targets are tracked separately and do not depend on predictor success.', this.predictions.length ? `return-${this.predictions.length - 1}` : null)
  }
}
