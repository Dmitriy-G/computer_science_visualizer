import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseArrayLayout } from '../SparseArrayLayout.ts'

export class SetAnimation extends LinearAnimation {
  public static readonly title = 'Set an entry'
  public static readonly summary = 'Store a value at an index without allocating intervening holes.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(1)', 'O(s)'], 'The Map representation assumes expected constant-time access under normal hashing. A conservative O(s) worst bound allows a scan or table maintenance across s stored entries; JavaScript does not promise strict worst-case constant time.',
      ['O(1)', 'O(1)', 'O(s)'], 'One new entry is constant storage; a Map growth can allocate O(s) backing storage. Existing-entry updates need no new entry.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 's', meaning: 'Number of explicitly stored sparse entries; holes consume no entry storage.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(s)', meaning: 'Linear in the stored-entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SparseArrayLayout(), 'update-index', input, SetAnimation.title, SetAnimation.summary)
  }
}
