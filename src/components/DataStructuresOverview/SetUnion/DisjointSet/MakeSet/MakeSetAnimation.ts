import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { DisjointSetLayout } from '../DisjointSetLayout.ts'

export class MakeSetAnimation extends LinearAnimation {
  public static readonly title = 'Make set'
  public static readonly summary = 'Add a new member as its own singleton component.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Map lookup and insertion have expected amortized constant cost; a collision chain or growth can cost O(n). Duplicate values are rejected before allocating an ID. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'A successful addition retains one new node. A Map growth may allocate O(n) index storage. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of members in the forest; currently ${size} entries.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
        { symbol: 'O(n)', meaning: 'Linear growth in the number of members, keys, or stored intervals.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 110 }) {
    super(model, new DisjointSetLayout(), 'insert', input, MakeSetAnimation.title, MakeSetAnimation.summary)
  }
}
