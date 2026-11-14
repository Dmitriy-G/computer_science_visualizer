import type { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { ComponentFlowTrace } from '../ComponentFlowTrace.ts'
import { BusLayout } from './BusLayout.ts'

export class BusLessonTrace extends ComponentFlowTrace {
  constructor() {
    super(BusLayout.diagram(), [
      ['bus-network-adapter-device', 'RX ready'], ['bus-cpu-device', 'waiting'],
      ['bus-ram-device', 'RX posted'], ['bus-ssd-device', '[7] = 0x2E'],
      ['bus-gpu-device', 'idle'], ['bus-hdd-device', 'idle'],
    ])
  }

  protected decorateDiagram(diagram: HardwareDiagram): void {
    // Keep device values below their small boxes, clear of wrapped component titles.
    for (let index = 0; index < diagram.positions.length; index += 1) {
      const position = diagram.positions[index]
      const region = diagram.regions.find((candidate) => `${candidate.id}-state` === position.id)
      if (region) diagram.positions[index] = { ...position, y: region.y + region.height + 22, width: region.width }
    }
  }

  public deviceToFabric(key: 'cpu' | 'network-adapter' | 'ssd', title: string, description: string): void {
    const left = key === 'cpu'
    this.signal(`bus-${key}-external-link`, title, description, !left)
    this.signal(`bus-${key}-port-data`, title, description, !left)
    this.signal(left ? 'bus-cpu-queues' : `bus-switch-${key}`, title, description, !left)
    if (left) this.signal('bus-queues-switch', title, description)
  }

  public fabricToDevice(key: 'cpu' | 'ram' | 'ssd', value: string, title: string, description: string): void {
    const left = key === 'cpu'
    if (left) this.signal('bus-queues-switch', title, description, true)
    this.signal(left ? 'bus-cpu-queues' : `bus-switch-${key}`, title, description, left)
    this.signal(`bus-${key}-port-data`, title, description, left)
    this.transfer(`bus-${key}-external-link`, `bus-${key}-device`, value, title, description, left)
  }

  public ramToFabric(title: string, description: string): void {
    this.signal('bus-ram-external-link', title, description, true)
    this.signal('bus-ram-port-data', title, description, true)
    this.signal('bus-switch-ram', title, description, true)
  }
}
