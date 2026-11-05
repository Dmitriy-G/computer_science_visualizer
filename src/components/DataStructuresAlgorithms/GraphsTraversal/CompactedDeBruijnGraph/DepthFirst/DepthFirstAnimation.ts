import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CompactedDeBruijnGraphLayout } from '../../../../AdvancedDataStructures/SpecializedGraphs/CompactedDeBruijnGraph/CompactedDeBruijnGraphLayout.ts'

export class DepthFirstAnimation extends LinearAnimation {
  public static readonly title = 'Depth-first traversal'
  public static readonly summary = 'Visit the reachable outgoing neighbors from an existing vertex ID.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(V)', average: 'O(V² + E)', worst: 'O(V² + E)', explanation: 'Start validation first materializes all V vertex IDs, even for an isolated start. Each reached unitig is located by a linear search; its outgoing DNA degree is at most four. The average row is a whole-graph upper bound without a reachability distribution. Map and set accesses assume constant time.' },
      memory: { best: 'O(V)', average: 'O(V)', worst: 'O(V)', explanation: 'Start validation allocates V IDs. Visited/frontier records and returned output use O(V); each unitig has at most four outgoing DNA neighbors, so retained DFS neighbor arrays also total O(V). Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'O(V)', meaning: 'Linear in the stored vertex count, including the start-validation ID array.' },
        { symbol: 'V', meaning: `Stored graph vertices; the current logical element count is ${size}.` },
        { symbol: 'E', meaning: 'Stored outgoing graph links or typed references.' },
        { symbol: 'O(V² + E)', meaning: 'A quadratic vertex term plus the outgoing-link count.' },
        { symbol: 'O(V + E)', meaning: 'Linear combined growth in stored vertices and outgoing links.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { index: 1 }) {
    super(model, new CompactedDeBruijnGraphLayout(), 'depth-first', input, DepthFirstAnimation.title, DepthFirstAnimation.summary)
  }
}
