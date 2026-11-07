import { CpuLesson, CpuLessonInformation } from '../CpuLesson.ts'
import type { CpuTrace } from '../CpuTrace.ts'
import { BranchPredictorModel } from './BranchPredictorModel.ts'

export class BranchPredictionAnimation extends CpuLesson {
  public readonly title = 'History-based branch prediction'

  public static describe() {
    return CpuLessonInformation.create('History-based branch prediction',
      'Use previous branch outcomes to predict direction, then train prediction state when the branch resolves.',
      'Arm Cortex-A53', 'https://documentation-service.arm.com/static/5e9075f9c8052b1608761519',
      'The Cortex-A53 TRM documents global branch-history registers and a 3072-entry pattern-history prediction table.',
      'Illustrative global-history predictor: three history bits, eight two-bit saturating counters, and history-only indexing. Arm does not identify these exact rules as the Cortex-A53 implementation. The lesson explains the documented mechanism without claiming a replica.')
  }

  protected build(trace: CpuTrace): void {
    const model = new BranchPredictorModel()
    trace.record(model.snapshot(), 'Cold predictor', 'All teaching counters start weakly not taken. The branch outcome is unknown when prediction is made.', 'history = 0b000\nPHT[0..7] = 1  // teaching model', 0)
    const outcomes = [true, true, false, true, true, false, true, true, false, true, true, false]
    for (let index = 0; index < outcomes.length; index += 1) {
      const pc = index % 2 === 0 ? '0x100' : '0x200'
      const prediction = model.predict(pc)
      trace.record(model.snapshot(), `Predict branch ${index + 1}`, `Use the current history to select an entry. Predict ${prediction ? 'taken' : 'not taken'} before this branch’s actual outcome is supplied.`, 'index = history\npredicted_taken = PHT[index] >= 2')
      const correct = model.resolve(outcomes[index])
      trace.record(model.snapshot(), correct ? 'Prediction matched' : 'Misprediction',
        `${correct ? 'The predicted direction matched.' : 'A real core would redirect speculative fetch.'} Train the selected counter and shift the actual outcome into global history.`,
        'PHT[index] = clamp(PHT[index] + (taken ? 1 : -1), 0, 3)\nhistory = ((history << 1) | taken) & 0b111')
    }
    trace.record(model.snapshot(), 'Learned history patterns', `${model.correct} of ${model.resolved} predictions matched this fixed trace. This result describes the teaching model, not an A53 benchmark.`, `correct = ${model.correct}; resolved = ${model.resolved}`, 2)
  }
}
