import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { OrderedSetLayout } from '../OrderedSetLayout.ts'

export class LowerBoundAnimation extends LinearAnimation {
  public static readonly title = 'Lower bound'
  public static readonly summary = 'Find the smallest stored key that is greater than or equal to the query.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Track the best candidate while descending one root-to-leaf AVL path. Nonempty AVL trees have logarithmic root-to-leaf depth; no key distribution assumption is required. An empty set returns null in constant time. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a candidate and current node are retained. The operation does not enumerate or copy the tree. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of unique keys in the AVL-backed set; currently ${size} entries.` },
        { symbol: 'O(log n)', meaning: 'Logarithmic growth, as in balanced-tree or binary-search depth.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 45 }) {
    super(model, new OrderedSetLayout(), 'lower-bound', input, LowerBoundAnimation.title, LowerBoundAnimation.summary)
  }
}
