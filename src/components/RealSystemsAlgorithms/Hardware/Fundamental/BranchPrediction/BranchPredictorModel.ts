import { CpuModel } from '../CpuModel.ts'
import { BranchPredictionLayout } from './BranchPredictionLayout.ts'
import type { CpuCell } from '../CpuModel.ts'

export class BranchPredictorModel {
  public readonly counters = [1, 1, 1, 1, 1, 1, 1, 1]
  public history = 0
  public resolved = 0
  public correct = 0
  public lastIndex = 0
  public predicted: boolean | null = null
  public actual: boolean | null = null
  private pending = false
  private flow = 'none'
  private pc = '—'

  public predict(pc: string): boolean {
    if (this.pending) throw new RangeError('Resolve the previous prediction first')
    this.flow = 'predict'
    this.pc = pc
    this.lastIndex = this.history
    this.predicted = this.counters[this.lastIndex] >= 2
    this.actual = null
    this.pending = true
    return this.predicted
  }

  public resolve(taken: boolean): boolean {
    if (!this.pending) throw new RangeError('No prediction to resolve')
    this.flow = 'resolve'
    const matched = this.predicted === taken
    if (matched) this.correct += 1
    const counter = this.counters[this.lastIndex]
    this.counters[this.lastIndex] = taken ? Math.min(3, counter + 1) : Math.max(0, counter - 1)
    this.history = ((this.history << 1) | Number(taken)) & 7
    this.actual = taken
    this.resolved += 1
    this.pending = false
    return matched
  }

  public snapshot(): CpuModel {
    const counters: CpuCell[] = []
    const labels = ['strong N', 'weak N', 'weak T', 'strong T']
    for (let index = 0; index < this.counters.length; index += 1) counters.push({
      id: `counter-${index}`, label: index.toString(2).padStart(3, '0'), value: `${this.counters[index]} · ${labels[this.counters[index]]}`,
      tone: this.predicted !== null && index === this.lastIndex ? 'active' : 'default', status: this.predicted !== null && index === this.lastIndex ? 'SELECTED ENTRY' : undefined,
    })
    return new CpuModel([
      { name: 'Predictor', cells: [
        { id: 'history', label: 'history', value: this.history.toString(2).padStart(3, '0') },
        { id: 'branch-pc', label: 'branch PC', value: this.pc },
        { id: 'predicted', label: 'prediction', value: this.predicted === null ? '—' : this.predicted ? 'taken' : 'not taken' },
        { id: 'actual', label: 'resolved', value: this.actual === null ? 'pending' : this.actual ? 'taken' : 'not taken' },
      ] },
      { name: 'PHT', cells: counters },
      { name: 'Results', cells: [
        { id: 'resolved', label: 'branches', value: String(this.resolved) },
        { id: 'correct', label: 'correct', value: String(this.correct) },
        { id: 'misses', label: 'mispredictions', value: String(this.resolved - this.correct) },
      ] },
    ], this.predicted === null ? null : `counter-${this.lastIndex}`, 0, BranchPredictionLayout.create({
      flow: this.flow, index: this.lastIndex, predicted: this.predicted, actual: this.actual,
      correct: this.correct, resolved: this.resolved, counter: this.counters[this.lastIndex],
      history: this.history.toString(2).padStart(3, '0'), pc: this.pc,
    }))
  }
}
