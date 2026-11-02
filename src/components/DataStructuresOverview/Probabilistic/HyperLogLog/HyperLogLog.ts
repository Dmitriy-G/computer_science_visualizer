import { ProbabilisticModel } from '../ProbabilisticModel.ts'
import { ProbabilisticHash } from '../../../../visualization/ProbabilisticHash.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export class HyperLogLog extends ProbabilisticModel {
  public readonly kind = 'hyperloglog' as const
  private registers = new Array<number>(16).fill(0)

  public static createDefault(): HyperLogLog {
    const model = new HyperLogLog()
    for (let value = 10; value <= 100; value += 10) model.execute('insert', { value })
    return model
  }

  public getRegisters(): readonly number[] { return [...this.registers] }

  public estimate(): number {
    let sum = 0
    let zeros = 0
    for (const register of this.registers) {
      sum += 2 ** -register
      if (register === 0) zeros += 1
    }
    const raw = 0.673 * 16 * 16 / sum
    return raw <= 40 && zeros > 0 ? 16 * Math.log(16 / zeros) : raw
  }

  public clone(): HyperLogLog {
    const copy = new HyperLogLog()
    copy.count = this.count
    copy.registers = [...this.registers]
    return copy
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      this.registers.fill(0)
      this.count = 0
      HyperLogLog.emit(observer, null, 'Reset all sixteen maximum-rank registers.', 'M.fill(0)')
      return { description: 'Empty HyperLogLog; estimated distinct count is zero.' }
    }
    if (action === 'estimate-cardinality') {
      for (let index = 0; index < 16; index += 1) HyperLogLog.emit(observer, `register-${index}`, `Accumulate 2^(-${this.registers[index]}) and count zero registers.`, 'sum += 2 ** -M[j]; zeros += (M[j] == 0)')
      const estimate = this.estimate()
      return { description: `Estimated distinct count: ${estimate.toFixed(2)}. Small-range linear counting is used when applicable. This is an estimate, not an exact set size.`, value: estimate }
    }
    if (action !== 'insert') throw new RangeError('Unsupported HyperLogLog operation')
    const value = HyperLogLog.integer(input, 'value')
    if (this.count === Number.MAX_SAFE_INTEGER) return this.rejected('The add-operation counter reached its safe-integer limit.')
    const hash = ProbabilisticHash.hash(value)
    const index = Number(hash & 15n)
    const remainder = hash >> 4n
    let rank = 1
    for (let bit = 59; bit >= 0 && (remainder & (1n << BigInt(bit))) === 0n; bit -= 1) rank += 1
    HyperLogLog.emit(observer, `register-${index}`, `Hash ${value} to register ${index}; the remaining 60 bits have rank ${rank}.`, 'j = hash & 15; rank = leadingZeros(hash >> 4, 60) + 1')
    const before = this.registers[index]
    this.registers[index] = Math.max(before, rank)
    this.count += 1
    HyperLogLog.emit(observer, `register-${index}`, `Register ${index}: max(${before}, ${rank}) = ${this.registers[index]}. Repeated values cannot raise it again.`, 'M[j] = max(M[j], rank)', this.registers[index] > before ? 'NEW' : 'UNCHANGED')
    return { description: `Recorded an add operation. Estimated distinct count: ${this.estimate().toFixed(2)}.` }
  }
}
