import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AddressSpaceGraphLayout } from '../AddressSpaceGraphLayout.ts'

export class AddReferenceAnimation extends LinearAnimation {
  public static readonly title = 'Add a typed reference'
  public static readonly summary = 'Connect two existing nodes with a unique source/type/target reference.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(E)', average: 'O(E)', worst: 'O(E)', explanation: 'Scans stored references for duplicates; JavaScript reference-array growth can require linear auxiliary allocation. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(E)', average: 'O(E)', worst: 'O(E)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'E', meaning: 'Stored outgoing graph links or typed references.' },
        { symbol: 'O(E)', meaning: 'Linear work or storage in the stored reference/link count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { source: 1, target: 10, referenceType: 0 }) {
    super(model, new AddressSpaceGraphLayout(), 'add-edge', input, AddReferenceAnimation.title, AddReferenceAnimation.summary)
  }
}
