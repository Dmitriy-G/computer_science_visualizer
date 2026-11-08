import { HardwareDiagram } from '../../../../visualization/HardwareDiagram.ts'
import type { HardwarePosition } from '../../../../visualization/HardwareDiagram.ts'
import type { SceneEdge, SceneRegion } from '../../../../visualization/Scene.ts'

type SystemPart = 'cpu' | 'bus' | 'memory' | 'observer'

interface Component {
  readonly region: SceneRegion
  readonly children: readonly SceneRegion[]
  readonly positions: readonly HardwarePosition[]
  readonly part: SystemPart
}

interface PackedComponent {
  readonly component: Component
  readonly width: number
  readonly height: number
  readonly columns: number
  readonly cellWidth: number
}

// Organizes logical teaching components. It does not infer hardware transactions.
export class HardwareSystemLayout {
  private readonly components: Component[] = []
  private readonly parts = new Map<string, SystemPart>()
  private readonly edges = new Map<string, SceneEdge>()
  private readonly cpuPort = 'system-cpu-port'
  private readonly busPort: string
  private readonly busMemoryPort = 'system-bus-memory-port'
  private readonly memoryPort = 'system-memory-port'
  private readonly cpuWidth: number
  private readonly cpuHeight: number
  private readonly busHeight: number
  private readonly memoryHeight: number
  private readonly memoryY: number
  private readonly width: number
  private readonly height: number

  constructor(privateSource: HardwareDiagram) {
    this.collect(privateSource)
    this.busPort = this.parts.get('transfer') === 'bus' ? 'transfer' : 'system-bus-port'
    const cpu = this.ofPart('cpu')
    const columns = Math.min(3, Math.max(1, cpu.length))
    const widths = Array<number>(columns).fill(0)
    const heights: number[] = []
    for (let index = 0; index < cpu.length; index += 1) {
      const column = index % columns
      const row = Math.floor(index / columns)
      widths[column] = Math.max(widths[column], cpu[index].region.width)
      heights[row] = Math.max(heights[row] ?? 0, cpu[index].region.height)
    }
    let width = 40 + (columns - 1) * 20
    for (const value of widths) width += value
    let height = 60 + 150 + Math.max(0, heights.length - 1) * 20
    for (const value of heights) height += value
    this.cpuWidth = Math.max(300, width)
    this.cpuHeight = height
    this.busHeight = this.packedHeight(this.ofPart('bus'), this.busPort === 'system-bus-port' ? 200 : 60) + (this.busPort === 'system-bus-port' ? 0 : 150)
    this.memoryHeight = this.packedHeight(this.ofPart('memory'), 200)
    this.memoryY = 20 + this.busHeight + 30
    this.width = this.cpuWidth + 630
    let bottom = Math.max(20 + this.cpuHeight, this.memoryY + this.memoryHeight)
    for (const observer of this.ofPart('observer')) bottom += observer.region.height + 30
    this.height = bottom + 20
  }

  public static create(source: HardwareDiagram): HardwareDiagram {
    return new HardwareSystemLayout(source).build(source)
  }

  private part(region: SceneRegion): SystemPart {
    if (region.role === 'cpu' || region.role === 'cache') return 'cpu'
    if (region.role === 'interconnect') return 'bus'
    if (region.role === 'memory') return 'memory'
    return 'observer'
  }

  private contains(outer: SceneRegion, inner: SceneRegion): boolean {
    return outer.id !== inner.id && outer.x <= inner.x && outer.y <= inner.y &&
      outer.x + outer.width >= inner.x + inner.width && outer.y + outer.height >= inner.y + inner.height &&
      outer.width * outer.height > inner.width * inner.height
  }

