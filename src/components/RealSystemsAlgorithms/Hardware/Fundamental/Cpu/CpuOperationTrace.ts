import type { AnimationStep, Scene } from '../../../../../visualization/Scene.ts'
import { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { CpuOperationLayout } from './CpuOperationLayout.ts'
import type { CpuOperationActivity } from './CpuOperationLayout.ts'
import type { CpuOperationModel } from './CpuOperationModel.ts'

export class CpuOperationTrace {
  public readonly steps: AnimationStep[] = []
  private readonly values = new Map<string, string>()

  constructor(model: CpuOperationModel) {
    this.values.set('memory', `${model.variable} = ${model.shared}`)
    this.record('Initial state', 'Aligned 32-bit normal cacheable memory at 0x1000 initially holds 7. The selected core has a coherent L1 data-cache hit. Other components provide context.', { from: null, to: null, message: '' }, 0)
  }

  public transfer(from: string, to: string, value: string, title: string, description: string, message = value): void {
    this.values.set(to, value)
    this.record(title, description, { from, to, message })
  }

  public local(to: string, value: string, title: string, description: string, peer = false): void {
    this.values.set(to, value)
    this.record(title, description, { from: null, to, message: value, peer })
  }

  public instruction(instruction: string, pc: string): void {
    this.local('fetch', pc, 'Fetch instruction', `Fetch the next instruction at ${pc}. Instruction-cache and ITLB behavior are held fixed; these are logical events, not clock cycles.`)
    this.transfer('fetch', 'decode', instruction, 'Decode instruction', `Decode ${instruction}. The source-level expression is not an instruction-set atomicity guarantee.`)
    this.transfer('decode', 'queue', instruction, 'Queue instruction', 'Place the decoded instruction in the instruction queue.')
    this.transfer('queue', 'dispatch', instruction, 'Dispatch instruction', 'Allocate this instruction for the selected core. Detailed renaming and allocation policy are outside this bounded example.')
    this.transfer('dispatch', 'issue', instruction, 'Issue instruction', 'The operands are ready, so the instruction can issue.')
  }

  public finish(title: string, description: string): void {
    this.record(title, description, { from: null, to: null, message: '' }, 2)
  }

  public result(model: CpuOperationModel): HardwareSnapshot {
    const fields = [['shared', model.shared], ['loaded', model.loaded], ['computed', model.computed], ['local', model.local], ['storeBuffer', model.storeBuffer]] as const
    const cells = []
    for (const [id, value] of fields) cells.push({ id, label: id, value: value === null ? 'empty' : String(value) })
    return new HardwareSnapshot([{ name: 'CPU operation result', cells }], null, this.steps.length)
  }

  public static present(scene: Scene, preview: Scene): Scene {
    const layers = []
    for (const layer of preview.layers ?? []) layers.push(layer.id === 'cpu-components' ? { ...layer, scene } : layer)
    return { ...preview, layers }
  }

  private record(title: string, description: string, activity: CpuOperationActivity, phase = 1): void {
    if (this.steps.length >= 96) throw new RangeError('CPU operation exceeds its event bound')
    this.steps.push({ title, description, phase, code: '', duration: 1000, scene: CpuOperationLayout.create(this.values, activity) })
  }
}
