import { ProbabilisticModel } from '../ProbabilisticModel.ts'
import { ProbabilisticHash } from '../../../../visualization/ProbabilisticHash.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export interface ReservoirEntry { readonly id: string; readonly value: number; readonly arrival: number }

export class ReservoirSamplingBuffer extends ProbabilisticModel {
  public readonly kind = 'reservoir-sampling-buffer' as const
  public static readonly capacity = 5
  private sample: ReservoirEntry[] = []
  private randomState = 0x243f6a8885a308d3n
  private nextId = 0

  public static createDefault(): ReservoirSamplingBuffer {
    const model = new ReservoirSamplingBuffer()
    for (let value = 10; value <= 100; value += 10) model.execute('insert', { value })
    return model
  }

  public getSample(): readonly ReservoirEntry[] { return this.sample.map((entry) => ({ ...entry })) }

  // Rejection sampling removes modulo bias from each 32-bit draw. A public
  // fixed seed makes lessons reproducible, not suitable for secure sampling.
  private choose(bound: number): number {
    const range = 0x100000000
    const limit = range - range % bound
    let draw: number
    do {
      this.randomState = (this.randomState + 0x9e3779b97f4a7c15n) & ((1n << 64n) - 1n)
      draw = Number(ProbabilisticHash.mix(this.randomState) >> 32n)
    } while (draw >= limit)
    return draw % bound
  }

  public clone(): ReservoirSamplingBuffer {
    const copy = new ReservoirSamplingBuffer()
    copy.count = this.count
    copy.sample = this.sample.map((entry) => ({ ...entry }))
    copy.randomState = this.randomState
    copy.nextId = this.nextId
    return copy
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      this.sample = []
      this.count = 0
      this.randomState = 0x243f6a8885a308d3n
      ReservoirSamplingBuffer.emit(observer, null, 'Empty the sample and restart the seeded stream experiment.', 'sample = []; seen = 0; reset seed')
      return { description: 'The sample and stream counter are empty. The random seed has restarted.' }
    }
    if (action === 'inspect-storage') {
      for (const entry of this.sample) ReservoirSamplingBuffer.emit(observer, entry.id, `Retained value ${entry.value} arrived at stream position ${entry.arrival}.`, 'visit retained sample item')
      return { description: `${this.sample.length} retained stream occurrences after ${this.count} arrivals. Under ideal uniform draws each occurrence has inclusion probability min(1, 5/seen); duplicates are separate occurrences.`, value: this.sample.map((entry) => entry.value) }
    }
    if (action !== 'insert') throw new RangeError('Unsupported reservoir operation')
    const value = ReservoirSamplingBuffer.integer(input, 'value')
    if (this.count >= 0xffffffff) return this.rejected('The lesson supports at most 2^32 - 1 arrivals per experiment.')
    const arrival = this.count + 1
    const slot = this.sample.length < 5 ? this.sample.length : this.choose(arrival)
    this.count = arrival
    ReservoirSamplingBuffer.emit(observer, 'stream-count', `Arrival ${arrival}: ${value}. ${arrival <= 5 ? 'Fill the initial reservoir.' : `Draw j = ${slot} uniformly from 0 through ${arrival - 1} using seeded rejection sampling.`}`, 'seen += 1; j = seen <= 5 ? seen - 1 : uniformInteger(0, seen - 1)')
    if (slot >= 5) return { description: `Skip value ${value}: j = ${slot} is outside the five sample slots. The arrival still counts.` }
    const entry = { id: `sample-${this.nextId++}`, value, arrival }
    this.sample[slot] = entry
    ReservoirSamplingBuffer.emit(observer, entry.id, `Retain ${value} in slot ${slot}${arrival > 5 ? ', replacing its previous occurrence' : ''}.`, 'if j < 5: sample[j] = incoming', 'NEW')
    return { description: `Retained ${value}. The reservoir holds ${this.sample.length} occurrences after ${this.count} arrivals.` }
  }
}