  private collect(source: HardwareDiagram): void {
    const roots: SceneRegion[] = []
    for (const region of source.regions) {
      let nested = false
      for (const other of source.regions) {
        if (this.part(other) === this.part(region) && this.contains(other, region)) nested = true
      }
      if (!nested) roots.push(region)
    }
    const assigned = new Set<string>()
    for (const root of roots) {
      const children: SceneRegion[] = []
      for (const region of source.regions) {
        if (this.part(region) === this.part(root) && this.contains(root, region)) children.push(region)
      }
      const positions: HardwarePosition[] = []
      for (const position of source.positions) {
        if (!assigned.has(position.id) && position.x >= root.x && position.x <= root.x + root.width && position.y >= root.y && position.y <= root.y + root.height) {
          assigned.add(position.id)
          positions.push(position)
          this.parts.set(position.id, this.part(root))
        }
      }
      this.components.push({ region: root, children, positions, part: this.part(root) })
    }
    for (const position of source.positions) {
      if (!assigned.has(position.id)) throw new Error(`Hardware component has no system region: ${position.id}`)
    }
  }

  private ofPart(part: SystemPart): Component[] {
    const components: Component[] = []
    for (const component of this.components) if (component.part === part) components.push(component)
    return components
  }

  private pack(component: Component): PackedComponent {
    const columns = Math.min(2, Math.max(1, component.positions.length))
    let cellWidth = 180
    for (const position of component.positions) cellWidth = Math.max(cellWidth, position.width)
    const width = Math.min(520, Math.max(220, columns * cellWidth + (columns - 1) * 60 + 40, component.region.label.length * 8.4 + 32))
    const rows = Math.max(1, Math.ceil(component.positions.length / columns))
    return { component, width, height: rows * 130 + 40, columns, cellWidth }
  }

  private packedHeight(components: readonly Component[], start: number): number {
    let y = start
    let rowWidth = 0
    let rowHeight = 0
    for (const component of components) {
      const packed = this.pack(component)
      if (rowWidth && rowWidth + 20 + packed.width > 520) {
        y += rowHeight + 20
        rowWidth = 0
        rowHeight = 0
      }
      rowWidth += (rowWidth ? 20 : 0) + packed.width
      rowHeight = Math.max(rowHeight, packed.height)
    }
    return Math.max(190, y + rowHeight + 20)
  }

  private build(source: HardwareDiagram): HardwareDiagram {
    const diagram = new HardwareDiagram(this.width, this.height)
    for (const fixture of source.fixtures) diagram.fixtures.push({ ...fixture })
    const rightX = this.cpuWidth + 50
    diagram.region('system-cpu', 'CPU / cores and private state', 'cpu', 20, 20, this.cpuWidth, this.cpuHeight, 'system')
    diagram.region('system-bus', 'Bus / coherent interconnect', 'interconnect', rightX, 20, 560, this.busHeight, 'system')
    diagram.region('system-memory', 'Memory system / RAM backing', 'memory', rightX, this.memoryY, 560, this.memoryHeight, 'system')
    this.placeCpu(diagram)
    this.placePacked(diagram, this.ofPart('bus'), rightX, 20, this.busPort === 'system-bus-port' ? 200 : 60, 'system-bus')
    this.placePacked(diagram, this.ofPart('memory'), rightX, this.memoryY, 200, 'system-memory')
    let observerY = Math.max(20 + this.cpuHeight, this.memoryY + this.memoryHeight) + 30
    for (const component of this.ofPart('observer')) {
      this.translate(diagram, component, (this.width - component.region.width) / 2, observerY, undefined)
      observerY += component.region.height + 30
    }
    diagram.fixture(this.cpuPort, 'core / cache interface', 'CPU fabric', 20 + this.cpuWidth / 2, 20 + this.cpuHeight - 70)
    this.parts.set(this.cpuPort, 'cpu')
    if (this.busPort === 'system-bus-port') {
      diagram.fixture(this.busPort, 'CPU-side interface', 'requests / replies', rightX + 140, 130)
      diagram.fixture(this.busMemoryPort, 'memory-side interface', 'memory traffic', rightX + 420, 130)
    } else diagram.fixture(this.busMemoryPort, 'memory-side interface', 'memory traffic', rightX + 280, 20 + this.busHeight - 70)
    diagram.fixture(this.memoryPort, 'coherent access / maintenance', 'memory interface', rightX + 280, this.memoryY + 110, 'coherent state may reside in caches', 250)
    this.parts.set(this.busPort, 'bus')
    this.parts.set(this.busMemoryPort, 'bus')
    this.parts.set(this.memoryPort, 'memory')
    for (const edge of source.edges) this.route(edge)
    for (const edge of this.edges.values()) diagram.edges.push(this.avoidComponents(edge, diagram))
    return diagram
  }

