export interface GpuVramBuffer {
  readonly id: string
  readonly label: string
  readonly data: Uint8Array
}

export class GpuVramModel {
  private readonly buffers = new Map<string, GpuVramBuffer>()
  private selected: string | null = null
  private pending: GpuVramBuffer | null = null
  private restored = false
  public wordline = false
  public capacitorBit = 0
  public capacitorCharge = 0
  public bitlineLevel = 0.5
  public rowBufferBit: number | null = null

  constructor(buffers: readonly GpuVramBuffer[] = []) {
    for (const buffer of buffers) this.buffers.set(buffer.id, this.copy(buffer))
  }

  public activate(id: string): void {
    if (this.wordline) throw new Error('Precharge the current VRAM row before activation')
    this.selected = id
    this.capacitorBit = (this.buffers.get(id)?.data[0] ?? 0) & 1
    this.capacitorCharge = this.capacitorBit
    this.wordline = true
    this.rowBufferBit = null
    this.restored = false
  }

  public shareCharge(): void {
    if (!this.wordline || this.rowBufferBit !== null) throw new Error('Connect the selected VRAM row before sensing')
    this.capacitorCharge = 0.5 + (this.capacitorBit === 1 ? 0.02 : -0.02)
    this.bitlineLevel = this.capacitorCharge
  }

  public sense(): number {
    if (!this.wordline) throw new Error('Activate a VRAM row before sensing')
    this.rowBufferBit = this.capacitorBit
    this.bitlineLevel = this.rowBufferBit
    return this.rowBufferBit
  }

  public restore(): void {
    this.requireRow()
    this.capacitorBit = this.rowBufferBit!
    this.capacitorCharge = this.capacitorBit
    this.restored = true
  }

  public read(): GpuVramBuffer {
    this.requireRow()
    const buffer = this.buffers.get(this.selected!)
    if (!this.restored || !buffer) throw new Error('Read a stored VRAM buffer after row restoration')
    return this.copy(buffer)
  }

  public driveWrite(buffer: GpuVramBuffer): number {
    this.requireRow()
    if (!this.restored || this.selected !== buffer.id) throw new Error('Write the selected VRAM buffer after restoration')
    this.pending = this.copy(buffer)
    this.rowBufferBit = (buffer.data[0] ?? 0) & 1
    return this.rowBufferBit
  }

  public commit(): void {
    this.requireRow()
    if (!this.pending) throw new Error('Drive write data before committing VRAM')
    if (this.bitlineLevel !== this.rowBufferBit) throw new Error('Drive the VRAM bitline before charging the capacitor')
    this.buffers.set(this.pending.id, this.copy(this.pending))
    this.capacitorBit = this.rowBufferBit!
    this.capacitorCharge = this.capacitorBit
    this.pending = null
  }

  public driveBitline(): void {
    this.requireRow()
    this.bitlineLevel = this.rowBufferBit!
  }

  public disconnect(): void {
    if (!this.restored || this.pending) throw new Error('Restore or complete the VRAM write before disconnecting')
    this.wordline = false
  }

  public precharge(): void {
    if (this.pending) throw new Error('Complete the VRAM write before precharge')
    this.wordline = false
    this.selected = null
    this.rowBufferBit = null
    this.bitlineLevel = 0.5
    this.restored = false
  }

  private requireRow(): void {
    if (!this.wordline || this.selected === null || this.rowBufferBit === null) throw new Error('Activate and sense a VRAM row first')
  }

  private copy(buffer: GpuVramBuffer): GpuVramBuffer { return { ...buffer, data: buffer.data.slice() } }
}
