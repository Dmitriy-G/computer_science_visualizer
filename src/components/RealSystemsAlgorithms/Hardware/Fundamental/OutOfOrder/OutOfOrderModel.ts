import { CpuModel } from '../CpuModel.ts'
import { OutOfOrderLayout } from './OutOfOrderLayout.ts'
import type { CpuCell } from '../CpuModel.ts'

interface ReorderEntry {
  readonly id: string
  readonly text: string
  readonly destination: string | null
  readonly producer: string | null
  readonly input: number
  readonly addend: number
  readonly branch: boolean
  state: 'waiting' | 'complete' | 'retired' | 'squashed'
  result: number | null
}

export class OutOfOrderModel {
  public readonly architectural = new Map<string, number>([['r1', 0], ['r2', 4], ['r3', 0]])
  public readonly entries: ReorderEntry[] = [
    { id: 'I1', text: 'r1 = load [A]', destination: 'r1', producer: null, input: 10, addend: 0, branch: false, state: 'waiting', result: null },
    { id: 'I2', text: 'r2 = r2 + 3', destination: 'r2', producer: null, input: 4, addend: 3, branch: false, state: 'waiting', result: null },
    { id: 'I3', text: 'r3 = r1 + 1', destination: 'r3', producer: 'I1', input: 0, addend: 1, branch: false, state: 'waiting', result: null },
    { id: 'I4', text: 'if r3 > 0: jump', destination: null, producer: 'I3', input: 0, addend: 0, branch: true, state: 'waiting', result: null },
    { id: 'I5', text: 'r2 = 99 (wrong path)', destination: 'r2', producer: null, input: 99, addend: 0, branch: false, state: 'waiting', result: null },
  ]
  public nextPc = '0x114'
  public mispredicted = false
  private head = 0
  private flow = 'dispatch'
  private currentId = 'I1'
  private unit = 'not executing'

  public requestLoad(): void {
    this.flow = 'load-request'
    this.currentId = 'I1'
    this.unit = 'I1 waiting for data'
  }

  public execute(id: string): boolean {
    const index = this.entries.findIndex((entry) => entry.id === id)
    const entry = this.entries[index]
    if (!entry || entry.state !== 'waiting') throw new RangeError('Instruction cannot execute')
    let input = entry.input
    if (entry.producer) {
      const producer = this.entries.find((candidate) => candidate.id === entry.producer)!
      if (producer.state !== 'complete' && producer.state !== 'retired') {
        this.flow = 'wait'
        this.currentId = id
        this.unit = `wait for ${entry.producer}`
        return false
      }
      input = producer.result!
    }
    entry.result = entry.branch ? Number(input > 0) : input + entry.addend
    entry.state = 'complete'
    this.flow = id === 'I1' ? 'load-response' : 'execute'
    this.currentId = id
    this.unit = `${id}: ${entry.result}`
    if (entry.branch && entry.result === 1) {
      this.flow = 'redirect'
      this.mispredicted = true
      this.nextPc = '0x200'
      for (let younger = index + 1; younger < this.entries.length; younger += 1) this.entries[younger].state = 'squashed'
    }
    return true
  }

  public retireNext(): string | null {
    const entry = this.entries[this.head]
    if (!entry || entry.state !== 'complete') {
      this.flow = 'retire-wait'
      this.currentId = entry?.id ?? this.currentId
      return null
    }
    if (entry.destination) this.architectural.set(entry.destination, entry.result!)
    entry.state = 'retired'
    this.head += 1
    this.flow = 'retire'
    this.currentId = entry.id
    return entry.id
  }

  public snapshot(focus: string | null = null): CpuModel {
    const program: CpuCell[] = []
    const reorder: CpuCell[] = []
    for (let index = 0; index < this.entries.length; index += 1) {
      const entry = this.entries[index]
      program.push({ id: `program-${entry.id}`, label: entry.id, value: entry.text })
      reorder.push({ id: entry.id, label: `${entry.id}${index === this.head && entry.state !== 'squashed' ? ' head' : ''}`,
        value: entry.result === null ? `wait ${entry.producer ?? 'unit'}` : entry.branch ? `taken=${entry.result}` : `result ${entry.result}`,
        tone: entry.id === focus ? 'active' : entry.state !== 'waiting' ? 'visited' : 'default',
        status: entry.state.toUpperCase(),
      })
    }
    const committed: CpuCell[] = []
    for (const [name, value] of this.architectural) committed.push({ id: `arch-${name}`, label: name, value: String(value) })
    const registers: string[] = []
    for (const [name, value] of this.architectural) registers.push(`${name}:${value}`)
    const diagram = OutOfOrderLayout.create(this.flow, this.currentId, this.unit, registers.join(' '), this.entries[this.head]?.id ?? 'empty', this.entries[0].state === 'waiting')
    return new CpuModel([
      { name: 'Program', cells: program }, { name: 'ROB', cells: reorder }, { name: 'Committed', cells: committed },
      { name: 'Fetch', cells: [{ id: 'pc', label: 'next PC register', value: this.nextPc, status: this.mispredicted ? 'redirected' : 'predict not taken' }, { id: 'prediction', label: 'I4', value: this.mispredicted ? 'redirected' : 'predict not taken' }] },
    ], focus, 0, diagram)
  }
}
