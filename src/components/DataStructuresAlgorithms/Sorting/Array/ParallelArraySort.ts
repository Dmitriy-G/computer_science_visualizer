import { ArrayMergeOperations } from './ArrayMergeOperations.ts'
import type { ArraySortFrame, ArraySortTask } from './ArraySortTrace.ts'

class SortTask {
  public readonly id: string
  public readonly start: number
  public readonly end: number
  public readonly parent: SortTask | null
  public readonly kind: string
  public status: ArraySortTask['status'] = 'WAIT'
  public worker?: number
  public remaining = 0

  constructor(id: string, start: number, end: number, parent: SortTask | null, kind: string) {
    this.id = id
    this.start = start
    this.end = end
    this.parent = parent
    this.kind = kind
  }
}

export class ParallelArraySort extends ArrayMergeOperations {
  private readonly tasks: SortTask[] = []
  private readonly ready: SortTask[] = []
  private nextReady = 0
  private mode: 'merge' | 'quick' = 'merge'

  protected context(): ArraySortFrame {
    if (!this.observer) return {}
    const tasks: ArraySortTask[] = []
    for (const task of this.tasks) tasks.push({ id: task.id, parent: task.parent?.id ?? null, start: task.start, end: task.end, kind: task.kind, status: task.status, worker: task.worker })
    return { tasks }
  }

  public mergeSort(): void {
    if (this.entries.length < 2) return
    this.mode = 'merge'
    this.forkMerge(0, this.entries.length, null)
    this.trace('split', 'Fork independent half-sort tasks', 'Create the fork/join dependency tree. Singleton tasks are ready; each merge waits for both child ranges. The two worker lanes are simulated.', 'fork left; fork right; join; merge')
    this.schedule()
  }

  public quickSort(): void {
    if (this.entries.length < 2) return
    this.mode = 'quick'
    const root = this.createTask(0, this.entries.length, null, 'SORT')
    this.enqueue(root)
    this.schedule()
  }

  private createTask(start: number, end: number, parent: SortTask | null, kind: string): SortTask {
    const task = new SortTask(String(this.tasks.length), start, end, parent, kind)
    this.tasks.push(task)
    if (parent) parent.remaining += 1
    return task
  }

  private enqueue(task: SortTask): void {
    task.status = 'READY'
    this.ready.push(task)
  }

  private forkMerge(start: number, end: number, parent: SortTask | null): void {
    const task = this.createTask(start, end, parent, end - start < 2 ? 'LEAF' : 'MERGE')
    if (end - start < 2) this.enqueue(task)
    else {
      const middle = start + Math.floor((end - start) / 2)
      this.forkMerge(start, middle, task)
      this.forkMerge(middle, end, task)
    }
  }

  private schedule(): void {
    while (this.nextReady < this.ready.length) {
      const batch: SortTask[] = []
      for (let worker = 0; worker < 2 && this.nextReady < this.ready.length; worker += 1) {
        const task = this.ready[this.nextReady++]
        task.worker = worker
        task.status = 'RUN'
        batch.push(task)
      }
      this.trace('stage', 'Dispatch ready tasks to virtual workers', `Start ${batch.length} independent ready task${batch.length === 1 ? '' : 's'} on the two logical worker lanes. Their operations are recorded in deterministic order.`, 'dispatch up to two ready tasks')
      for (const task of batch) {
        if (this.mode === 'merge') {
          if (task.kind === 'MERGE') this.mergeRange(task.start, task.start + Math.floor((task.end - task.start) / 2), task.end)
          this.complete(task)
        } else if (task.end - task.start < 2) this.complete(task)
        else this.partition(task)
        this.trace('pass', task.status === 'WAIT' ? 'Wait for partition tasks' : 'Complete a task and release dependencies', `Task ${task.id} is ${task.status === 'WAIT' ? 'waiting for its child ranges' : 'complete'}. A parent joins only when every child has finished.`, 'release dependent tasks after completion', {}, task.start)
      }
    }
  }

  private complete(task: SortTask): void {
    task.status = 'DONE'
    let parent = task.parent
    while (parent) {
      parent.remaining -= 1
      if (parent.remaining !== 0) return
      if (this.mode === 'merge') {
        this.enqueue(parent)
        return
      }
      parent.status = 'DONE'
      parent = parent.parent
    }
  }

  private partition(task: SortTask): void {
    const pivotIndex = task.start + Math.floor((task.end - task.start) / 2)
    const pivot = this.entries[pivotIndex].value
    this.trace('pivot', 'Choose a task-local pivot', `Use middle-slot key ${pivot} to partition task ${task.id} into less-than, equal, and greater-than regions.`, `pivot = array[${pivotIndex}]`, { roles: { [pivotIndex]: 'PIVOT' } }, pivotIndex)
    let lower = task.start
    let current = task.start
    let upper = task.end
    while (current < upper) {
      const value = this.entries[current].value
      this.trace('compare', 'Compare with the task pivot', `Compare key ${value} at slot ${current} with pivot value ${pivot}.`, `compare(array[${current}], ${pivot})`, { activeIndices: [current], roles: { [current]: 'COMPARE' } }, current)
      if (value < pivot) this.taskSwap(lower++, current++)
      else if (value > pivot) this.taskSwap(current, --upper)
      else current += 1
    }
    task.status = 'WAIT'
    if (lower > task.start) this.enqueue(this.createTask(task.start, lower, task, 'SORT'))
    if (upper < task.end) this.enqueue(this.createTask(upper, task.end, task, 'SORT'))
    this.trace('partition', 'Fork disjoint partition tasks', `The equal-key region [${lower}, ${upper}) is final. Independent left and right tasks can run after this partition; equal keys need no child task.`, 'fork less; fork greater; join', { roles: { [lower]: 'EQUAL START', [upper - 1]: 'EQUAL END' } }, lower, upper - 1)
    if (task.remaining === 0) this.complete(task)
  }

  private taskSwap(first: number, second: number): void {
    if (first === second) return
    const entry = this.entries[first]
    this.entries[first] = this.entries[second]
    this.entries[second] = entry
    this.trace('swap', 'Exchange entries inside one task', `Swap slots ${first} and ${second} inside the current partition.`, `swap(array[${first}], array[${second}])`, { activeIndices: [first, second], roles: { [first]: 'SWAP', [second]: 'SWAP' } }, first, second)
  }
}
