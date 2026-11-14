import type { Scene, SceneBounds, SceneLayer, SceneNode } from '../../../visualization/Scene.ts'
import { CpuLayout } from '../Hardware/Fundamental/Cpu/CpuLayout.ts'
import { HddLayout } from '../Hardware/Fundamental/Hdd/HddLayout.ts'
import { SsdLayout } from '../Hardware/Fundamental/Ssd/SsdLayout.ts'
import { RamLayout } from '../Hardware/Fundamental/Ram/RamLayout.ts'
import { GpuLayout } from '../Hardware/Fundamental/Gpu/GpuLayout.ts'
import { NetworkAdapterLayout } from '../Hardware/Fundamental/NetworkAdapter/NetworkAdapterLayout.ts'
import { BusLayout } from '../Hardware/Fundamental/Bus/BusLayout.ts'
import { ServerHardwareLayout } from './ServerHardwareLayout.ts'

type SystemOverviewComponent = 'cpu' | 'hdd' | 'ssd' | 'ram' | 'gpu' | 'network-adapter' | 'bus'
type SystemOverviewLevel = 'system' | 'hardware' | SystemOverviewComponent

export class SystemOverviewLayout {
  private static readonly width = 2500
  private static readonly server = { x: 1060, y: 100, scale: 1080 / ServerHardwareLayout.chassis.width }
  private static readonly layouts = {
    cpu: CpuLayout, hdd: HddLayout, ssd: SsdLayout, ram: RamLayout,
    gpu: GpuLayout, 'network-adapter': NetworkAdapterLayout, bus: BusLayout,
  }

  private static componentPlacement(level: SystemOverviewComponent): { x: number, y: number, scale: number } {
    const device = level === 'bus' ? ServerHardwareLayout.motherboard : ServerHardwareLayout.components[level]
    const layout = this.layouts[level]
    const scale = Math.min(device.width / layout.width, device.height / layout.height)
    return {
      x: this.server.x + (device.x + (device.width - layout.width * scale) / 2) * this.server.scale,
      y: this.server.y + (device.y + (device.height - layout.height * scale) / 2) * this.server.scale,
      scale: scale * this.server.scale,
    }
  }

  private static bounds(level: SystemOverviewLevel): SceneBounds {
    if (level === 'system') return { x: 0, y: 0, width: this.width, height: 1200 }
    const server = this.server
    if (level === 'hardware') return { x: server.x - 30, y: server.y - 30, width: ServerHardwareLayout.width * server.scale + 60, height: ServerHardwareLayout.height * server.scale + 60 }
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
    const hardware = ServerHardwareLayout.create()
    const hardwareWidth = this.bounds('hardware').width
    const cpuScene = CpuLayout.create()
    const server = this.server
    const cpuDetailRange = { startWidth: 850, endWidth: 500 }
    const motherboardPreview = level === 'bus' || previous?.countLabel === 'motherboard component groups'
    const hardwareConceal = motherboardPreview ? { startWidth: hardwareWidth, endWidth: 720 } : cpuDetailRange
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
          ...this.scene(this.width, 1200),
          regions: [{ id: 'server', label: 'Server', role: 'cpu', level: 'system', x: server.x, y: server.y, width: 1080, height: 1440 * server.scale }],
        },
        conceal: hardwareConceal,
      },
      { id: 'system', scene: this.system(), x: 0, y: 0, scale: 1, conceal: { startWidth: 1800, endWidth: hardwareWidth } },
      {
        id: 'server-summary', x: server.x, y: server.y, scale: server.scale,
        scene: this.scene(1560, 1440, [this.label('server-summary', 'Server', 'Compute, memory and storage', 780, 670, 960, 380)]),
        conceal: { startWidth: 2000, endWidth: hardwareWidth },
      },
      { id: 'hardware', scene: hardware, ...server, reveal: { startWidth: 1800, endWidth: hardwareWidth }, conceal: hardwareConceal },
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
        reveal: { startWidth: hardwareWidth, endWidth: 720 },
      },
    ]
    const focusedLayers: SceneLayer[] = []
    const focused = componentScene ? `${level}-components` : null
    for (const layer of layers) {
      if (focused && layer.id.endsWith('-components') && layer.id !== focused) continue
      if (layer.id === 'bus-components' && !motherboardPreview) continue
      focusedLayers.push(layer)
    }
    return {
      ...this.scene(this.width, 1200), camera: { from, to },
      count: componentScene ? componentScene.count : level === 'hardware' ? hardware.count : 3,
      countLabel: componentScene ? componentScene.countLabel : level === 'hardware' ? hardware.countLabel : 'components',
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
      ...this.scene(this.width, 1200, nodes),
      edges: [
        { id: 'client-network', from: 'client', to: 'network', directed: false, highlighted: false, opacity: 1, label: 'Communication link' },
        { id: 'network-server', from: 'network', to: 'server-link', directed: false, highlighted: false, opacity: 1, label: 'Communication link' },
      ],
    }
  }

}
