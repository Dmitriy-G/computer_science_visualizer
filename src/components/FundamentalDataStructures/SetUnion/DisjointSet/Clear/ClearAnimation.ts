import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { DisjointSetLayout } from '../DisjointSetLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release descendants before their parent so every remaining link stays valid.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n²)', explanation: 'Build child rows and visit every member twice. Expected Map access gives linear time; conservative linear-cost Map operations give quadratic worst time. Empty clear takes constant time. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Child rows and a postorder work stack retain O(n) entries while the forest is released. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of members in the forest; currently ${size} entries.` },
        { symbol: 'O(n)', meaning: 'Linear growth in the number of members, keys, or stored intervals.' },
        { symbol: 'O(n²)', meaning: 'Quadratic growth in the member count under the stated conservative Map assumption.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new DisjointSetLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
