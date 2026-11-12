import { HardwareModel } from '../HardwareModel.ts'
import { StoreBufferLayout } from './StoreBufferLayout.ts'

interface BufferedStore {
  address: 'x' | 'y'
  value: number
}

// A bounded x86-TSO store-buffering litmus, not a general x86 simulator.
export class StoreBufferModel {
  public readonly fence: 'none' | 'MFENCE' | 'SFENCE' | 'LFENCE'
  private flow = 'none'
  private flowCore = 0
  public memory = { x: 0, y: 0 }
  public buffers: BufferedStore[][] = [[], []]
  public pc = [0, 0]
  public registers: (number | null)[] = [null, null]

  constructor(fence: 'none' | 'MFENCE' | 'SFENCE' | 'LFENCE' = 'none') {
    this.fence = fence
  }

  public clone(): StoreBufferModel {
    const copy = new StoreBufferModel(this.fence)
    copy.flow = this.flow
    copy.flowCore = this.flowCore
    copy.memory = { ...this.memory }
    copy.buffers = []
    for (const buffer of this.buffers) {
      const stores: BufferedStore[] = []
      for (const store of buffer) stores.push({ ...store })
      copy.buffers.push(stores)
    }
    copy.pc = [...this.pc]
    copy.registers = [...this.registers]
    return copy
  }

  public load(core: number, address: 'x' | 'y'): number {
    const buffer = this.buffers[core]
    for (let index = buffer.length - 1; index >= 0; index -= 1) {
      if (buffer[index].address === address) return buffer[index].value
    }
    return this.memory[address]
  }

  public inspectForwarding(core: number): number {
    this.flow = 'forward'
    this.flowCore = core
    return this.load(core, core === 0 ? 'x' : 'y')
  }

  public advance(core: number): boolean {
    this.flowCore = core
    this.flow = this.pc[core] === 0 ? 'store' : 'fence'
    const own = core === 0 ? 'x' : 'y'
    const other = core === 0 ? 'y' : 'x'
    const loadPc = this.fence === 'none' ? 1 : 2
    if (this.pc[core] === 0) this.buffers[core].push({ address: own, value: 1 })
    else if (this.pc[core] === 1 && this.fence !== 'none') {
      // SFENCE does not constrain the following load: its local completion
      // is not modeled here. LFENCE does not drain stores.
      if (this.fence === 'MFENCE' && this.buffers[core].length) return false
    } else if (this.pc[core] === loadPc) {
      this.registers[core] = this.load(core, other)
      this.flow = 'load'
    }
    else return false
    this.pc[core] += 1
    return true
  }

  public drain(core: number): boolean {
    const store = this.buffers[core].shift()
    if (!store) return false
    this.memory[store.address] = store.value
    this.flow = 'drain'
    this.flowCore = core
    return true
  }

  public outcomes(): string[] {
    const outcomes = new Set<string>()
    const seen = new Set<string>()
    const pending = [new StoreBufferModel(this.fence)]
    while (pending.length) {
      const state = pending.pop()!
      const key = JSON.stringify([state.memory, state.buffers, state.pc, state.registers])
      if (seen.has(key)) continue
      seen.add(key)
      if (state.registers[0] !== null && state.registers[1] !== null) {
        outcomes.add(`${state.registers[0]},${state.registers[1]}`)
        continue
      }
      for (let core = 0; core < 2; core += 1) {
        const instruction = state.clone()
        if (instruction.advance(core)) pending.push(instruction)
        const visibility = state.clone()
        if (visibility.drain(core)) pending.push(visibility)
      }
    }
    return [...outcomes].sort()
  }

  public snapshot(detail = 'Intel x86: aligned ordinary write-back memory; x=y=0. Core 0: MOV [x],1; MOV r0,[y]. Core 1: MOV [y],1; MOV r1,[x]. Hardware instructions, not a C/C++ data race.'): HardwareModel {
    const banks = []
    for (let core = 0; core < 2; core += 1) {
      const buffer = this.buffers[core][0]
      const own = core === 0 ? 'x' : 'y'
      const other = core === 0 ? 'y' : 'x'
      const loadPc = this.fence === 'none' ? 1 : 2
      let instruction = 'program end'
      if (this.pc[core] === 0) instruction = `MOV [${own}],1`
      else if (this.pc[core] === 1 && this.fence !== 'none') instruction = this.fence
      else if (this.pc[core] === loadPc) instruction = `MOV r${core},[${other}]`
      banks.push({ name: `Core ${core}`, cells: [
        { id: `c${core}-pc`, label: 'next CPU instruction', value: instruction, status: this.flow === 'fence' && this.flowCore === core && this.fence === 'MFENCE' && this.buffers[core].length ? 'MFENCE: waiting for store' : this.fence === 'none' ? 'no fence' : this.fence },
        { id: `c${core}-buffer`, label: 'store buffer', value: buffer ? `${buffer.address}=${buffer.value}` : 'empty' },
        { id: `c${core}-r`, label: `r${core}`, value: `${this.registers[core] ?? '?'}` },
      ] })
    }
    banks.push({ name: 'Shared', cells: [
      { id: 'mem-x', label: 'x', value: `${this.memory.x}` },
      { id: 'mem-y', label: 'y', value: `${this.memory.y}` },
    ] })
    return new HardwareModel(banks, detail, null, 0, StoreBufferLayout.create(this.flow, this.flowCore, this.memory))
  }
}
