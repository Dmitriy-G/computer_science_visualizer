import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HNSWGraphLayout } from '../../../../AdvancedDataStructures/SpatialIndexes/HNSWGraph/HNSWGraphLayout.ts'

export class BreadthFirstAnimation extends LinearAnimation {
  public static readonly title = 'Breadth-first traversal'
  public static readonly summary = 'Visit the reachable outgoing neighbors from an existing vertex ID.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(V)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'Start validation first materializes all V vertex IDs, even for an isolated start. Traversal then reads existing level-zero adjacency lists. The average row is a whole-graph upper bound without a reachability distribution. Map and set accesses assume constant time.' },
      memory: { best: 'O(V)', average: 'O(V)', worst: 'O(V)', explanation: 'Start validation allocates V IDs. Visited/frontier records and returned output use O(V); DFS references the existing neighbor lists instead of copying edges. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'O(V)', meaning: 'Linear in the stored vertex count, including the start-validation ID array.' },
        { symbol: 'V', meaning: `Stored graph vertices; the current logical element count is ${size}.` },
        { symbol: 'E', meaning: 'Stored outgoing graph links or typed references.' },
        { symbol: 'O(V + E)', meaning: 'Linear combined growth in stored vertices and outgoing links.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { index: 1 }) {
    super(model, new HNSWGraphLayout(), 'breadth-first', input, BreadthFirstAnimation.title, BreadthFirstAnimation.summary)
  }
}
