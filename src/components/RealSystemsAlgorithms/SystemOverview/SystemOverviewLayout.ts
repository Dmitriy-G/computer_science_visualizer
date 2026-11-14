import type { Scene, SceneBounds, SceneLayer, SceneNode } from '../../../visualization/Scene.ts'
import { CpuLayout } from '../Hardware/Fundamental/Cpu/CpuLayout.ts'
import { HddLayout } from '../Hardware/Fundamental/Hdd/HddLayout.ts'
import { SsdLayout } from '../Hardware/Fundamental/Ssd/SsdLayout.ts'
import { RamLayout } from '../Hardware/Fundamental/Ram/RamLayout.ts'
import { GpuLayout } from '../Hardware/Fundamental/Gpu/GpuLayout.ts'
import { NetworkAdapterLayout } from '../Hardware/Fundamental/NetworkAdapter/NetworkAdapterLayout.ts'
import { BusLayout } from '../Hardware/Fundamental/Bus/BusLayout.ts'

type SystemOverviewComponent = 'cpu' | 'hdd' | 'ssd' | 'ram' | 'gpu' | 'network-adapter' | 'bus'
type SystemOverviewLevel = 'system' | 'hardware' | SystemOverviewComponent

export class SystemOverviewLayout {
  private static readonly server = { x: 1060, y: 100, scale: 1080 / 1560 }
  private static readonly cpu = { x: 75, y: 110, size: 660 }
  private static readonly hdd = { x: 75, y: 1075, width: 420, height: 220 }
  private static readonly ssd = { x: 560, y: 1075, width: 420, height: 220 }
  private static readonly ram = { x: 825, y: 125, width: 640, height: 240 }
  private static readonly gpu = { x: 825, y: 465, width: 640, height: 260 }
  private static readonly networkAdapter = { x: 1045, y: 1075, width: 420, height: 220 }
  private static readonly bus = { x: 75, y: 855, width: 1390, height: 100 }
  private static readonly layouts = {
    cpu: CpuLayout, hdd: HddLayout, ssd: SsdLayout, ram: RamLayout,
    gpu: GpuLayout, 'network-adapter': NetworkAdapterLayout, bus: BusLayout,
  }

  private static componentPlacement(level: SystemOverviewComponent): { x: number, y: number, scale: number } {
    const devices = {
      cpu: { x: this.cpu.x, y: this.cpu.y, width: this.cpu.size, height: this.cpu.size },
      hdd: this.hdd, ssd: this.ssd, ram: this.ram, gpu: this.gpu, 'network-adapter': this.networkAdapter, bus: this.bus,
    }
    const device = devices[level]
    const layout = this.layouts[level]
    const scale = Math.min(device.width / layout.width, device.height / layout.height)
    return {
      x: this.server.x + (device.x + (device.width - layout.width * scale) / 2) * this.server.scale,
      y: this.server.y + (device.y + (device.height - layout.height * scale) / 2) * this.server.scale,
      scale: scale * this.server.scale,
    }
  }

  private static bounds(level: SystemOverviewLevel): SceneBounds {
    if (level === 'system') return { x: 0, y: 0, width: 2200, height: 1200 }
    const server = this.server
    if (level === 'hardware') return { x: server.x - 30, y: server.y - 30, width: 1140, height: 1060 }
    const device = this.componentPlacement(level)
    const layout = this.layouts[level]
    return { x: device.x - 20 * device.scale, y: device.y - 20 * device.scale, width: (layout.width + 40) * device.scale, height: (layout.height + 40) * device.scale }
  }

  private static scene(width: number, height: number, nodes: readonly SceneNode[] = []): Scene {
    return { kind: 'system-overview', width, height, nodes, edges: [], count: nodes.length, focusId: null }
  }

  private static label(id: string, title: string, description: string, x: number, y: number, width: number, height: number): SceneNode {
    return { id, value: 0, displayValue: title, label: description, x, y, width, height, tone: 'default', opacity: 1 }
  }

