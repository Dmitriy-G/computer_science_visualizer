import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { LinearHashingLayout } from '../LinearHashingLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert / update'
  public static readonly summary = 'Append to primary or overflow pages, then split the next pointed bucket when primary-page load exceeds 0.75.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'A bucket with room is constant. Expected amortized O(1) assumes well-distributed hash values and bounded primary-page load. A bad overflow chain or split can scan n records; split redistribution retains destination tails to move each record once.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Normally one record, occasionally an overflow page. A split retains O(n) temporary references to its records and allocates redistributed overflow pages. Expected amortized O(1) allocation assumes well-distributed hashes. Playback storage is excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original entry count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
        { symbol: 'O(n)', meaning: 'Work or storage proportional to original entries (or servers for the ring).' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new LinearHashingLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
