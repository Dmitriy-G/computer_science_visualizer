import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MultisetLayout } from '../MultisetLayout.ts'

export class RemoveOneAnimation extends LinearAnimation {
  public static readonly title = 'Remove one occurrence'
  public static readonly summary = 'Remove exactly one occurrence and erase its entry only at count zero.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(d)', explanation: 'Expected Map lookup/update/delete cost is constant; conservative collision-heavy access is linear in distinct values. An absent value leaves the bag unchanged. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'At most one replacement counter record is allocated. Zero counters are removed, and existing Map allocation is retained. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'd', meaning: `Number of distinct values; the header counts total occurrences; currently ${size} distinct values.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
        { symbol: 'O(d)', meaning: 'Linear growth in the distinct-value count, irrespective of multiplicities.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 30 }) {
    super(model, new MultisetLayout(), 'delete-value', input, RemoveOneAnimation.title, RemoveOneAnimation.summary)
  }
}
