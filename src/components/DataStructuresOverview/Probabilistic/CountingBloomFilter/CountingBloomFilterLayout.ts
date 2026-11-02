import { CountingBloomFilter } from './CountingBloomFilter.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { ProbabilisticScene } from '../../../../visualization/ProbabilisticScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class CountingBloomFilterLayout {
  public create(source: LinearModel, frame: LinearFrame = {}): Scene {
    const model = source as CountingBloomFilter
    const nodes = model.getCounters().map((counter, index) => ProbabilisticScene.cell(`counter-${index}`, String(counter), `counter ${index}`, index % 8, Math.floor(index / 8), 100))
    return LinearScene.create(model, nodes, [], frame, {
      title: '32 four-bit counters · 3 seeded hashes',
      description: 'Zero at any hashed position means definitely absent; all positive means possibly present. Repeated hash positions contribute repeatedly. Overflow rejects the whole insertion. An extra exact-key occurrence ledger guards deletion only; it adds memory beyond the compact filter and never answers queries.',
      code: 'C[h_i(value) mod 32] += 1; contains(value) = every hashed counter > 0',
    }, 'live insertion occurrences')
  }
}
