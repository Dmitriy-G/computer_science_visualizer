import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { OrderedSetLayout } from '../OrderedSetLayout.ts'

export class RemoveAnimation extends LinearAnimation {
  public static readonly title = 'Remove a key'
  public static readonly summary = 'Delete one matching key and repair AVL balance along its ancestors.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'A miss at a root with an empty chosen child takes constant time. Other searches, successor replacement, and repairs are bounded by AVL height. Average is a distribution-independent upper bound. Empty deletion is constant time. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Cached parent pointers support iterative successor replacement and repair without a stack. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of unique keys in the AVL-backed set; currently ${size} entries.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
        { symbol: 'O(log n)', meaning: 'Logarithmic growth, as in balanced-tree or binary-search depth.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 40 }) {
    super(model, new OrderedSetLayout(), 'delete-value', input, RemoveAnimation.title, RemoveAnimation.summary)
  }
}
