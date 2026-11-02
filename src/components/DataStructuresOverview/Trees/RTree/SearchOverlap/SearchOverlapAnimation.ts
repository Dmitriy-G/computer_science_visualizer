import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { RTreeLayout } from '../RTreeLayout.ts'

export class SearchOverlapAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Search overlapping rectangles'
  public static readonly summary = 'Descend only through bounding rectangles intersecting the query.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n + k)', worst: 'O(n)', explanation: 'Best: all root bounds are disjoint. Average assumes selective queries and low overlap. Worst: overlapping pages force a scan of all n records; k records are returned.' },
      memory: { best: 'O(1)', average: 'O(log n + k)', worst: 'O(log n + k)', explanation: 'Output holds k records and recursion holds one balanced path; root rejection needs constant storage. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'k', meaning: 'Number of returned overlapping rectangles.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log n + k)', meaning: 'Balanced traversal plus the matching output records.' },
        { symbol: 'O(n)', meaning: 'Work or storage proportional to the original number of array values or stored records.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new RTreeLayout(), 'search-overlap', input, SearchOverlapAnimation.title, SearchOverlapAnimation.summary)
  }
}
