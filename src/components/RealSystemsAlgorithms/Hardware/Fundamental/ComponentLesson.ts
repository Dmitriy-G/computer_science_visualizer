import type { AlgorithmInformation } from '../../../../visualization/AlgorithmInformation.ts'
import type { SystemOverviewInformation } from '../../../../visualization/SystemOverviewInformation.ts'
import { HardwareOverviewLesson } from './HardwareOverviewLesson.ts'
import { HardwareTrace } from './HardwareTrace.ts'

export abstract class ComponentLesson extends HardwareOverviewLesson {
  protected createTrace(): HardwareTrace { return new HardwareTrace('hardware-component') }
}

export class ComponentInformation {
  public static describe(overview: SystemOverviewInformation): AlgorithmInformation {
    const bound = { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }
    return {
      name: overview.name, summary: overview.summary, modelNotes: overview.implementationNote,
      time: { ...bound, explanation: 'A fixed, bounded demonstration; these are visualizer costs, not device latency or throughput.' },
      memory: { ...bound, explanation: 'Fixed teaching state and bounded independent snapshots; not a production device storage bound.' },
      terms: [], realWorldUsage: overview.realWorldUsage,
    }
  }
}
