import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { InvertedIndexLayout } from '../InvertedIndexLayout.ts'

export class SearchTermsAnimation extends LinearAnimation {
  public static readonly title = 'Search all terms'
  public static readonly summary = 'Intersect postings to find documents containing every query word.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m n)', average: 'O(m n)', worst: 'O(m n)', explanation: 'For up to m query terms, two-pointer intersections scan at most n IDs per term. Map lookup is expected constant time; output contains at most n document IDs. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'm', meaning: 'Input text length or the number of bounded words considered by this operation.' },
        { symbol: 'O(m n)', meaning: 'Work or storage bounded by the product of bounded term/input length and logical entry count.' },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { text: 'red tree' }) {
    super(model, new InvertedIndexLayout(), 'search-text', input, SearchTermsAnimation.title, SearchTermsAnimation.summary)
  }
}
