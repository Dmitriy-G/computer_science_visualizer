import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { RegisterRenamingAnimation } from './RegisterRenamingAnimation.ts'
import { CpuLessonInformation } from '../Cpu/CpuLesson.ts'

export class RegisterRenamingOverview {
  public static describe(): SystemOverviewInformation {
    const information = RegisterRenamingAnimation.describe()
    return {
      name: information.name,
      implementationNote: CpuLessonInformation.coreMapNote,
      summary: 'A CPU mechanism that maps program-visible register names to separate physical registers for different writes.',
      problem: 'Reusing a register name can create false dependencies between otherwise independent instructions. Renaming removes those name conflicts while preserving the actual producer of each operand.',
      steps: [
        'Start with speculative and committed mappings from architectural register names to values in the physical register file (PRF).',
        'For each instruction, capture its current source mappings before changing its destination mapping.',
        'Allocate a new physical destination and update the speculative rename map (RAT) for later instructions.',
        'Allocate ROB and issue-queue entries, then issue ready instructions using their captured physical sources.',
        'Write each result to its own physical destination, even if a later instruction reuses the architectural name.',
        'Retire completed instructions in order by updating committed mappings; values stay in the PRF. Release superseded physical registers when safe.',
      ],
      realWorldUsage: information.realWorldUsage && {
        ...information.realWorldUsage,
        technologies: [
          ...information.realWorldUsage.technologies,
          {
            name: 'Berkeley Out-of-Order Machine (BOOM) PRF renaming',
            url: 'https://docs.boom-core.org/en/latest/sections/rename-stage.html',
            usage: 'BOOM documents the PRF design used by this teaching example: speculative and committed values share physical registers, with rename mappings and a free list.',
          },
          {
            name: 'Arm Cortex-A15 register renaming',
            url: 'https://developer.arm.com/community/arm-community-blogs/b/architectures-and-processors-blog/posts/navigating-the-cortex-maze',
            usage: 'Arm documents register renaming among the microarchitectural features of Cortex-A15.',
          },
        ],
      },
    }
  }
}
