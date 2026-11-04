import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { VanEmdeBoasTreeLayout } from '../VanEmdeBoasTreeLayout.ts'
export class InsertAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Insert a key'
  public static readonly summary = 'Insert a unique key using this tree\'s own placement and repair policy.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(log log U)', worst: 'O(log log U)', explanation: 'Min/max hits are constant; recursive high/low decomposition repeatedly square-roots universe U=256. Maps allocate only occupied clusters. Dictionary access is assumed O(1); these are recursive-operation bounds, not a claim of standard eager O(U) allocation.' },
      memory: { best: 'O(1)', average: 'O(log U)', worst: 'O(log U)', explanation: 'Lazy first-cluster insertion can allocate both summary and cluster structures recursively, bounded by O(log U) new nodes; recursion uses O(log log U). Existing model storage, clones, and playback snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'U', meaning: 'Integer universe size; U = 256 in this demonstration.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log log U)', meaning: 'Number of recursive square-root universe decompositions.' },
        { symbol: 'O(log U)', meaning: 'A logarithmic upper bound for lazily allocated universe nodes.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new VanEmdeBoasTreeLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
