import type { Scene, SceneBounds, SceneNode } from '../../../visualization/Scene.ts'
import { CpuCoreLayout } from '../Hardware/Fundamental/CpuCore/CpuCoreLayout.ts'

type SystemOverviewLevel = 'system' | 'hardware' | 'cpu'

export class SystemOverviewLayout {
  private static readonly server = { x: 1060, y: 100, scale: 1080 / 1560 }
  private static readonly cpu = { x: 75, y: 110, size: 660 }

  private static bounds(level: SystemOverviewLevel): SceneBounds {
    if (level === 'system') return { x: 0, y: 0, width: 2200, height: 1200 }
    const server = this.server
    if (level === 'hardware') return { x: server.x - 30, y: server.y - 30, width: 1140, height: 1060 }
    return {
      x: server.x + (this.cpu.x - 10) * server.scale,
      y: server.y + (this.cpu.y - 10) * server.scale,
      width: (this.cpu.size + 20) * server.scale,
      height: (this.cpu.size + 20) * server.scale,
    }
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
      else if (previous) from = to
      else from = level === 'cpu' ? this.bounds('hardware') : this.bounds('system')
    }
    const hardware = this.hardware()
    const core = CpuCoreLayout.create([], false)
    const coreScene: Scene = {
      ...this.scene(core.width, core.height),
      regions: core.regions,
      count: 17,
      countLabel: 'CPU core components',
    }
    const server = this.server
    const cpuDetailRange = { startWidth: 850, endWidth: 500 }
    return {
      ...this.scene(2200, 1200),
      camera: { from, to },
      count: level === 'cpu' ? 17 : level === 'hardware' ? 7 : 3,
      countLabel: 'components',
      layers: [
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
            ...this.scene(1560, 1440, [this.label('cpu-summary', 'CPU', 'One core / execution and control', 405, 440, 520, 160)]),
            regions: [{ id: 'cpu-package', label: 'CPU', role: 'cpu', x: this.cpu.x, y: this.cpu.y, width: this.cpu.size, height: this.cpu.size }],
          },
          reveal: { startWidth: 1800, endWidth: 1140 },
          conceal: cpuDetailRange,
        },
        {
          id: 'cpu-core', scene: coreScene,
          x: server.x + this.cpu.x * server.scale,
          y: server.y + this.cpu.y * server.scale,
          scale: this.cpu.size / 1560 * server.scale,
          reveal: cpuDetailRange,
        },
      ],
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
      ['ram', 'RAM', 'Main memory', 1145, 245, 640, 240],
      ['gpu', 'GPU', 'Graphics / parallel compute', 1145, 595, 640, 260],
      ['bus', 'Bus / interconnect', 'Connects processor, memory and devices', 770, 905, 1390, 100],
      ['hdd', 'HDD', 'Magnetic storage', 285, 1185, 420, 220],
      ['ssd', 'SSD', 'Flash storage', 770, 1185, 420, 220],
      ['network-adapter', 'Network adapter', 'Network connection', 1255, 1185, 420, 220],
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
