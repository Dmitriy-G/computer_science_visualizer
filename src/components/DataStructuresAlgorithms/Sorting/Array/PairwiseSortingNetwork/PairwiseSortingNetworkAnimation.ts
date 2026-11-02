import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'

export class PairwiseSortingNetworkAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Pairwise Sorting Network', 'Order pairs internally, recursively order their lower and upper members, then combine the interleaved ordered pairs.', size,
      ['O(n log² n)', 'O(n log² n)', 'O(n log² n)'],
      'Parberry’s pairwise network performs O(n log² n) sequential comparator work in every case. The schedule depends only on length, so the average is the same for any distribution. Prune conceptual trailing infinity wires for arbitrary lengths while keeping every real slot. Empty and singleton inputs take O(1).',
      'O(log n)', 'A recursive strided generator needs a logarithmic stack and constant exchange storage. Comparator lists and padding arrays are not allocated. Long-distance exchanges can reorder equal keys, so the network is unstable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Pairwise Sorting Network')
    this.result.pairwiseSortingNetwork((event) => this.recordTrace(event))
    this.finish(false)
  }
}
