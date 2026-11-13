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
  readonly physicalDestination: number | null
  readonly physicalSource: number | null
  readonly previousPhysical: number | null
  state: 'waiting' | 'complete' | 'retired' | 'squashed'
  // Retain the outcome for narration after retirement or squash; operands read the PRF.
  result: number | null
}

export class OutOfOrderModel {
  public readonly committedMap = new Map<string, number>([['r1', 0], ['r2', 1], ['r3', 2]])
  public readonly renameMap = new Map<string, number>([['r1', 3], ['r2', 6], ['r3', 5]])
  public readonly physical: (number | null)[] = [0, 4, 0, null, null, null, null]
  private readonly allocated = new Set<number>([0, 1, 2, 3, 4, 5, 6])
  public readonly entries: ReorderEntry[] = [
    { id: 'I1', text: 'r1 = load [A]', destination: 'r1', producer: null, input: 10, addend: 0, branch: false, physicalDestination: 3, physicalSource: null, previousPhysical: 0, state: 'waiting', result: null },
    { id: 'I2', text: 'r2 = r2 + 3', destination: 'r2', producer: null, input: 4, addend: 3, branch: false, physicalDestination: 4, physicalSource: 1, previousPhysical: 1, state: 'waiting', result: null },
    { id: 'I3', text: 'r3 = r1 + 1', destination: 'r3', producer: 'I1', input: 0, addend: 1, branch: false, physicalDestination: 5, physicalSource: 3, previousPhysical: 2, state: 'waiting', result: null },
    { id: 'I4', text: 'if r3 > 0: jump', destination: null, producer: 'I3', input: 0, addend: 0, branch: true, physicalDestination: null, physicalSource: 5, previousPhysical: null, state: 'waiting', result: null },
    { id: 'I5', text: 'r2 = 99 (wrong path)', destination: 'r2', producer: null, input: 99, addend: 0, branch: false, physicalDestination: 6, physicalSource: null, previousPhysical: 4, state: 'waiting', result: null },
  ]
  public nextPc = '0x114'
  public mispredicted = false
  private head = 0
  private flow = 'dispatch'
  private currentId = 'I1'
  private unit = 'not executing'

  public get architectural(): ReadonlyMap<string, number> {
    const values = new Map<string, number>()
    for (const [name, physical] of this.committedMap) values.set(name, this.physical[physical]!)
    return values
  }

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
    if (entry.physicalSource !== null) {
      const value = this.physical[entry.physicalSource]
      if (value === null) {
        this.flow = 'wait'
        this.currentId = id
        this.unit = `wait for ${entry.producer}`
        return false
      }
      input = value
    }
    entry.result = entry.branch ? Number(input > 0) : input + entry.addend
    if (entry.physicalDestination !== null) this.physical[entry.physicalDestination] = entry.result
    entry.state = 'complete'
    this.flow = id === 'I1' ? 'load-response' : 'execute'
    this.currentId = id
    this.unit = `${id}: ${entry.result}`
    if (entry.branch && entry.result === 1) {
      this.flow = 'redirect'
      this.mispredicted = true
      this.nextPc = '0x200'
      for (let younger = index + 1; younger < this.entries.length; younger += 1) {
        const discarded = this.entries[younger]
        discarded.state = 'squashed'
        if (discarded.physicalDestination !== null) {
          this.allocated.delete(discarded.physicalDestination)
          this.physical[discarded.physicalDestination] = null
        }
      }
      this.renameMap.clear()
      for (const [name, physical] of this.committedMap) this.renameMap.set(name, physical)
      for (const surviving of this.entries) {
        if (surviving.state !== 'squashed' && surviving.state !== 'retired' && surviving.destination && surviving.physicalDestination !== null) this.renameMap.set(surviving.destination, surviving.physicalDestination)
      }
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
    if (entry.destination && entry.physicalDestination !== null) {
      this.committedMap.set(entry.destination, entry.physicalDestination)
      this.allocated.delete(entry.previousPhysical!)
      this.physical[entry.previousPhysical!] = null
    }
    entry.state = 'retired'
    this.head += 1
    while (this.entries[this.head]?.state === 'squashed') this.head += 1
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
        value: entry.branch ? entry.result === null ? 'branch pending' : `taken=${entry.result}` : `p${entry.physicalDestination} / ${entry.state === 'squashed' ? 'discarded' : entry.result === null ? 'pending' : 'complete'}`,
        tone: entry.id === focus ? 'active' : entry.state !== 'waiting' ? 'visited' : 'default',
        status: entry.state.toUpperCase(),
      })
    }
    const committed: CpuCell[] = []
    for (const [name, value] of this.architectural) committed.push({ id: `arch-${name}`, label: name, value: String(value) })
    const registers: string[] = []
    for (const [name, physical] of this.committedMap) registers.push(`${name}:p${physical}=${this.physical[physical]}`)
    const mappings: string[] = []
    for (const [name, physical] of this.renameMap) mappings.push(`${name}:p${physical}`)
    const physical: CpuCell[] = []
    for (let index = 0; index < this.physical.length; index += 1) physical.push({
      id: `physical-${index}`, label: `p${index}`, value: !this.allocated.has(index) ? 'free' : this.physical[index] === null ? 'not ready' : String(this.physical[index]),
    })
    const current = this.entries.find((entry) => entry.id === this.currentId)!
    const producer = this.entries.find((entry) => entry.id === current.producer)
    const diagram = OutOfOrderLayout.create({
      flow: this.flow, id: this.currentId, instruction: current.text,
      unit: this.unit, registers: registers.join(' '), head: this.entries[this.head]?.id ?? 'empty',
      loadPending: this.entries[0].state === 'waiting', producer: current.producer,
      operand: producer?.result ?? current.input, addend: current.addend, result: current.result, branch: current.branch,
      mapping: mappings.join(' '), destination: current.destination,
      physicalDestination: current.physicalDestination, physicalSource: current.physicalSource, previousPhysical: current.previousPhysical,
    })
    return new CpuModel([
      { name: 'Program', cells: program }, { name: 'ROB', cells: reorder }, { name: 'Physical', cells: physical }, { name: 'Committed', cells: committed },
      { name: 'Fetch', cells: [{ id: 'pc', label: 'next PC register', value: this.nextPc, status: this.mispredicted ? 'redirected' : 'predict not taken' }, { id: 'prediction', label: 'I4', value: this.mispredicted ? 'redirected' : 'predict not taken' }] },
    ], focus, 0, diagram)
  }
}
