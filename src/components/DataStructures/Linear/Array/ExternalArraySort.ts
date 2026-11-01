import { ArrayMergeOperations } from './ArrayMergeOperations.ts'
import type { ArrayEntry } from './FixedArray.ts'
import type { ArraySortFrame, ArraySortRun, ArraySortStorage } from './ArraySortTrace.ts'

class TapeRun {
  public readonly id: string
  public readonly entries: ArrayEntry[]
  public readonly dummy: boolean
  constructor(id: string, entries: ArrayEntry[], dummy = false) {
    this.id = id
    this.entries = entries
    this.dummy = dummy
  }
}

class SortTape {
  public runs: (TapeRun | null)[] = []
  public head = 0
  public readonly id: number
  constructor(id: number) { this.id = id }
  public get count(): number { return this.runs.length - this.head }
  public take(): TapeRun {
    const run = this.runs[this.head]!
    this.runs[this.head++] = null
    return run
  }
  public reset(): void {
    this.runs = []
    this.head = 0
  }
}

// Tape files and record I/O are simulated in memory; the source array stays
// intact until the final load. A record is one logical I/O unit in this lesson.
export class ExternalArraySort extends ArrayMergeOperations {
  private tapes: SortTape[] = []
  private ram: readonly ArrayEntry[] = []
  private serial = 0
  private reads = 0
  private writes = 0
  private inputIds: readonly number[] = []
  private outputIds: readonly number[] = []
  private merging: readonly ArraySortRun[] = []

  protected context(): ArraySortFrame {
    if (!this.observer) return {}
    const storage: ArraySortStorage[] = [{ id: 'ram', label: 'RAM', status: '3-record run buffer / merge heads', runs: [{ id: 'ram', label: 'working records', entries: [...this.ram], status: 'RAM' }] }]
    for (const tape of this.tapes) {
      const runs: ArraySortRun[] = []
      for (let index = tape.head; index < tape.runs.length; index += 1) {
        const run = tape.runs[index]!
        runs.push({ id: run.id, label: run.id, entries: [...run.entries], dummy: run.dummy, status: run.dummy ? 'DUMMY' : 'RUN' })
      }
      storage.push({ id: `tape-${tape.id}`, label: `T${tape.id}`, status: this.outputIds.includes(tape.id) ? 'OUTPUT' : this.inputIds.includes(tape.id) ? 'INPUT' : 'READY', runs })
    }
    if (this.merging.length) storage.push({ id: 'merge', label: 'Merge', status: 'sequential input cursors / output run', runs: this.merging })
    return { storage, counterHint: `Virtual tapes in RAM; no disk access. Logical record reads: ${this.reads}; writes: ${this.writes}. Counts include run generation and tape merges, excluding the final visualization load.` }
  }

  public externalMergeSort(): void {
    if (this.entries.length < 2) return
    for (let id = 0; id < 4; id += 1) this.tapes.push(new SortTape(id))
    this.inputIds = [0, 1]
    this.outputIds = [2, 3]
    this.formRuns((run, index) => this.tapes[index % 2].runs.push(run))
    let inputs = [this.tapes[0], this.tapes[1]]
    let outputs = [this.tapes[2], this.tapes[3]]
    while (inputs[0].count + inputs[1].count > 1) {
      let destination = 0
      while (inputs[0].count || inputs[1].count) {
        const left = inputs[0].count ? inputs[0].take() : null
        const right = inputs[1].count ? inputs[1].take() : null
        const merged = this.mergeRuns(left, right)
        outputs[destination++ % 2].runs.push(merged)
        this.merging = []
        this.trace('merge', 'Write a balanced output run', 'Adjacent input runs are stably merged and output runs alternate between the two destination tapes.', 'merge next pair; alternate output tape')
      }
      for (const tape of inputs) tape.reset()
      const previous = inputs
      inputs = outputs
      outputs = previous
      this.inputIds = [inputs[0].id, inputs[1].id]
      this.outputIds = [outputs[0].id, outputs[1].id]
      this.trace('pass', 'Exchange input and output tapes', 'A balanced pass halves the number of runs, rounding up. The two emptied tapes become the next destinations.', 'swap(input tapes, output tapes)')
    }
    this.load(inputs.find((tape) => tape.count)!.take())
  }

