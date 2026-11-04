import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { OrderedSetLayout } from '../OrderedSetLayout.ts'

export class AddAnimation extends LinearAnimation {
  public static readonly title = 'Add a key'
  public static readonly summary = 'Insert one unique key and restore AVL balance.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'A duplicate root can be rejected immediately. A successful search and insertion follow logarithmic AVL paths and repair ancestors. The average row is an upper bound for every key distribution; empty insertion takes constant time. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'At most one new AVL leaf is allocated. Cached parent pointers allow iterative repair without a traversal stack. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of unique keys in the AVL-backed set; currently ${size} entries.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
        { symbol: 'O(log n)', meaning: 'Logarithmic growth, as in balanced-tree or binary-search depth.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 55 }) {
    super(model, new OrderedSetLayout(), 'insert', input, AddAnimation.title, AddAnimation.summary)
  }
}
