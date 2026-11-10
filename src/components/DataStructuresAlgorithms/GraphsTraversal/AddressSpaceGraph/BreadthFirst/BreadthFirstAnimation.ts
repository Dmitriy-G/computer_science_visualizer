import { AddressSpaceGraphPseudocode } from '../AddressSpaceGraphPseudocode.ts'
import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AddressSpaceGraphLayout } from '../../../../AdvancedDataStructures/SpecializedGraphs/AddressSpaceGraph/AddressSpaceGraphLayout.ts'

export class BreadthFirstAnimation extends LinearAnimation {
  public static readonly pseudocode = AddressSpaceGraphPseudocode.breadthFirst
  public static readonly title = 'Breadth-first traversal'
  public static readonly summary = 'Visit the reachable outgoing neighbors from an existing vertex ID.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(V + E)', average: 'O(V(E + V))', worst: 'O(V(E + V))', explanation: 'Validation allocates V vertex IDs; an isolated start then filters all E references. Each reached vertex filters references, deduplicates targets, and sorts its neighbors. The average/worst rows are conservative whole-graph upper bounds, assuming constant-time Map/Set access and O(d log d) sorting for d neighbors.' },
      memory: { best: 'O(V)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'Validation always allocates V IDs. BFS retains only the current filtered references and neighbor list, plus visited, queue, and output records. Average is an upper bound without a reachability distribution. Playback storage is excluded.' },
      terms: [
        { symbol: 'd', meaning: 'Number of distinct outgoing neighbors of one vertex.' },
        { symbol: 'O(V)', meaning: 'Linear in the stored vertex count.' },
        { symbol: 'V', meaning: `Stored graph vertices; the current logical element count is ${size}.` },
        { symbol: 'E', meaning: 'Stored outgoing graph links or typed references.' },
        { symbol: 'O(V(E + V))', meaning: 'A conservative bound when each visited vertex scans and orders representation neighbors.' },
        { symbol: 'O(V + E)', meaning: 'Linear combined growth in stored vertices and outgoing links.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { index: 1 }) {
    super(model, new AddressSpaceGraphLayout(), 'breadth-first', input, BreadthFirstAnimation.title, BreadthFirstAnimation.summary)
  }
}