  private translate(diagram: HardwareDiagram, component: Component, x: number, y: number, parentId: string | undefined): void {
    const dx = x - component.region.x
    const dy = y - component.region.y
    diagram.regions.push({ ...component.region, x, y, parentId, level: 'component' })
    for (const child of component.children) diagram.regions.push({ ...child, x: child.x + dx, y: child.y + dy, parentId: component.region.id, level: 'component' })
    for (const position of component.positions) diagram.positions.push({ ...position, x: position.x + dx, y: position.y + dy })
  }

  private placeCpu(diagram: HardwareDiagram): void {
    const components = this.ofPart('cpu')
    const columns = Math.min(3, Math.max(1, components.length))
    const widths = Array<number>(columns).fill(0)
    for (let index = 0; index < components.length; index += 1) widths[index % columns] = Math.max(widths[index % columns], components[index].region.width)
    let rowY = 80
    let rowHeight = 0
    for (let index = 0; index < components.length; index += 1) {
      const column = index % columns
      if (column === 0 && index > 0) {
        rowY += rowHeight + 20
        rowHeight = 0
      }
      let x = 40
      for (let previous = 0; previous < column; previous += 1) x += widths[previous] + 20
      this.translate(diagram, components[index], x, rowY, 'system-cpu')
      rowHeight = Math.max(rowHeight, components[index].region.height)
    }
  }

  private placePacked(diagram: HardwareDiagram, components: readonly Component[], x: number, y: number, start: number, parentId: string): void {
    const rows: PackedComponent[][] = [[]]
    let width = 0
    for (const component of components) {
      const packed = this.pack(component)
      if (width && width + 20 + packed.width > 520) {
        rows.push([])
        width = 0
      }
      rows[rows.length - 1].push(packed)
      width += (width ? 20 : 0) + packed.width
    }
    let rowY = start
    for (const row of rows) {
      let rowWidth = Math.max(0, row.length - 1) * 20
      for (const packed of row) rowWidth += packed.width
      let rowX = (560 - rowWidth) / 2
      let rowHeight = 0
      for (const packed of row) {
        const component = packed.component
        const regionX = x + rowX
        const regionY = y + rowY
        diagram.regions.push({ ...component.region, x: regionX, y: regionY, width: packed.width, height: packed.height, parentId, level: 'component' })
        for (let index = 0; index < component.positions.length; index += 1) {
          const position = component.positions[index]
          const column = index % packed.columns
          const center = packed.columns === 1 ? packed.width / 2 : packed.width / 2 + (column - 0.5) * (packed.cellWidth + 60)
          diagram.positions.push({ ...position, x: regionX + center, y: regionY + 100 + Math.floor(index / packed.columns) * 130 })
        }
        rowX += packed.width + 20
        rowHeight = Math.max(rowHeight, packed.height)
      }
      rowY += rowHeight + 20
    }
  }

