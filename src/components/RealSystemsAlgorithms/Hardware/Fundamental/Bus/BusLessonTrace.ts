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
    if (key === 'cpu') {
      this.signal('bus-cpu-external-link', title, description)
      return
    }
    this.signal(`bus-${key}-external-link`, title, description, true)
    this.signal(`bus-${key}-direct`, title, description, true)
  }

  public fabricToDevice(key: 'ram' | 'ssd', value: string, title: string, description: string): void {
    if (key === 'ram') {
      this.signal('bus-ram-port-data', title, description)
    } else {
      this.signal('bus-ssd-direct', title, description)
    }
    this.transfer(`bus-${key}-external-link`, `bus-${key}-device`, value, title, description)
  }

  public ramToFabric(title: string, description: string): void {
    this.signal('bus-ram-external-link', title, description, true)
    this.signal('bus-ram-port-data', title, description, true)
  }

  public cpuToRam(value: string, title: string, description: string): void {
    this.signal('bus-cpu-external-link', title, description)
    this.signal('bus-ram-port-data', title, description)
    this.transfer('bus-ram-external-link', 'bus-ram-device', value, title, description)
  }

  public ramToCpu(value: string, title: string, description: string): void {
    this.signal('bus-ram-external-link', title, description, true)
    this.signal('bus-ram-port-data', title, description, true)
    this.transfer('bus-cpu-external-link', 'bus-cpu-device', value, title, description, true)
  }
}
