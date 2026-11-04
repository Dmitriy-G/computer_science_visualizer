import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { InvertedIndexLayout } from '../InvertedIndexLayout.ts'

export class IndexDocumentAnimation extends LinearAnimation {
  public static readonly title = 'Index a document'
  public static readonly summary = 'Insert or replace a document and its term postings.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m n log(n + 1))', average: 'O(m n log(n + 1))', worst: 'O(m n log(n + 1))', explanation: 'Up to m distinct input terms update sorted postings of at most n documents; replacing an old document also visits its bounded prior terms. The bound is conservative and includes postings retained by the update. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(m n)', average: 'O(m n)', worst: 'O(m n)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'm', meaning: 'Input text length or the number of bounded words considered by this operation.' },
        { symbol: 'O(m n log(n + 1))', meaning: 'Term-count work multiplied by posting length and its comparison-sorting factor.' },
        { symbol: 'O(m n)', meaning: 'Work or storage bounded by the product of bounded term/input length and logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { index: 11, text: 'red graph' }) {
    super(model, new InvertedIndexLayout(), 'insert', input, IndexDocumentAnimation.title, IndexDocumentAnimation.summary)
  }
}
