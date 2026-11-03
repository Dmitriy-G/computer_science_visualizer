import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AddressSpaceGraphLayout } from '../AddressSpaceGraphLayout.ts'

export class DeleteNodeAnimation extends LinearAnimation {
  public static readonly title = 'Delete a node'
  public static readonly summary = 'Remove a node key and every incident reference.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(E)', average: 'O(E)', worst: 'O(E)', explanation: 'Filters all references before removing the node from its Map. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(E)', average: 'O(E)', worst: 'O(E)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'E', meaning: 'Stored outgoing graph links or typed references.' },
        { symbol: 'O(E)', meaning: 'Linear work or storage in the stored reference/link count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 10 }) {
    super(model, new AddressSpaceGraphLayout(), 'delete-value', input, DeleteNodeAnimation.title, DeleteNodeAnimation.summary)
  }
}
