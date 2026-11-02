import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CompleteGraphLayout } from '../../../../DataStructuresOverview/Graphs/CompleteGraph/CompleteGraphLayout.ts'

export class BreadthFirstAnimation extends LinearAnimation {
  public static readonly title = 'Breadth-first traversal'
  public static readonly summary = 'Visit reachable vertices in queue order from a chosen start.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V²)', average: 'O(V²)', worst: 'O(V²)', explanation: 'Each reached source scans up to V neighbors or cells. A complete graph reaches every vertex; matrix traversal may reach only a smaller component. The displayed average bound is conservative without a distribution assumption.' },
      memory: { best: 'O(V)', average: 'O(V)', worst: 'O(V)', explanation: 'The discovery set, queue, and returned order contain at most V vertices; neighbor materialization is also at most V.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CompleteGraphLayout(), 'breadth-first', input, BreadthFirstAnimation.title, BreadthFirstAnimation.summary)
  }
}
