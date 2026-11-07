import type { ActionDefinition, ActionPlan } from '../../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../../visualization/AlgorithmInformation.ts'
import { DiskWorkload } from '../DiskWorkload.ts'
import { DiskTrace } from '../DiskTrace.ts'
import { DiskAlgorithmInformation } from '../DiskAlgorithmInformation.ts'

interface BudgetQueue {
  readonly process: number
  readonly weight: number
  start: number
  finish: number
  budget: number
  used: number
  served: number
}

export class BFQAnimation implements ActionDefinition<DiskWorkload> {
  public readonly title = 'BFQ'
  public readonly context = 'Disk I/O scheduling'
  public readonly summary = 'Weighted process queues with sector budgets and virtual finish tags.'
  public readonly phases = ['Queue', 'Dispatch', 'Complete']
  public readonly timelineHint = 'Budget-based weighted service'
  public static readonly budget = 4

  public static describe(): AlgorithmInformation {
    return DiskAlgorithmInformation.create('BFQ (Budget Fair Queueing)',
      'A flat B-WF2Q+ budget lesson: choose an eligible process queue by its smallest virtual finish tag, charge sectors to its budget, and requeue on expiry. Weights are P1=1, P2=2, P3=1. All requests arrive at tick 0; each process uses FIFO. Fixed four-sector budgets and linear queue scans replace Linux auto-tuning and augmented trees. Hierarchies, idling, queue merging, and latency heuristics are omitted.',
      'https://docs.kernel.org/block/bfq-iosched.html',
      'Linux BFQ shares device service among weighted queues using sector budgets and B-WF2Q+ scheduling. The lesson isolates that budget-selection core.')
  }

  public create(source: DiskWorkload): ActionPlan<DiskWorkload> {
    const model = new DiskWorkload(source.requests)
    const trace = new DiskTrace()
    const queues: BudgetQueue[] = []
    for (const process of DiskWorkload.processes) {
      if (model.pending(undefined, process.id).length) queues.push({
        process: process.id, weight: process.weight, start: 0,
        finish: BFQAnimation.budget / process.weight, budget: BFQAnimation.budget,
        used: 0, served: 0,
      })
    }
    let virtualTime = 0
    trace.record(model, 'Activate process queues', 'Each nonempty process queue receives a sector budget and weighted virtual finish tag.',
      'S = 0; F = S + budget / weight', 'P1 weight 1 · P2 weight 2 · P3 weight 1 · Each budget is 4 sectors.')
    while (model.completed.length < model.requests.length) {
      const active: BudgetQueue[] = []
      let minimumStart = Infinity
      let totalWeight = 0
      for (const queue of queues) {
        if (!model.pending(undefined, queue.process).length) continue
        active.push(queue)
        totalWeight += queue.weight
        minimumStart = Math.min(minimumStart, queue.start)
      }
      virtualTime = Math.max(virtualTime, minimumStart)
      let selected: BudgetQueue | undefined
      for (const queue of active) {
        if (queue.start <= virtualTime + 1e-9 && (!selected || queue.finish < selected.finish)) selected = queue
      }
      if (!selected) throw new Error('A nonempty workload must have an eligible budget queue')
      const queue = selected
      trace.record(model, `Select process P${queue.process}`, `P${queue.process} has the earliest eligible finish tag ${queue.finish.toFixed(2)}.`,
        'eligible = queues where S <= V\nselected = eligible.min_by(F)',
        this.details(queues, virtualTime))
      while (true) {
        const request = model.pending(undefined, queue.process)[0]
        if (!request || queue.used + request.sectors > queue.budget) break
        queue.used += request.sectors
        queue.served += request.sectors
        model.dispatch(request)
        trace.record(model, `Dispatch ${request.id}`, `P${queue.process} spends ${request.sectors} sectors of its budget on ${request.id}.`,
          'dispatch(queue.front); budget_used += request.sectors', this.details(queues, virtualTime), request.id)
        model.time += request.serviceTicks
        model.complete(request)
        virtualTime += request.sectors / totalWeight
        trace.record(model, `Complete ${request.id}`, `${request.id} completes; virtual service time advances by sectors / active weight.`,
          'V += request.sectors / active_weight; complete(request)', this.details(queues, virtualTime), request.id)
      }
      // Charge actual service when the queue empties or its next request will not fit.
      queue.finish = queue.start + queue.used / queue.weight
      queue.start = Math.max(queue.finish, virtualTime)
      queue.used = 0
      queue.finish = queue.start + queue.budget / queue.weight
      if (model.pending(undefined, queue.process).length) {
        trace.record(model, `Renew P${queue.process} budget`, 'The next request did not fit the remaining budget. Charge actual service, renew the budget, and requeue the process.',
          'F = S + served / weight\nS = max(F, V); F = S + budget / weight', this.details(queues, virtualTime))
      }
    }
    trace.finish(model)
    return { steps: trace.steps, result: model }
  }

  private details(queues: readonly BudgetQueue[], virtualTime: number): string {
    const parts = [`Virtual service time V=${virtualTime.toFixed(2)}`]
    for (const queue of queues) {
      parts.push(`P${queue.process}: weight ${queue.weight}, budget ${queue.budget - queue.used}/${queue.budget}, S=${queue.start.toFixed(2)}, F=${queue.finish.toFixed(2)}, served ${queue.served} sectors`)
    }
    return parts.join(' · ')
  }
}
