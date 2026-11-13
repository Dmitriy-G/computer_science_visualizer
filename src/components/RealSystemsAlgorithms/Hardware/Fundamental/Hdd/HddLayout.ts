import type { Scene, SceneNode } from '../../../../../visualization/Scene.ts'

export class HddLayout {
  public static create(): Scene {
    const components: readonly [string, string, string, number, number, number][] = [
      ['platters', 'Platters', 'Magnetic data storage', 280, 220, 380],
      ['spindle-motor', 'Spindle and motor', 'Rotate the platters', 280, 490, 380],
      ['filters', 'Internal filters', 'Capture particles', 280, 760, 380],
      ['heads', 'Read/write heads', 'Read and write magnetic data', 750, 220, 380],
      ['arms', 'Actuator arms', 'Carry the heads across the platters', 750, 490, 380],
      ['actuator', 'Voice-coil actuator', 'Positions the actuator arms', 750, 760, 380],
      ['controller', 'Controller', 'Controls commands and drive operations', 1280, 220, 420],
      ['cache', 'Cache / buffer', 'Temporarily holds transfer data', 1280, 490, 420],
      ['connectors', 'Data and power connectors', 'Host connection and power supply', 1280, 760, 420],
    ]
    const nodes: SceneNode[] = []
    for (const [id, title, description, x, y, width] of components) {
      nodes.push({ id, value: 0, displayValue: title, label: description, x, y, width, height: 140, tone: 'default', opacity: 1 })
    }
    return {
      kind: 'system-overview', width: 1560, height: 1000,
      nodes, edges: [], count: nodes.length, countLabel: 'HDD component groups', focusId: null,
      regions: [
        { id: 'hdd-enclosure', label: 'HDD / protective enclosure and mechanical assembly', role: 'memory', level: 'system', x: 20, y: 20, width: 970, height: 960 },
        { id: 'hdd-electronics', label: 'Controller board (PCB) and connectors', role: 'observer', level: 'system', x: 1020, y: 20, width: 520, height: 960 },
      ],
    }
  }
}
