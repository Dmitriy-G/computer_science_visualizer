import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { ReturnStackAnimation } from './ReturnStackAnimation.ts'
import { CpuLessonInformation } from '../CpuLesson.ts'

export class ReturnStackOverview {
  public static describe(): SystemOverviewInformation {
    const information = ReturnStackAnimation.describe()
    return {
      name: information.name,
      implementationNote: CpuLessonInformation.coreMapNote,
      summary: 'A small hardware stack that predicts return targets by remembering the addresses following nested calls.',
      problem: 'One return instruction can jump to many callers, so its next address is hard to predict from the instruction alone. Tracking call nesting supplies a likely target before the actual return resolves.',
      steps: [
        'Recognize a call and push the address immediately after it onto the return predictor.',
        'Push later nested calls above earlier calls.',
        'When a return is recognized, pop the most recent predicted address and steer instruction fetch there.',
        'Resolve the actual program return target independently of the prediction.',
        'Compare the targets and recover instruction fetch when the prediction is unavailable or incorrect.',
        'Repeat for deeper nesting; this example shows finite predictor capacity without changing the correctness of actual returns.',
      ],
      realWorldUsage: information.realWorldUsage && {
        ...information.realWorldUsage,
        technologies: [
          ...information.realWorldUsage.technologies,
          {
            name: 'Intel Core return stack buffer',
            url: 'https://cdrdv2-public.intel.com/821614/356477-Optimization-Reference-Manual-V2-050.pdf',
            usage: 'Intel documents a 16-entry return stack buffer for Core microarchitecture. Buffer size and boundary behavior vary by implementation.',
          },
        ],
      },
    }
  }
}