  public static create(level: SystemOverviewLevel, previous: Scene | null): Scene {
    const to = this.bounds(level)
    let from = previous?.camera?.to
    if (!from) {
      if (previous?.kind === 'cpu-hardware') from = this.bounds('cpu')
      else if (previous?.kind === 'hardware-component' && previous.regions?.some((region) => region.id === 'hdd-enclosure')) from = this.bounds('hdd')
      else if (previous?.kind === 'hardware-component' && previous.regions?.some((region) => region.id === 'ssd-pcb')) from = this.bounds('ssd')
      else if (previous?.kind === 'hardware-component' && previous.regions?.some((region) => region.id === 'ram-pcb')) from = this.bounds('ram')
      else if (previous) from = to
      else from = level !== 'system' && level !== 'hardware' ? this.bounds('hardware') : this.bounds('system')
    }
    const hardware = this.hardware()
    const cpuScene = CpuLayout.create()
    const server = this.server
    const cpuDetailRange = { startWidth: 850, endWidth: 500 }
    const hddScene = HddLayout.create()
    const ssdScene = SsdLayout.create()
    const ramScene = RamLayout.create()
    const gpuScene = GpuLayout.create()
    const networkAdapterScene = NetworkAdapterLayout.create()
    const busScene = BusLayout.create()
    const scenes = { cpu: cpuScene, hdd: hddScene, ssd: ssdScene, ram: ramScene, gpu: gpuScene, 'network-adapter': networkAdapterScene, bus: busScene }
    const componentScene = level === 'system' || level === 'hardware' ? null : scenes[level]
    const layers: SceneLayer[] = [
      {
        id: 'server-boundary', x: 0, y: 0, scale: 1,
        scene: {
          ...this.scene(2200, 1200),
          regions: [{ id: 'server', label: 'Server', role: 'cpu', level: 'system', x: server.x, y: server.y, width: 1080, height: 1440 * server.scale }],
        },
        conceal: cpuDetailRange,
      },
      { id: 'system', scene: this.system(), x: 0, y: 0, scale: 1, conceal: { startWidth: 1800, endWidth: 1140 } },
      {
        id: 'server-summary', x: server.x, y: server.y, scale: server.scale,
        scene: this.scene(1560, 1440, [this.label('server-summary', 'Server', 'Compute, memory and storage', 780, 670, 960, 380)]),
        conceal: { startWidth: 2000, endWidth: 1250 },
      },
      { id: 'hardware', scene: hardware, ...server, reveal: { startWidth: 1800, endWidth: 1140 }, conceal: cpuDetailRange },
      {
        id: 'cpu-summary', ...server,
        scene: {
          ...this.scene(1560, 1440, [this.label('cpu-summary', 'CPU', 'Processor package / cores and shared components', 405, 440, 520, 160)]),
          regions: [{ id: 'cpu-package', label: 'CPU', role: 'cpu', x: this.cpu.x, y: this.cpu.y, width: this.cpu.size, height: this.cpu.size }],
        },
        reveal: { startWidth: 1800, endWidth: 1140 },
        conceal: cpuDetailRange,
      },
      {
        id: 'cpu-components', scene: cpuScene, ...this.componentPlacement('cpu'),
        reveal: cpuDetailRange,
      },
      {
        id: 'hdd-components', scene: hddScene, ...this.componentPlacement('hdd'),
        reveal: { startWidth: 600, endWidth: 320 },
      },
      {
        id: 'ssd-components', scene: ssdScene, ...this.componentPlacement('ssd'),
        reveal: { startWidth: 600, endWidth: 320 },
      },
      {
        id: 'ram-components', scene: ramScene, ...this.componentPlacement('ram'),
        reveal: { startWidth: 600, endWidth: 320 },
      },
      {
        id: 'gpu-components', scene: gpuScene, ...this.componentPlacement('gpu'),
        reveal: { startWidth: 650, endWidth: 450 },
      },
      {
        id: 'network-adapter-components', scene: networkAdapterScene, ...this.componentPlacement('network-adapter'),
        reveal: { startWidth: 600, endWidth: 320 },
      },
      {
        id: 'bus-components', scene: busScene, ...this.componentPlacement('bus'),
        reveal: { startWidth: 600, endWidth: 160 },
      },
    ]
    const focusedLayers: SceneLayer[] = []
    const focused = componentScene ? `${level}-components` : null
    for (const layer of layers) {
      if (focused && layer.id.endsWith('-components') && layer.id !== focused) continue
      focusedLayers.push(layer)
    }
    return {
      ...this.scene(2200, 1200), camera: { from, to },
      count: componentScene ? componentScene.count : level === 'hardware' ? 7 : 3,
      countLabel: componentScene ? componentScene.countLabel : 'components',
      layers: focusedLayers,
    }
  }

