import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { EdgeListLayout } from '../EdgeListLayout.ts'

export class SearchByValueAnimation extends LinearAnimation {
  public static readonly title = 'Search by value'
  public static readonly summary = 'Scan registered vertex values and stop at the matching vertex.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(V)', worst: 'O(V)', explanation: 'A first registered match is constant work. Uniformly distributed matches require linear average work; a last match or miss scans V vertices. Search does not change graph storage.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a loop variable and current vertex reference are needed; the graph is unchanged.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new EdgeListLayout(), 'search-value', input, SearchByValueAnimation.title, SearchByValueAnimation.summary)
  }
}
