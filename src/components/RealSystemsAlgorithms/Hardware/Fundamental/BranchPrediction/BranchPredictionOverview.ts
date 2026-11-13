import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { BranchPredictionAnimation } from './BranchPredictionAnimation.ts'
import { CpuLessonInformation } from '../Cpu/CpuLesson.ts'

export class BranchPredictionOverview {
  public static describe(): SystemOverviewInformation {
    const information = BranchPredictionAnimation.describe()
    return {
      name: information.name,
      implementationNote: CpuLessonInformation.coreMapNote,
      summary: 'A CPU mechanism that predicts branch direction from the outcomes of earlier branches.',
      problem: 'Instruction fetch needs the next address before a branch has finished executing. Predicting its direction reduces the time spent waiting for the result.',
      steps: [
        'Record the outcomes of recently resolved branches in a history register.',
        'In this example, use that history to select a prediction-table counter.',
        'Read the counter to predict taken or not taken before the actual outcome is known.',
        'Let instruction fetch follow the predicted direction.',
        'When the branch resolves, compare its actual direction with the prediction and redirect fetch if needed.',
        'Train the selected counter and shift the actual outcome into history for the next prediction.',
      ],
      realWorldUsage: information.realWorldUsage && {
        ...information.realWorldUsage,
        technologies: [
          ...information.realWorldUsage.technologies,
          {
            name: 'Intel Pentium II / Pentium III branch prediction',
            url: 'https://download.intel.com/design/PentiumII/manuals/24512701.pdf',
            usage: 'Intel documents dynamic prediction using recent branch directions. Its per-branch history organization differs from the illustrative global-history table.',
          },
        ],
      },
    }
  }
}
