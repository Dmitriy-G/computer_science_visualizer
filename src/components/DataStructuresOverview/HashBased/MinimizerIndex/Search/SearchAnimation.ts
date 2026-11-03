import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MinimizerIndexLayout } from '../MinimizerIndexLayout.ts'

export class SearchAnimation extends LinearAnimation {
  public static readonly title = 'Search DNA text'
  public static readonly summary = 'Generate candidates from minimizer anchors and verify complete matches.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n m)', average: 'O(n m)', worst: 'O(n m)', explanation: 'Repeated seeds may generate all n reference starts; exact verification can compare m query bases at each start. Candidates are deduplicated. Bounds assume expected Map/Set operations. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(n + m)', average: 'O(n + m)', worst: 'O(n + m)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'm', meaning: 'Input text length or the number of bounded words considered by this operation.' },
        { symbol: 'O(n m)', meaning: 'A product bound, such as checking a query at every candidate reference start.' },
        { symbol: 'O(n + m)', meaning: 'Linear combined storage or work in the indexed data and query lengths.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { text: 'acgtt' }) {
    super(model, new MinimizerIndexLayout(), 'search-text', input, SearchAnimation.title, SearchAnimation.summary)
  }
}