  public polyphaseMergeSort(): void {
    if (this.entries.length < 2) return
    for (let id = 0; id < 3; id += 1) this.tapes.push(new SortTape(id))
    const count = Math.ceil(this.entries.length / 3)
    let larger = 1
    let smaller = 0
    while (larger + smaller < count) {
      const next = larger + smaller
      smaller = larger
      larger = next
    }
    this.inputIds = [0, 1]
    this.outputIds = [2]
    this.formRuns((run, index) => this.tapes[index < larger ? 0 : 1].runs.push(run))
    while (this.tapes[0].count < larger) this.tapes[0].runs.push(new TapeRun(`dummy-${this.serial++}`, [], true))
    while (this.tapes[1].count < smaller) this.tapes[1].runs.push(new TapeRun(`dummy-${this.serial++}`, [], true))
    this.trace('run', 'Complete the Fibonacci distribution', `Use quotas ${larger} and ${smaller}; empty dummy runs fill unused positions. The third tape starts empty.`, 'distribute runs into consecutive Fibonacci quotas')
    let inputs = [this.tapes[0], this.tapes[1]]
    let output = this.tapes[2]
    while (inputs[0].count + inputs[1].count > 1) {
      const pairs = Math.min(inputs[0].count, inputs[1].count)
      this.trace('stage', 'Start a polyphase merge phase', `Merge ${pairs} pairs until one input tape is exhausted. The output tape starts empty; there is no redistribution pass.`, 'repeat min(input run counts) merges')
      for (let pair = 0; pair < pairs; pair += 1) {
        const run = this.mergeRuns(inputs[0].take(), inputs[1].take(), true)
        output.runs.push(run)
        this.merging = []
        this.trace('merge', run.dummy ? 'Preserve a dummy run' : 'Append a polyphase output run', 'A dummy plus a real run passes the real run through without record I/O; two real runs are merged. Simple tape-order ties make this variant unstable.', 'append merged run to output tape')
      }
      const emptied = inputs[0].count === 0 ? inputs[0] : inputs[1]
      const remaining = inputs[0].count === 0 ? inputs[1] : inputs[0]
      emptied.reset()
      inputs = [remaining, output]
      output = emptied
      this.inputIds = [inputs[0].id, inputs[1].id]
      this.outputIds = [output.id]
      this.trace('pass', 'Rotate the empty tape into output', 'The remaining input and previous output become the two inputs. The exhausted tape is the next empty destination.', 'rotate tape roles without redistributing runs')
    }
    this.load(inputs.find((tape) => tape.count)!.take())
  }

  private formRuns(store: (run: TapeRun, index: number) => void): void {
    let runIndex = 0
    for (let start = 0; start < this.entries.length; start += 3) {
      const chunk = this.entries.slice(start, start + 3)
      this.reads += chunk.length
      this.ram = chunk
      this.trace('buffer', 'Read a bounded RAM chunk', `Read up to three records starting at source slot ${start}. Tape storage is simulated separately from this logical RAM budget.`, 'read at most 3 records into RAM', {}, start)
      for (let index = 1; index < chunk.length; index += 1) {
        const entry = chunk[index]
        let position = index
        while (position > 0 && chunk[position - 1].value > entry.value) {
          chunk[position] = chunk[position - 1]
          position -= 1
        }
        chunk[position] = entry
      }
      this.writes += chunk.length
      store(new TapeRun(`run-${this.serial++}`, chunk), runIndex++)
      this.ram = []
      this.trace('run', 'Write an initial sorted run', 'Stable insertion sorting orders the bounded chunk before it is written as one tape run.', 'sort RAM chunk; write one run', {}, start)
    }
  }

  private mergeRuns(left: TapeRun | null, right: TapeRun | null, dummyTransfer = false): TapeRun {
    if (dummyTransfer && (left?.dummy || right?.dummy)) {
      const real = left!.dummy ? right! : left!
      return real.dummy ? new TapeRun(`dummy-${this.serial++}`, [], true) : real
    }
    const first = left?.entries ?? []
    const second = right?.entries ?? []
    const result = new TapeRun(`run-${this.serial++}`, [])
    let a = 0
    let b = 0
    while (a < first.length || b < second.length) {
      this.ram = [...(a < first.length ? [first[a]] : []), ...(b < second.length ? [second[b]] : [])]
      this.snapshotMerge(left, right, result, a, b)
      this.trace('compare', 'Compare sequential tape heads', 'Select the smaller available input head; the left tape wins a tie. Input cursors only move forward.', 'take left if left <= right')
      const entry = b === second.length || a < first.length && first[a].value <= second[b].value ? first[a++] : second[b++]
      result.entries.push(entry)
      this.reads += 1
      this.writes += 1
      this.ram = [...(a < first.length ? [first[a]] : []), ...(b < second.length ? [second[b]] : []), entry]
      this.snapshotMerge(left, right, result, a, b)
      this.trace('write', 'Write the selected record to the output tape', `Append key ${entry.value} to ${result.id}. Consumed input positions stay marked; at most two next heads and one output record occupy logical RAM.`, 'advance selected input; write output record')
    }
    this.ram = []
    return result
  }

  private snapshotMerge(left: TapeRun | null, right: TapeRun | null, output: TapeRun, first: number, second: number): void {
    if (!this.observer) return
    this.merging = [
      { id: left?.id ?? 'empty-left', label: 'left input', entries: [...(left?.entries ?? [])], cursor: first, status: 'INPUT' },
      { id: right?.id ?? 'empty-right', label: 'right input', entries: [...(right?.entries ?? [])], cursor: second, status: 'INPUT' },
      { id: output.id, label: 'output', entries: [...output.entries], status: 'OUTPUT' },
    ]
  }

  private load(run: TapeRun): void {
    this.merging = []
    for (let index = 0; index < run.entries.length; index += 1) this.entries[index] = run.entries[index]
    this.trace('gather', 'Load the final tape run', 'The single sorted real run replaces the visualization array. This final display load is excluded from the tape I/O counts.', 'array = final sorted tape run', { sortedPrefix: this.entries.length })
  }
}
