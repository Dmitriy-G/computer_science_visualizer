import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { MoesiAnimation } from './MoesiAnimation.ts'

export class MoesiOverview {
  public static describe(): SystemOverviewInformation {
    const information = MoesiAnimation.describe()
    return {
      name: information.name,
      implementationNote: 'MOESI has documented Arm and x86 implementations. The specific processor and cache/interconnect design determine which coherence protocol is used.',
      summary: 'A cache-coherence protocol with Modified, Owned, Exclusive, Shared, and Invalid states for cached memory lines.',
      problem: 'Several caches can hold copies of the same line, while a dirty cache may contain newer data than memory. MOESI tracks who may write and who must supply current data, including shared dirty lines.',
      steps: [
        'Start with no valid cached copies and a clean line in memory.',
        'Give the first reader an Exclusive copy.',
        'Let that core write the line, moving it to Modified while memory may retain the old value.',
        'On another read, have the dirty holder supply current data and become Owned; the reader becomes Shared.',
        'Serve additional readers from the owner without requiring an immediate memory write-back.',
        'When a sharer needs to write, invalidate other copies and grant it Modified ownership of the whole line.',
        'Observe that writing one field invalidates peers using another field in that same line.',
        'Before evicting the dirty owner in this example, write the current line back to memory.',
      ],
      realWorldUsage: information.realWorldUsage && {
        ...information.realWorldUsage,
        technologies: [
          ...information.realWorldUsage.technologies,
          {
            name: 'AMD Ryzen cache coherence',
            url: 'https://gpuopen.com/download/GDC-2023-AMD-Ryzen-Processor-Software-Optimization.pdf',
            usage: 'AMD documents MOESI in its Ryzen processor optimization guide, providing an x86 implementation alongside the Arm example.',
          },
        ],
      },
    }
  }
}
