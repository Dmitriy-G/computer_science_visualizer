interface Vertex { readonly x: number, readonly y: number }

export class FrameRenderingModel {
  public readonly width = 2
  public readonly height = 2
  public readonly texture = '#ff8000'
  public vertices: readonly Vertex[] = []
  public fragments: readonly number[] = []
  public shaded: string | null = null
  public rendered: readonly string[] = ['#000000', '#000000', '#000000', '#000000']
  public vram: readonly string[] = [...this.rendered]
  public displayed: readonly string[] = [...this.rendered]
  private stored = false
  private renderCompleted = false

  public vertexData(): Uint8Array {
    const values = [-1, 1, 1, 1, -1, -0.8]
    const data = new Uint8Array(values.length * 4)
    const view = new DataView(data.buffer)
    for (let index = 0; index < values.length; index += 1) view.setFloat32(index * 4, values[index], true)
    return data
  }

  public shadeVertices(data: Uint8Array = this.vertexData()): void {
    if (data.length !== 24) throw new Error('Three 2D vertices are required')
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
    const vertices: Vertex[] = []
    for (let index = 0; index < 3; index += 1) {
      const x = view.getFloat32(index * 8, true)
      const y = view.getFloat32(index * 8 + 4, true)
      vertices.push({ x: (x + 1) * this.width / 2, y: (1 - y) * this.height / 2 })
    }
    this.vertices = vertices
  }

  public rasterize(): void {
    if (this.vertices.length !== 3) throw new Error('Run the vertex shader before rasterization')
    const [a, b, c] = this.vertices
    const fragments: number[] = []
    for (let y = 0; y < this.height; y += 1) for (let x = 0; x < this.width; x += 1) {
      const p = { x: x + 0.5, y: y + 0.5 }
      if (this.edge(a, b, p) > 0 && this.edge(b, c, p) > 0 && this.edge(c, a, p) > 0) fragments.push(y * this.width + x)
    }
    this.fragments = fragments
  }

  public shadeFragments(sample: Uint8Array = new Uint8Array([255, 128, 0, 255])): void {
    if (!this.fragments.length) throw new Error('Rasterize the triangle before fragment shading')
    if (sample.length !== 4) throw new Error('An RGBA texel is required')
    this.shaded = this.color(sample, 0)
  }

  public render(): void {
    if (!this.shaded) throw new Error('Shade fragments before render output')
    const pixels = [...this.rendered]
    for (const index of this.fragments) pixels[index] = this.shaded
    this.rendered = pixels
    this.renderCompleted = true
  }

  public store(): void {
    if (!this.renderCompleted) throw new Error('Render the frame before storing it')
    this.vram = [...this.rendered]
    this.stored = true
  }
  public frameData(): Uint8Array {
    const data = new Uint8Array(this.rendered.length * 4)
    for (let index = 0; index < this.rendered.length; index += 1) {
      for (let channel = 0; channel < 3; channel += 1) data[index * 4 + channel] = Number.parseInt(this.rendered[index].slice(1 + channel * 2, 3 + channel * 2), 16)
      data[index * 4 + 3] = 255
    }
    return data
  }

  public present(data?: Uint8Array): void {
    if (!this.stored) throw new Error('Complete the frame before scanout')
    if (!data) {
      this.displayed = [...this.vram]
      return
    }
    if (data.length !== this.width * this.height * 4) throw new Error('A complete RGBA frame is required')
    const pixels: string[] = []
    for (let offset = 0; offset < data.length; offset += 4) pixels.push(this.color(data, offset))
    this.displayed = pixels
  }

  private color(data: Uint8Array, offset: number): string {
    let color = '#'
    for (let channel = 0; channel < 3; channel += 1) color += data[offset + channel].toString(16).padStart(2, '0')
    return color
  }

  private edge(a: Vertex, b: Vertex, p: Vertex): number { return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x) }
}
