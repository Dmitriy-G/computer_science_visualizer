import type { ActionDefinition, ActionPlan } from '../../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../../visualization/AlgorithmInformation.ts'
import { DiskWorkload } from '../DiskWorkload.ts'
import type { DiskDirection, DiskRequest } from '../DiskWorkload.ts'
import { DiskTrace } from '../DiskTrace.ts'
import { DiskAlgorithmInformation } from '../DiskAlgorithmInformation.ts'

export class MqDeadlineAnimation implements ActionDefinition<DiskWorkload> {
  public readonly title = 'mq-deadline'
  public readonly context = 'Disk I/O scheduling'
  public readonly summary = 'Sector batches with FIFO expiry and bounded write starvation.'
  public readonly phases = ['Queue', 'Dispatch', 'Complete']
  public readonly timelineHint = 'Read/write batching and soft expiry'
  public static readonly batchSize = 2
  public static readonly readExpiry = 4
  public static readonly writeExpiry = 8
  public static readonly writesStarved = 2

  public static describe(): AlgorithmInformation {
    return DiskAlgorithmInformation.create('mq-deadline',
      'Dispatch sector-ordered read/write batches, checking FIFO expiry between batches and serving writes after two preferred read batches. This lesson scales batch size to 2 and expiry to 4/8 ticks. All requests arrive at tick 0 in one priority class. It omits merging, zoned devices, priority aging, and parallel hardware queues; expiry is not a completion guarantee.',
      'https://github.com/torvalds/linux/blob/v6.12/block/mq-deadline.c',
      'The Linux block layer implements mq-deadline using sector ordering, FIFO expiry, and read/write batch decisions.')
  }

  private successor(requests: readonly DiskRequest[], position: number): DiskRequest | undefined {
    let next: DiskRequest | undefined
    for (const request of requests) {
      if (request.sector >= position && (!next || request.sector < next.sector)) next = request
    }
    return next
  }

  public create(source: DiskWorkload): ActionPlan<DiskWorkload> {
    const model = new DiskWorkload(source.requests)
    const trace = new DiskTrace()
    const position: Record<DiskDirection, number> = { read: 0, write: 0 }
    let direction: DiskDirection = 'read'
    let batching = 0
    let starved = 0
    trace.record(model, 'Queue disk requests', 'All requests enter the scheduler at virtual tick 0.',
      'enqueue_by_sector_and_arrival(requests)', 'Batch size 2; read expiry 4 ticks; write expiry 8 ticks. Expiry is checked between batches.')
    while (model.completed.length < model.requests.length) {
      let next = this.successor(model.pending(direction), position[direction])
      let reason = `Continue the ${direction} batch in increasing LBA order`
      if (!next || batching >= MqDeadlineAnimation.batchSize) {
        const reads = model.pending('read')
        const writes = model.pending('write')
        if (reads.length && !(writes.length && starved++ >= MqDeadlineAnimation.writesStarved)) {
          direction = 'read'
        } else {
          direction = 'write'
          starved = 0
        }
        const pending = direction === 'read' ? reads : writes
        const oldest = pending[0]
        const expiry = direction === 'read' ? MqDeadlineAnimation.readExpiry : MqDeadlineAnimation.writeExpiry
        next = this.successor(pending, position[direction])
        const expired = model.time >= expiry
        if (expired || !next) next = oldest
        reason = expired ? `The oldest ${direction} request has reached its soft expiry` : !this.successor(pending, position[direction]) ? `Restart the ${direction} sweep from the oldest request` : `Start a ${direction} batch in increasing LBA order`
        batching = 0
      }
      if (!next) throw new Error('A nonempty workload must have a dispatch candidate')
      batching += 1
      position[direction] = next.sector
      model.dispatch(next)
      trace.record(model, `Dispatch ${next.id}`, `${reason}: ${next.id}, LBA ${next.sector}.`,
        'if batch_continues: next_sector()\nelse: choose_read_or_write(); check_fifo_expiry()',
        `${direction.toUpperCase()} batch ${batching}/2 · read preferences since write service: ${starved}.`, next.id)
      model.time += next.serviceTicks
      model.complete(next)
      trace.record(model, `Complete ${next.id}`, `${next.id} completes at virtual tick ${model.time}.`,
        `complete(${next.id}); virtual_time += ${next.serviceTicks}`, 'One simulated device slot. Waiting expiry does not interrupt an active batch.', next.id)
    }
    trace.finish(model)
    return { steps: trace.steps, result: model }
  }
}
