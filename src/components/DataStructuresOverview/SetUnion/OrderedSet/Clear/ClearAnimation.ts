import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { OrderedSetLayout } from '../OrderedSetLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release the ordered-set nodes in postorder without repeated balancing.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Every node is visited and released once. No random-shape assumption is needed; empty clear is constant time. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', explanation: 'The explicit postorder stack is bounded by AVL height. Empty clear uses constant memory. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of unique keys in the AVL-backed set; currently ${size} entries.` },
        { symbol: 'O(n)', meaning: 'Linear growth in the number of members, keys, or stored intervals.' },
        { symbol: 'O(log n)', meaning: 'Logarithmic growth, as in balanced-tree or binary-search depth.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new OrderedSetLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
