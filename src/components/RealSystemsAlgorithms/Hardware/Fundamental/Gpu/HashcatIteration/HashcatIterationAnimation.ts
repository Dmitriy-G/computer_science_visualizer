import type { ActionDefinition, ActionPlan } from '../../../../../../visualization/ActionDefinition.ts'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { ComponentInformation } from '../../ComponentLesson.ts'
import { GpuLessonLayout } from '../GpuLessonLayout.ts'
import { HashcatIterationModel } from './HashcatIterationModel.ts'
import { HashcatIterationOverview } from './HashcatIterationOverview.ts'

export class HashcatIterationAnimation implements ActionDefinition<HardwareSnapshot> {
  public readonly title = 'Hashcat: one candidate iteration'
  public static describe() { return ComponentInformation.describe(HashcatIterationOverview.describe()) }

  public create(_source: HardwareSnapshot): ActionPlan<HardwareSnapshot> {
    const model = new HashcatIterationModel()
    const trace = GpuLessonLayout.trace('abc / SHA-256 target', 'No candidate yet')
    trace.start('Follow one fixed candidate, abc, against a known unsalted SHA-256 digest. One iteration means one complete candidate evaluation, including all 64 SHA-256 rounds for its one padded block. This is a conceptual Hashcat work item, not a running Hashcat process.')
    trace.transfer('gpu-host-link', 'gpu-host-interface', 'abc / target', 'Upload inputs', 'The host transfers candidate bytes and the known target digest over PCIe.')
    trace.transfer('gpu-host-memory', 'gpu-memory-controllers', 'abc / target', 'Stage device input', 'The host transfer reaches the GPU memory system; copy engines are abstracted.')
    trace.write({ id: 'inputs', label: 'abc / target ready', data: model.inputData() })
    trace.transfer('gpu-host-link', 'gpu-host-interface', 'SHA-256 dispatch', 'Submit compute command', 'After the upload completes, the host submits its compute dispatch through PCIe.')
    trace.transfer('gpu-command-input', 'gpu-scheduler', 'SHA-256 dispatch', 'Queue compute kernel', 'Submit one logical compute dispatch after the input upload completes.')
    trace.transfer('gpu-schedule-compute', 'gpu-compute-cores', 'One work item', 'Schedule candidate', 'General-purpose integer shader cores perform the hash. Graphics, texture, ray tracing, AI, and display units remain idle.')
    trace.transfer('gpu-compute-cache', 'gpu-cache', 'Read abc / target', 'Load candidate data', 'The work item requests candidate and target data through the memory hierarchy.')
    trace.transfer('gpu-cache-memory', 'gpu-memory-controllers', 'Read input buffers', 'Fetch inputs', 'Follow a representative memory fetch; this does not predict cache behavior.')
    const inputs = trace.read('inputs')
    trace.transfer('gpu-cache-memory', 'gpu-cache', 'abc / target', 'Fill input cache', 'The input data reaches the shared cache.', true)
    trace.transfer('gpu-compute-cache', 'gpu-compute-cores', 'abc / target', 'Receive work item', 'The compute cores receive the three candidate bytes and known target digest.', true)
    const candidateLength = new TextEncoder().encode(model.candidate).length
    model.hash(inputs.data.slice(0, candidateLength))
    trace.local('gpu-compute-cores', `${model.digest!.slice(0, 12)}…`, 'Compute complete SHA-256', `Integer operations compute the full digest ${model.digest}. All rounds are grouped into this local computation; this is not one compression round.`)
    let target = ''
    for (const byte of inputs.data.slice(candidateLength)) target += byte.toString(16).padStart(2, '0')
    model.compare(target)
    trace.local('gpu-compute-cores', model.match ? 'MATCH / abc' : 'NO MATCH', 'Compare full digest', 'Compare all 256 digest bits with the target. The display abbreviation is not used for equality.')
    trace.transfer('gpu-compute-cache', 'gpu-cache', '1 match / abc', 'Publish match record', 'The work item writes a result record and match flag through the memory system.')
    trace.transfer('gpu-cache-memory', 'gpu-memory-controllers', '1 match / abc', 'Write result', 'The result is routed to the device result buffer.')
    trace.write({ id: 'result', label: 'Result: abc matches', data: new Uint8Array([model.match ? 1 : 0, ...new TextEncoder().encode(model.candidate)]) })
    trace.local('gpu-scheduler', 'Kernel complete', 'Finish dispatch', 'Kernel completion makes the result eligible for host readback; execution timing and synchronization APIs are abstracted.')
    const result = trace.read('result')
    trace.transfer('gpu-host-memory', 'gpu-host-interface', 'Result: abc matches', 'Return result to host', 'The result travels through the GPU host interface after completion.', true)
    model.report(result.data[0])
    trace.transfer('gpu-host-link', 'gpu-connector', 'abc / match reported', 'Deliver match report', 'The host receives the result for the fixed example. This does not execute password recovery or launch external software.', true)
    trace.finish('One candidate evaluated', `${model.evaluated} candidate evaluated and compared; full SHA-256 digest ${model.digest}. GPU acceleration comes from many independent work items in real batches, not this single-item illustration.`)
    return { steps: trace.steps, result: trace.result.clone() }
  }
}
