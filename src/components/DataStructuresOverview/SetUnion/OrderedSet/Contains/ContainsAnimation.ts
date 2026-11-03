import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { OrderedSetLayout } from '../OrderedSetLayout.ts'

export class ContainsAnimation extends LinearAnimation {
  public static readonly title = 'Contains key'
  public static readonly summary = 'Follow AVL comparisons to check exact key membership.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'A root match is constant time; a deep match or miss follows a logarithmic-height AVL path. Average logarithmic time assumes uniformly distributed successful keys; empty search is constant time. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Iterative lookup keeps only a current-node reference. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of unique keys in the AVL-backed set; currently ${size} entries.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
        { symbol: 'O(log n)', meaning: 'Logarithmic growth, as in balanced-tree or binary-search depth.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 40 }) {
    super(model, new OrderedSetLayout(), 'search-value', input, ContainsAnimation.title, ContainsAnimation.summary)
  }
}
