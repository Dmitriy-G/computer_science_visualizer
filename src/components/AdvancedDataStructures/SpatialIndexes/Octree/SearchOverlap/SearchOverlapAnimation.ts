import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { OctreeLayout } from '../OctreeLayout.ts'
export class SearchOverlapAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Search overlaps'
  public static readonly summary = 'Prune disjoint branches and return matching spatial records.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(nd)', worst: 'O(nd)', explanation: 'Point buckets hold at most two entries before midpoint subdivision. Integer coordinates in [-1024,1024) cap depth d at 11; allocation stores only occupied orthants. Queries can visit O(nd) allocated cells and return n points. Bounds hold without a spatial distribution assumption.' },
      memory: { best: 'O(1)', average: 'O(n + d)', worst: 'O(n + d)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'd', meaning: 'Maximum orthant subdivision depth; d is at most 11 here.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(nd)', meaning: 'Input size times subdivision depth.' },
        { symbol: 'O(n + d)', meaning: 'Returned points plus the subdivision stack.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new OctreeLayout(), 'search-overlap', input, SearchOverlapAnimation.title, SearchOverlapAnimation.summary)
  }
}
