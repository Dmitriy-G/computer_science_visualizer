import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AddressSpaceGraphLayout } from '../AddressSpaceGraphLayout.ts'

export class RemoveReferenceAnimation extends LinearAnimation {
  public static readonly title = 'Remove a reference'
  public static readonly summary = 'Remove the reference with the visible r-number.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(E)', average: 'O(E)', worst: 'O(E)', explanation: 'Filters the reference array into a new array of surviving edges. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(E)', average: 'O(E)', worst: 'O(E)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'E', meaning: 'Stored outgoing graph links or typed references.' },
        { symbol: 'O(E)', meaning: 'Linear work or storage in the stored reference/link count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { index: 1 }) {
    super(model, new AddressSpaceGraphLayout(), 'remove-edge', input, RemoveReferenceAnimation.title, RemoveReferenceAnimation.summary)
  }
}
