import { CpuLesson, CpuLessonInformation } from '../CpuLesson.ts'
import type { CpuTrace } from '../CpuTrace.ts'
import { ReturnStackModel } from './ReturnStackModel.ts'

export class ReturnStackAnimation extends CpuLesson {
  public readonly title = 'Return-address stack prediction'

  public static describe() {
    return CpuLessonInformation.create('Return-address stack prediction',
      'Predict nested procedure returns by pushing return addresses on recognized calls and popping them on recognized returns.',
      'Arm Cortex-A53', 'https://documentation-service.arm.com/static/5e9075f9c8052b1608761519',
      'The Cortex-A53 TRM documents an eight-entry hardware return stack in its instruction-fetch unit.',
      'Overflow discards the oldest entry in this teaching model; underflow reports no prediction. These policies are not claims about undocumented A53 boundary behavior. Correct architectural return targets are represented separately.')
  }

  protected build(trace: CpuTrace): void {
    const model = new ReturnStackModel()
    trace.record(model.snapshot(), 'Empty return predictor', 'A predicted return target is a hint for instruction fetch. The actual program return address determines correctness.', 'return_predictor = []\nactual_call_depth = 0', 0)
    for (let depth = 0; depth < 3; depth += 1) {
      model.call(0x104 + depth * 0x100)
      trace.record(model.snapshot(), 'Recognized call', 'Push the address after the call. Nested calls place their return addresses above earlier ones.', 'actual_returns.push(return_address)\nreturn_predictor.push(return_address)')
    }
    for (let depth = 0; depth < 3; depth += 1) {
      model.returnFromCall()
      trace.record(model.snapshot(), 'Predict nested return', 'Pop the most recent prediction and compare it with the actual return target. The last call returns first.', 'predicted = return_predictor.pop()\nactual = actual_returns.pop(); compare(predicted, actual)')
    }
    for (let depth = 0; depth < 9; depth += 1) {
      model.call(0x1004 + depth * 0x100)
      trace.record(model.snapshot(), depth === 8 ? 'Finite predictor capacity' : 'Deeper call nesting',
        depth === 8 ? 'Nine outstanding calls exceed eight prediction slots. This teaching model discards the oldest prediction; actual return information remains valid.' : 'Record another call’s return address while retaining the architectural return target separately.',
        'if predictor.size == 8: discard_oldest()  // teaching policy\npush(return_address)')
    }
    for (let depth = 0; depth < 9; depth += 1) {
      const matched = model.returnFromCall()
      trace.record(model.snapshot(), matched ? 'Return target matched' : 'Predictor empty',
        matched ? 'The newest outstanding call has a matching prediction.' : 'No prediction remains for the oldest call. Its actual return target is still correct; a real core recovers fetch using resolved control flow.',
        'predicted = pop_or_unavailable()\nactual = actual_returns.pop(); resolve_return(actual)')
    }
    trace.record(model.snapshot(), 'Prediction is not correctness', `${model.matched} of ${model.returns} returns had matching predictions. All actual calls returned correctly, including the one without a prediction.`, 'actual_call_depth = 0\nreturn_predictor.size = 0', 2)
  }
}
