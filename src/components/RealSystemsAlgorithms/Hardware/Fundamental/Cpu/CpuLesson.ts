import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HardwareOverviewLesson } from '../HardwareOverviewLesson.ts'
import { HardwareTrace } from '../HardwareTrace.ts'

export abstract class CpuLesson extends HardwareOverviewLesson {
  protected createTrace(): HardwareTrace { return new HardwareTrace('cpu-hardware') }
}

export class CpuLessonInformation {
  public static readonly coreMapNote = 'The shared core map is a conceptual superset of components, not a specific processor pipeline. Renaming and out-of-order lessons use a PRF holding speculative and committed values; committed mappings identify architectural register state without a separate architectural register file. Dispatch means entry into scheduling queues; issue selects ready work for execution. Stage boundaries, TLB organization, and whether L2 is private or shared vary by design. Idle units provide context and need not exist in every cited processor. Pipeline arrows show logical progress, not clock cycles or exact physical wiring.'

  public static create(name: string, summary: string, product: string, url: string, usage: string, limits: string): AlgorithmInformation {
    const bound = { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }
    return {
      name, summary, modelNotes: `${limits} Diagrams locate the mechanism inside one CPU core with registers, instruction cache, and data-cache context. Cache lookup, replacement, hit/miss behavior, and exact wiring are not simulated. Arrows show the current logical instruction, operand, result, prediction, or retirement flow.`,
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