  private avoidComponents(edge: SceneEdge, diagram: HardwareDiagram): SceneEdge {
    if (edge.from !== this.cpuPort && edge.to !== this.cpuPort) return edge
    const positions = new Map<string, HardwarePosition>()
    for (const position of diagram.positions) positions.set(position.id, position)
    const from = positions.get(edge.from)!
    const to = positions.get(edge.to)!
    const dx = to.x - from.x
    const dy = to.y - from.y
    const length = Math.hypot(dx, dy) || 1
    const normalX = -dy / length
    const normalY = dx / length
    const internal = this.parts.get(edge.from) === 'cpu' && this.parts.get(edge.to) === 'cpu'
    let best = edge.curveOffset ?? 0
    let bestCost = Number.POSITIVE_INFINITY
    for (const curve of [best, 0, -60, 60, -110, 110, -170, 170, -240, 240]) {
      const controlX = (from.x + to.x) / 2 + normalX * curve * 2
      const controlY = (from.y + to.y) / 2 + normalY * curve * 2
      let cost = Math.abs(curve) / 1000
      for (let sample = 1; sample < 24; sample += 1) {
        const t = sample / 24
        const x = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * controlX + t ** 2 * to.x
        const y = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * controlY + t ** 2 * to.y
        if (x < 20 || x > this.width - 20 || y < 55 || y > this.height - 20) cost += 100
        if (internal && (x > 20 + this.cpuWidth || y > 20 + this.cpuHeight)) cost += 100
        for (const position of diagram.positions) {
          if (position.id === from.id || position.id === to.id) continue
          if (x > position.x - position.width / 2 - 12 && x < position.x + position.width / 2 + 12 && y > position.y - 55 && y < position.y + 60) cost += 10
        }
      }
      if (cost < bestCost) {
        bestCost = cost
        best = curve
      }
    }
    return { ...edge, curveOffset: best }
  }

  private add(edge: SceneEdge, from: string, to: string, label: string, shared = false): void {
    if (from === to) return
    const id = shared ? `${from}:${to}` : `${edge.id}:${from}:${to}`
    const previous = this.edges.get(id)
    const highlighted = edge.highlighted || previous?.highlighted === true
    const betweenPackages = from === this.cpuPort && to === this.busPort || from === this.busPort && to === this.cpuPort
    this.edges.set(id, {
      ...edge, id, from, to, label, highlighted, flow: highlighted,
      curveOffset: betweenPackages ? 45 : shared ? 25 : edge.curveOffset ?? 0,
      opacity: highlighted ? 1 : 0.18,
    })
  }

  private route(edge: SceneEdge): void {
    const from = this.parts.get(edge.from)
    const to = this.parts.get(edge.to)
    if (!from || !to || from === to || from === 'observer' || to === 'observer') {
      this.edges.set(edge.id, { ...edge })
      return
    }
    const path: string[] = [edge.from]
    if (from === 'cpu') path.push(this.cpuPort)
    if (from === 'memory') path.push(this.memoryPort, this.busMemoryPort)
    if (edge.from !== this.busPort) path.push(this.busPort)
    if (to === 'memory') path.push(this.busMemoryPort, this.memoryPort)
    if (to === 'cpu') path.push(this.cpuPort)
    path.push(edge.to)
    for (let index = 0; index < path.length - 1; index += 1) {
      const first = path[index]
      const second = path[index + 1]
      const cpuLink = first === this.cpuPort && second === this.busPort || first === this.busPort && second === this.cpuPort
      const busLink = first === this.busPort && second === this.busMemoryPort || first === this.busMemoryPort && second === this.busPort
      const memoryLink = first === this.busMemoryPort && second === this.memoryPort || first === this.memoryPort && second === this.busMemoryPort
      let label = edge.label ?? 'transfer'
      if (cpuLink) label = first === this.cpuPort ? 'request / data' : 'response / data'
      if (busLink) label = first === this.busPort ? 'route request' : 'route response'
      if (memoryLink) label = first === this.busMemoryPort ? 'memory request' : 'memory response'
      this.add(edge, first, second, label, cpuLink || busLink || memoryLink)
    }
  }
}
