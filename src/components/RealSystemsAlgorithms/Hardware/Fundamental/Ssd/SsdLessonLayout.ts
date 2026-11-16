import type { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { SsdLayout } from './SsdLayout.ts'

export type SsdFirmwareFeature = 'nand' | 'ftl' | 'garbage-collection' | 'wear-leveling'
export type SsdActivity = 'idle' | 'lookup' | 'allocate' | 'program' | 'relocate' | 'read' | 'sense' | 'encode' | 'ecc' | 'commit' | 'erase' | 'buffer' | 'reject' | 'policy'

export interface SsdLessonState {
  readonly feature: SsdFirmwareFeature
  readonly activity: SsdActivity
  readonly location: string
  readonly data: string
  readonly metadata: string
  readonly failed?: boolean
}

export class SsdLessonLayout {
  public static readonly detailTop = SsdLayout.height + 40

  public static address(block: number, page: number | null = null): string {
    return `CH0 / T0 / D0 / PL0 / B${block}${page === null ? '' : ` / P${page}`}`
  }

  public static create(height: number, state: SsdLessonState): HardwareDiagram {
    const diagram = SsdLayout.diagram(height)
    const active = state.activity !== 'idle'
    const reading = state.activity === 'read' || state.activity === 'sense' || state.activity === 'ecc' || state.activity === 'relocate'
    const writing = state.activity === 'program' || state.activity === 'relocate' || state.activity === 'encode'
    const transferring = reading || writing || state.activity === 'buffer'
    const feature = state.feature === 'nand' ? 'NAND access' : state.feature === 'ftl' ? 'FTL' : state.feature === 'garbage-collection' ? 'GC' : 'wear leveling'
    const hostTransfer = state.activity === 'read' || state.activity === 'buffer' || state.activity === 'program' && state.feature !== 'nand'
    const mediaAccess = state.activity === 'program' || state.activity === 'relocate' || state.activity === 'read' || state.activity === 'sense' || state.activity === 'erase'
    this.cell(diagram, 'host', state.activity === 'lookup' ? 'LBA lookup' : hostTransfer ? state.activity === 'read' ? 'return data' : 'write payload' : 'idle', hostTransfer || state.activity === 'lookup')
    this.cell(diagram, 'cpu', active ? feature : 'idle', active)
    this.cell(diagram, 'sram', state.metadata, active)
    this.cell(diagram, 'ftl', state.location, active && state.feature !== 'nand')
    this.cell(diagram, 'gc', state.feature === 'garbage-collection' && active ? 'preserve / reclaim' : 'idle', active && state.feature === 'garbage-collection')
    this.cell(diagram, 'wear', state.feature === 'wear-leveling' && active ? 'balance wear' : 'idle', active && state.feature === 'wear-leveling')
    this.cell(diagram, 'dma', transferring ? state.data : 'no payload transfer', transferring)
    this.cell(diagram, 'ecc-encode', writing ? state.feature === 'nand' && state.activity === 'program' ? 'encoded (concept)' : 'encode (concept)' : 'idle', writing)
    this.cell(diagram, 'ecc-decode', reading ? state.activity === 'sense' ? 'await ECC stage' : 'decode (concept)' : 'idle', reading && state.activity !== 'sense')
    this.cell(diagram, 'controller', state.failed ? 'program failed' : mediaAccess ? state.activity : 'idle', mediaAccess)
    this.activate(diagram, state)
    return diagram
  }

  private static cell(diagram: HardwareDiagram, id: string, value: string, active: boolean): void {
    const regions: Readonly<Record<string, string>> = {
      host: 'ssd-host-interface', cpu: 'ssd-cpu', sram: 'ssd-sram', ftl: 'ssd-physical-address',
      gc: 'ssd-garbage-collection', wear: 'ssd-wear-leveling', dma: 'ssd-dma',
      'ecc-encode': 'ssd-ecc-encode', 'ecc-decode': 'ssd-ecc-decode', controller: 'ssd-nand-command-io',
    }
    const region = diagram.regions.find((candidate) => candidate.id === regions[id])
    if (!region) throw new Error(`Missing SSD state region: ${id}`)
    diagram.fixture(`ssd-state-${id}`, '', value, region.x + region.width / 2, region.y + region.height - 30, '', region.width - 40, 26)
    const index = diagram.fixtures.length - 1
    diagram.fixtures[index] = { ...diagram.fixtures[index], tone: active ? 'active' : 'default' }
  }

  private static activate(diagram: HardwareDiagram, state: SsdLessonState): void {
    const ids = new Set<string>()
    const activity = state.activity
    const writing = activity === 'program' || activity === 'relocate'
    const reading = activity === 'read' || activity === 'sense'
    if (activity !== 'idle') {
      ids.add('ssd-cpu-sram')
      if (state.feature !== 'nand') {
        ids.add('ssd-cpu-ftl')
        ids.add('ssd-sram-ftl')
        if (state.feature === 'garbage-collection') ids.add('ssd-ftl-gc')
        if (state.feature === 'wear-leveling') ids.add('ssd-ftl-wear')
      }
    }
    if (activity === 'lookup') ids.add('ssd-host-ftl')
    if (activity === 'buffer' || activity === 'read' || activity === 'program' && state.feature !== 'nand') {
      ids.add('ssd-data-interface')
      ids.add('ssd-interface-dma')
    }
    if (activity === 'encode' || writing && state.feature !== 'nand') ids.add('ssd-buffer-encode')
    if (writing) ids.add('ssd-encode-nand')
    if (activity === 'read' || activity === 'ecc' || activity === 'relocate') ids.add('ssd-decode-buffer')
    if (reading || activity === 'ecc' || activity === 'relocate') ids.add('ssd-nand-decode')
    if (writing || reading || activity === 'erase') {
      ids.add(state.feature === 'nand' ? 'ssd-cpu-nand' : 'ssd-ftl-nand')
      ids.add('ssd-channel-0')
      ids.add('ssd-channel-0-shared-bus')
      ids.add('ssd-channel-0-package-0')
      ids.add('ssd-nand-die-io')
      ids.add('ssd-nand-io-control')
      ids.add('ssd-nand-command')
      ids.add('ssd-nand-sequencer')
      ids.add('ssd-nand-bias')
      if (activity !== 'erase') {
        ids.add('ssd-nand-wordline')
        ids.add('ssd-nand-bitline')
        ids.add('ssd-nand-buffer-io')
      }
    }
    if (state.feature !== 'nand' && (writing || activity === 'read' || activity === 'buffer')) ids.add('ssd-ftl-dma')
    for (let index = 0; index < diagram.paths.length; index += 1) {
      const path = diagram.paths[index]
      if (!ids.has(path.id)) continue
      let d = path.d
      if (reading && (path.id === 'ssd-data-interface' || path.id === 'ssd-interface-dma' || path.id === 'ssd-channel-0' || path.id === 'ssd-channel-0-package-0' || path.id === 'ssd-nand-die-io')) d = this.reverse(path.d)
      if (!reading && path.id === 'ssd-channel-0-shared-bus') d = this.reverse(path.d)
      if (writing && (path.id === 'ssd-nand-buffer-io' || path.id === 'ssd-nand-bitline')) d = this.reverse(path.d)
      const mediaData = path.id === 'ssd-channel-0' || path.id === 'ssd-channel-0-shared-bus' || path.id === 'ssd-channel-0-package-0' || path.id === 'ssd-nand-die-io' || path.id === 'ssd-nand-buffer-io' || path.id === 'ssd-nand-bitline'
      const relocating = activity === 'relocate' && mediaData
      const control = path.id === 'ssd-cpu-sram' || path.id === 'ssd-sram-ftl' || path.id === 'ssd-ftl-gc' || path.id === 'ssd-ftl-wear' || path.id === 'ssd-ftl-nand'
      diagram.paths[index] = { ...path, d, highlighted: true, directed: true, bidirectional: relocating || control && path.bidirectional, label: `${path.label} / current ${activity}${state.failed ? ' attempt failed' : ''}` }
    }
  }

  private static reverse(path: string): string {
    const tokens = path.match(/[MHV]|-?\d+(?:\.\d+)?/g) ?? []
    const points: { x: number, y: number }[] = []
    let x = 0
    let y = 0
    for (let index = 0; index < tokens.length;) {
      const command = tokens[index++]
      if (command === 'M') {
        x = Number(tokens[index++])
        y = Number(tokens[index++])
      } else if (command === 'H') x = Number(tokens[index++])
      else if (command === 'V') y = Number(tokens[index++])
      else throw new Error('SSD connections must use orthogonal paths')
      points.push({ x, y })
    }
    let result = ''
    for (let index = points.length - 1; index >= 0; index -= 1) {
      const point = points[index]
      if (index === points.length - 1) result = `M${point.x} ${point.y}`
      else result += point.x === points[index + 1].x ? `V${point.y}` : `H${point.x}`
    }
    return result
  }
}
