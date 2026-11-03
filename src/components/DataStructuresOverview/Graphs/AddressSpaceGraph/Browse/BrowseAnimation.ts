import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AddressSpaceGraphLayout } from '../AddressSpaceGraphLayout.ts'

export class BrowseAnimation extends LinearAnimation {
  public static readonly title = 'Browse references'
  public static readonly summary = 'Return all outgoing typed references from a node.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(E)', average: 'O(E)', worst: 'O(E)', explanation: 'Scans all references and retains the outgoing-reference result. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(E)', average: 'O(E)', worst: 'O(E)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'E', meaning: 'Stored outgoing graph links or typed references.' },
        { symbol: 'O(E)', meaning: 'Linear work or storage in the stored reference/link count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 1 }) {
    super(model, new AddressSpaceGraphLayout(), 'browse-node', input, BrowseAnimation.title, BrowseAnimation.summary)
  }
}
