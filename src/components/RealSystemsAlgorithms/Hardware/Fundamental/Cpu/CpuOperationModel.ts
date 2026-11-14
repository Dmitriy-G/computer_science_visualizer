export type CpuOperationKind = 'increment' | 'load'
type CpuOperationStage = 'initial' | 'loaded' | 'computed' | 'buffered' | 'published' | 'complete'

export class CpuOperationModel {
  public readonly operation: CpuOperationKind
  public readonly address = '0x1000'
  public shared = 7
  public loaded: number | null = null
  public computed: number | null = null
  public local: number | null = null
  public storeBuffer: number | null = null
  public peerValue: number | null = null
  private stage: CpuOperationStage = 'initial'

  constructor(operation: CpuOperationKind) {
    if (operation !== 'increment' && operation !== 'load') throw new TypeError('Expected increment or load')
    this.operation = operation
  }

  public get variable(): string { return this.operation === 'increment' ? 'i' : 'j' }

  public load(): number {
    this.requireStage('initial')
    this.loaded = this.shared
    this.stage = 'loaded'
    return this.loaded
  }

  public addOne(): number {
    this.requireStage('loaded')
    if (this.operation !== 'increment') throw new Error('This lesson only loads a value')
    this.computed = this.loaded! + 1
    this.stage = 'computed'
    return this.computed
  }

  public retireStore(): number {
    this.requireStage('computed')
    this.storeBuffer = this.computed
    this.stage = 'buffered'
    return this.storeBuffer!
  }

  public publishStore(): number {
    this.requireStage('buffered')
    this.shared = this.storeBuffer!
    this.stage = 'published'
    return this.shared
  }

  public drainStore(): void {
    this.requireStage('published')
    this.storeBuffer = null
    this.stage = 'complete'
  }

  public retireLoad(): number {
    this.requireStage('loaded')
    if (this.operation !== 'load') throw new Error('The increment still needs ADD and STORE')
    this.local = this.loaded
    this.stage = 'complete'
    return this.local!
  }

  public peerStore(value: number): void {
    if (!Number.isInteger(value) || value < -2147483648 || value > 2147483647) throw new RangeError('Expected a signed 32-bit word value')
    if (this.stage === 'initial') throw new Error('Capture the example load before the peer store')
    this.shared = value
    this.peerValue = value
  }

  private requireStage(expected: CpuOperationStage): void {
    if (this.stage !== expected) throw new Error(`Expected ${expected}, received ${this.stage}`)
  }
}
