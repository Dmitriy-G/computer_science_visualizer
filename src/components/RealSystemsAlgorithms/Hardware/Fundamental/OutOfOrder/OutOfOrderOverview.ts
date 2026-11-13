import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { OutOfOrderAnimation } from './OutOfOrderAnimation.ts'
import { CpuLessonInformation } from '../CpuLesson.ts'

export class OutOfOrderOverview {
  public static describe(): SystemOverviewInformation {
    const information = OutOfOrderAnimation.describe()
    return {
      name: information.name,
      implementationNote: CpuLessonInformation.coreMapNote,
      summary: 'A CPU execution mechanism that runs ready instructions ahead of stalled older instructions, then commits their effects in program order.',
      problem: 'A slow instruction can leave execution units idle even when independent work is ready. Out-of-order execution uses that idle capacity while preserving data dependencies and correct committed state.',
      steps: [
        'Start with captured physical operands, dispatch instructions into issue queues in program order, and track completion in a reorder buffer.',
        'Issue the slow load while keeping its dependent instructions waiting.',
        'Execute independent instructions whose operands are ready.',
        'Write completed results to physical registers and mark ROB entries complete; committed mappings remain unchanged until retirement.',
        'Deliver the load result and wake instructions that depend on it.',
        'Resolve the branch; if its prediction was wrong, discard younger work, release its physical destinations, restore surviving rename mappings, and redirect fetch.',
        'Retire completed, unsquashed instructions from the ROB head in program order, updating committed mappings and freeing superseded registers.',
      ],
      realWorldUsage: information.realWorldUsage && {
        ...information.realWorldUsage,
        technologies: [
          ...information.realWorldUsage.technologies,
          {
            name: 'Berkeley Out-of-Order Machine (BOOM) ROB and PRF',
            url: 'https://docs.boom-core.org/en/latest/sections/reorder-buffer.html',
            usage: 'BOOM documents program-order dispatch and retirement, completion tracking in the ROB, and commit-time updates to rename state. Its PRF organization supplies the variant illustrated here.',
          },
          {
            name: 'Arm Cortex-A15 out-of-order execution',
            url: 'https://developer.arm.com/community/arm-community-blogs/b/architectures-and-processors-blog/posts/navigating-the-cortex-maze',
            usage: 'Arm identifies out-of-order execution as a Cortex-A15 microarchitectural feature.',
          },
        ],
      },
    }
  }
}
