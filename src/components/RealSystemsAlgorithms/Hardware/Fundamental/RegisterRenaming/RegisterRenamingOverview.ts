import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { RegisterRenamingAnimation } from './RegisterRenamingAnimation.ts'
import { CpuLessonInformation } from '../CpuLesson.ts'

export class RegisterRenamingOverview {
  public static describe(): SystemOverviewInformation {
    const information = RegisterRenamingAnimation.describe()
    return {
      name: information.name,
      implementationNote: CpuLessonInformation.coreMapNote,
      summary: 'A CPU mechanism that maps program-visible register names to separate physical registers for different writes.',
      problem: 'Reusing a register name can create false dependencies between otherwise independent instructions. Renaming removes those name conflicts while preserving the actual producer of each operand.',
      steps: [
        'Start with mappings from architectural register names to physical registers.',
        'For each instruction, capture its current source mappings before changing its destination mapping.',
        'Allocate a new physical destination and update the rename map for later instructions.',
        'Execute ready instructions using their captured physical sources.',
        'Write each result to its own physical destination, even if a later instruction reuses the architectural name.',
        'Retire completed instructions in order, commit their results, and release superseded physical registers when safe.',
      ],
      realWorldUsage: information.realWorldUsage && {
        ...information.realWorldUsage,
        technologies: [
          ...information.realWorldUsage.technologies,
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
