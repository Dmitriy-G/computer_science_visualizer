import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AddressSpaceGraphLayout } from '../../../../AdvancedDataStructures/SpecializedGraphs/AddressSpaceGraph/AddressSpaceGraphLayout.ts'

export class BreadthFirstAnimation extends LinearAnimation {
  public static readonly title = 'Breadth-first traversal'
  public static readonly summary = 'Visit the reachable outgoing neighbors from an existing vertex ID.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(V(E + V))', average: 'O(V(E + V))', worst: 'O(V(E + V))', explanation: 'Visits reachable vertices in stored outgoing-neighbor order. The displayed bound includes this representation\'s neighbor lookup and visited/frontier/output storage; it is a conservative upper bound for every graph shape. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
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
