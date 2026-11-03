import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { InvertedIndexLayout } from '../InvertedIndexLayout.ts'

export class DeleteDocumentAnimation extends LinearAnimation {
  public static readonly title = 'Delete a document'
  public static readonly summary = 'Remove its ID from each term posting and drop empty lists.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m n)', average: 'O(m n)', worst: 'O(m n)', explanation: 'Filters each of the document\'s m bounded term lists. Map operations assume ordinary expected hashing; replacement lists require storage. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(m n)', average: 'O(m n)', worst: 'O(m n)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'm', meaning: 'Input text length or the number of bounded words considered by this operation.' },
        { symbol: 'O(m n)', meaning: 'Work or storage bounded by the product of bounded term/input length and logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { index: 1 }) {
    super(model, new InvertedIndexLayout(), 'delete-value', input, DeleteDocumentAnimation.title, DeleteDocumentAnimation.summary)
  }
}
