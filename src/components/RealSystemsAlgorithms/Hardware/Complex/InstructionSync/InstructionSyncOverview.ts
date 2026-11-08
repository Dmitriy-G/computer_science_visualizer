import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { InstructionSyncAnimation } from './InstructionSyncAnimation.ts'

export class InstructionSyncOverview {
  public static describe(): SystemOverviewInformation {
    const information = InstructionSyncAnimation.describe()
    return {
      name: information.name,
      summary: 'An Arm maintenance and synchronization sequence that makes newly written instruction bytes available to instruction fetch.',
      problem: 'Updating code through the data side can leave old bytes in instruction caches or already-fetched instruction streams. Cooperating executing cores must synchronize before entering the modified code.',
      steps: [
        'Coordinate the cores so they stop entering the code while it is modified.',
        'Write the new instruction bytes through the data side.',
        'Use DC CVAU for the affected code and DSB ISH to complete the clean to the Point of Unification.',
        'Use IC IVAU to invalidate the relevant instruction-cache copies.',
        'Execute DSB ISH to complete the required instruction-cache maintenance.',
        'Execute ISB on the modifying core so its instruction stream refetches the updated code.',
        'Notify each cooperating executing core after maintenance; each needs its own local instruction synchronization.',
        'Resume execution through the synchronized path and observe the new instruction.',
      ],
      realWorldUsage: information.realWorldUsage,
    }
  }
}
