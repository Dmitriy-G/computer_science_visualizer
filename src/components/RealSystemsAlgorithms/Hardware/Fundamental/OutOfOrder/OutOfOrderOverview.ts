import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { OutOfOrderAnimation } from './OutOfOrderAnimation.ts'

export class OutOfOrderOverview {
  public static describe(): SystemOverviewInformation {
    const information = OutOfOrderAnimation.describe()
    return {
      name: information.name,
      summary: 'A CPU execution mechanism that runs ready instructions ahead of stalled older instructions, then commits their effects in program order.',
      problem: 'A slow instruction can leave execution units idle even when independent work is ready. Out-of-order execution uses that idle capacity while preserving data dependencies and correct committed state.',
      steps: [
        'Dispatch instructions in program order and track them in a reorder buffer.',
        'Issue the slow load while keeping its dependent instructions waiting.',
        'Execute independent instructions whose operands are ready.',
        'Keep completed results speculative until older instructions can retire.',
        'Deliver the load result and wake instructions that depend on it.',
        'Resolve the branch; if its prediction was wrong, discard younger wrong-path work and redirect fetch.',
        'Retire completed, unsquashed instructions from the head of the buffer in program order.',
      ],
      realWorldUsage: information.realWorldUsage && {
        ...information.realWorldUsage,
        technologies: [
          ...information.realWorldUsage.technologies,
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