  public static still(scene: Scene | null): Scene | null {
    if (!scene?.camera) return scene
    return { ...scene, camera: { from: scene.camera.to, to: scene.camera.to } }
  }

  private static system(): Scene {
    const nodes = [
      this.label('client', 'Client', 'One user device', 230, 600, 300, 230),
      this.label('network', 'Network', 'Abstract communication layer', 710, 600, 360, 230),
      { ...this.label('server-link', '', '', 1060, 600, 0, 0), opacity: 0 },
    ]
    return {
      ...this.scene(2200, 1200, nodes),
      edges: [
        { id: 'client-network', from: 'client', to: 'network', directed: false, highlighted: false, opacity: 1, label: 'Communication link' },
        { id: 'network-server', from: 'network', to: 'server-link', directed: false, highlighted: false, opacity: 1, label: 'Communication link' },
      ],
    }
  }

  private static hardware(): Scene {
    const components: readonly [string, string, string, number, number, number, number][] = [
      ['ram', 'RAM', 'Main memory', this.ram.x + this.ram.width / 2, this.ram.y + this.ram.height / 2, this.ram.width, this.ram.height],
      ['gpu', 'GPU', 'Graphics / parallel compute', this.gpu.x + this.gpu.width / 2, this.gpu.y + this.gpu.height / 2, this.gpu.width, this.gpu.height],
      ['bus', 'Bus / interconnect', 'Connects processor, memory and devices', this.bus.x + this.bus.width / 2, this.bus.y + this.bus.height / 2, this.bus.width, this.bus.height],
      ['hdd', 'HDD', 'Magnetic storage', this.hdd.x + this.hdd.width / 2, this.hdd.y + this.hdd.height / 2, this.hdd.width, this.hdd.height],
      ['ssd', 'SSD', 'Flash storage', this.ssd.x + this.ssd.width / 2, this.ssd.y + this.ssd.height / 2, this.ssd.width, this.ssd.height],
      ['network-adapter', 'Network Adapter', 'Network connection', this.networkAdapter.x + this.networkAdapter.width / 2, this.networkAdapter.y + this.networkAdapter.height / 2, this.networkAdapter.width, this.networkAdapter.height],
    ]
    const nodes: SceneNode[] = []
    for (const [id, name, description, x, y, width, height] of components) nodes.push(this.label(id, name, description, x, y, width, height))
    return {
      ...this.scene(1560, 1440, nodes),
      paths: [
        { id: 'cpu-bus', d: 'M405 770V855', label: 'CPU to interconnect', highlighted: false },
        { id: 'ram-bus', d: 'M1465 245H1510V905H1465', label: 'RAM to interconnect', highlighted: false },
        { id: 'gpu-bus', d: 'M1145 725V855', label: 'GPU to interconnect', highlighted: false },
        { id: 'hdd-bus', d: 'M285 955V1075', label: 'HDD to interconnect', highlighted: false },
        { id: 'ssd-bus', d: 'M770 955V1075', label: 'SSD to interconnect', highlighted: false },
        { id: 'adapter-bus', d: 'M1255 955V1075', label: 'Network adapter to interconnect', highlighted: false },
      ],
    }
  }
}
