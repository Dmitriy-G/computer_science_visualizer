import { CpuModel } from '../CpuModel.ts'
import { RegisterRenamingLayout } from './RegisterRenamingLayout.ts'
import type { CpuBank, CpuCell } from '../CpuModel.ts'

interface RenameInstruction {
  readonly id: string
  readonly destination: string
  readonly sources: readonly string[]
  readonly immediate: number
  readonly text: string
}

interface RenamedInstruction {
  readonly instruction: RenameInstruction
  readonly sources: readonly number[]
  readonly destination: number
  readonly previous: number
  done: boolean
  retired: boolean
}

export class RegisterRenameModel {
  public static readonly program: readonly RenameInstruction[] = [
    { id: 'I1', destination: 'r1', sources: [], immediate: 7, text: 'r1 = 7' },
    { id: 'I2', destination: 'r2', sources: ['r1'], immediate: 1, text: 'r2 = r1 + 1' },
    { id: 'I3', destination: 'r1', sources: [], immediate: 20, text: 'r1 = 20' },
    { id: 'I4', destination: 'r3', sources: ['r1', 'r2'], immediate: 0, text: 'r3 = r1 + r2' },
  ]
  public readonly renameMap = new Map<string, number>([['r1', 0], ['r2', 1], ['r3', 2]])
  public readonly architectural = new Map<string, number>([['r1', 3], ['r2', 4], ['r3', 0]])
  public readonly physical: (number | null)[] = [3, 4, 0, null, null, null, null]
  private readonly allocated = new Set<number>([0, 1, 2])
  private readonly instructions: RenamedInstruction[] = []
  private retired = 0
  private phase = 'initial'
  private currentId = 'I1'

  public renameNext(): string {
    const instruction = RegisterRenameModel.program[this.instructions.length]
    if (!instruction) throw new RangeError('All instructions are renamed')
    const sources: number[] = []
    for (const source of instruction.sources) sources.push(this.renameMap.get(source)!)
    let destination = 0
    while (this.allocated.has(destination)) destination += 1
    if (destination >= this.physical.length) throw new RangeError('Physical register file is full')
    const previous = this.renameMap.get(instruction.destination)!
    this.allocated.add(destination)
    this.physical[destination] = null
    this.renameMap.set(instruction.destination, destination)
    this.instructions.push({ instruction, sources, destination, previous, done: false, retired: false })
    this.phase = 'rename'
    this.currentId = instruction.id
    return instruction.id
  }

  public execute(id: string): void {
    const entry = this.instructions.find((candidate) => candidate.instruction.id === id)
    if (!entry || entry.done) throw new RangeError('Instruction is unavailable')
    let value = entry.instruction.immediate
    for (const source of entry.sources) {
      const operand = this.physical[source]
      if (operand === null) throw new RangeError('True dependency is not ready')
      value += operand
    }
    this.physical[entry.destination] = value
    entry.done = true
    this.phase = 'execute'
    this.currentId = id
  }

  public retireNext(): string {
    const entry = this.instructions[this.retired]
    if (!entry?.done) throw new RangeError('Oldest instruction is not complete')
    this.architectural.set(entry.instruction.destination, this.physical[entry.destination]!)
    this.allocated.delete(entry.previous)
    this.physical[entry.previous] = null
    entry.retired = true
    this.retired += 1
    this.phase = 'retire'
    this.currentId = entry.instruction.id
    return entry.instruction.id
  }

  public snapshot(focus: string | null = null): CpuModel {
    const instructions: CpuCell[] = []
    for (const instruction of RegisterRenameModel.program) {
      const entry = this.instructions.find((candidate) => candidate.instruction.id === instruction.id)
      let value = instruction.text
      if (entry) {
        const operands: string[] = []
        for (const source of entry.sources) operands.push(`p${source}`)
        if (entry.instruction.immediate || operands.length === 0) operands.push(String(entry.instruction.immediate))
        value = `${operands.join('+')} → p${entry.destination}`
      }
      instructions.push({ id: instruction.id, label: instruction.id, value,
        tone: instruction.id === focus ? 'active' : entry?.done ? 'visited' : 'default',
        status: entry?.retired ? 'RETIRED' : entry?.done ? 'EXECUTED' : entry ? 'RENAMED' : 'WAITING',
      })
    }
    const mappings: CpuCell[] = []
    for (const [name, physical] of this.renameMap) mappings.push({ id: `map-${name}`, label: name, value: `p${physical}` })
    const values: CpuCell[] = []
    for (let index = 0; index < this.physical.length; index += 1) values.push({
      id: `physical-${index}`, label: `p${index}`, value: !this.allocated.has(index) ? 'free' : this.physical[index] === null ? 'not ready' : String(this.physical[index]),
    })
    const committed: CpuCell[] = []
    for (const [name, value] of this.architectural) committed.push({ id: `arch-${name}`, label: name, value: String(value) })
    const banks: CpuBank[] = [
      { name: 'Operation', cells: instructions }, { name: 'Rename map', cells: mappings },
      { name: 'Physical', cells: values }, { name: 'Committed', cells: committed },
    ]
    const current = this.instructions.find((entry) => entry.instruction.id === this.currentId)
    const program = current?.instruction ?? RegisterRenameModel.program[0]
    const mapping: string[] = []
    const architectural: string[] = []
    for (const [name, physical] of this.renameMap) mapping.push(`${name}:p${physical}`)
    for (const [name, value] of this.architectural) architectural.push(`${name}:${value}`)
    const diagram = RegisterRenamingLayout.create({
      phase: this.phase, id: program.id, text: program.text,
      sources: current?.sources ?? [], destination: current?.destination ?? 0,
      previous: current?.previous ?? 0, mapping: mapping.join(' '), committed: architectural.join(' '),
      result: current?.done ? `${program.id}: ${this.physical[current.destination] ?? 'retired'}` : 'waiting for operands',
    })
    const focusId = focus === null ? null : this.phase === 'rename' ? 'rename-map' : this.phase === 'execute' ? 'alu' : 'committed-registers'
    return new CpuModel(banks, focusId, 0, diagram)
  }
}
