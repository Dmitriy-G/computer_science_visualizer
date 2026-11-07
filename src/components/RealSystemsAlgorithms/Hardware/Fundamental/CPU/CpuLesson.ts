import type { ActionDefinition, ActionPlan } from '../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import type { CpuModel } from './CpuModel.ts'
import { CpuTrace } from './CpuTrace.ts'

export abstract class CpuLesson implements ActionDefinition<CpuModel> {
  public abstract readonly title: string
  public readonly context = 'CPU hardware'
  public readonly summary = 'A deterministic hardware-state example inside one processor core.'
  public readonly phases = ['Initial state', 'Hardware events', 'Result']
  public readonly timelineHint = 'Hardware events, not measured processor cycles'
  protected abstract build(trace: CpuTrace): void

  public create(_source: CpuModel): ActionPlan<CpuModel> {
    const trace = new CpuTrace()
    this.build(trace)
    return { steps: trace.steps, result: trace.result.clone() }
  }
}

export class CpuLessonInformation {
  public static create(name: string, summary: string, product: string, url: string, usage: string, limits: string): AlgorithmInformation {
    const bound = { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }
    return {
      name, summary,
      time: { ...bound, explanation: 'This lesson executes a fixed, bounded example. These bounds describe the visualizer, not hardware latency or processor throughput.' },
      memory: { ...bound, explanation: 'Fixed-size teaching state and a bounded sequence of independent scene snapshots. No claim about a production processor’s storage cost.' },
      terms: [
        { symbol: 'architectural state', meaning: 'The registers and effects visible to the instruction-set programmer.' },
        { symbol: 'microarchitecture', meaning: 'The hardware organization implementing the instruction set.' },
      ],
      realWorldUsage: {
        technologies: [{ name: `${product} microarchitecture`, url, usage }],
        products: [{ name: product, url, usage }], note: limits,
      },
    }
  }
}
