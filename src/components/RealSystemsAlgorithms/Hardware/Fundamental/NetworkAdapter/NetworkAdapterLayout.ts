import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import type { Scene, SceneRegion } from '../../../../../visualization/Scene.ts'

export class NetworkAdapterLayout {
  public static readonly width = 2600
  public static readonly height = 1400
  public static readonly componentCount = 9

  public static create(): Scene {
    const diagram = this.diagram()
    return {
      kind: 'system-overview', width: diagram.width, height: diagram.height,
      nodes: [], edges: [], regions: diagram.regions, paths: diagram.paths,
      count: this.componentCount, countLabel: 'network adapter component groups', focusId: null,
    }
  }

  public static diagram(): HardwareDiagram {
    const diagram = new HardwareDiagram(this.width, this.height)
    diagram.region('nic-board', 'Network adapter / logical PCIe Ethernet example, not a manufacturer floorplan. Functions can share silicon. USB adapters use a different host interface; Wi-Fi adapters use radio/baseband circuitry and antennas instead of this Ethernet physical connection', 'device', 20, 20, 2560, 1360, 'system', undefined, 'Network adapter / Ethernet example')
      .region('nic-host-connector', 'Host connector / connects the adapter to the computer; PCIe is shown, while some adapters connect through USB or are integrated into the platform', 'interconnect', 60, 600, 260, 220, 'component', 'nic-board', 'PCIe connector')
      .region('nic-controller', 'Network controller / coordinates sending and receiving frames. Host interface, DMA, buffers, MAC, and offload blocks are logical functions and can be integrated into the same controller chip', 'cpu', 400, 160, 1420, 1140, 'component', 'nic-board', 'Network controller')
      .region('nic-firmware', 'Firmware and configuration memory / stores adapter configuration, such as the assigned MAC address, and firmware where supported. Internal or external memory organization varies', 'memory', 440, 300, 520, 150, 'component', 'nic-controller', 'Firmware / configuration memory')
      .region('nic-control', 'Control and queue management / coordinates transmit and receive queues, descriptor processing, device configuration, and completion notifications to the host', 'device', 1100, 300, 680, 150, 'component', 'nic-controller', 'Control / queue management')
      .region('nic-host-interface', 'Host interface / exchanges descriptors, packet data, control requests, and completion notifications with the computer over PCIe', 'interconnect', 440, 600, 260, 220, 'component', 'nic-controller', 'Host interface')
      .region('nic-dma', 'DMA engine / reads transmit data from host memory and writes received data to host memory using driver-provided descriptors; payload transfers avoid CPU copying', 'interconnect', 800, 600, 260, 220, 'component', 'nic-controller', 'DMA engine')
      .region('nic-buffers', 'Packet buffers / temporary on-adapter storage for outgoing and incoming frames; actual queue counts and memory allocation vary', 'memory', 1160, 540, 280, 380, 'component', 'nic-controller', 'Packet buffers')
      .region('nic-tx-buffer', 'Transmit buffer / stages outgoing frame data before MAC transmission', 'memory', 1180, 620, 240, 110, 'component', 'nic-buffers', 'TX / outgoing')
      .region('nic-rx-buffer', 'Receive buffer / holds incoming frame data before DMA delivery to host memory', 'memory', 1180, 760, 240, 110, 'component', 'nic-buffers', 'RX / incoming')
      .region('nic-mac', 'Media Access Control (MAC) / constructs and checks Ethernet frames, handles MAC addressing and frame checksums, and exchanges frame data with the PHY', 'device', 1520, 600, 260, 220, 'component', 'nic-controller', 'MAC / Ethernet frames')
      .region('nic-phy', 'Physical-layer transceiver (PHY) / encodes and decodes physical link signals. Copper uses electrical signaling; optical interfaces add an optical transceiver. The PHY can be integrated with the controller', 'device', 1880, 600, 260, 220, 'component', 'nic-board', 'PHY / link signals')
      .region('nic-network-connection', 'Network connection hardware / Ethernet connector with magnetics for copper, or an optical module and fiber connector for an optical variant. These are alternatives, not mandatory serial stages', 'interconnect', 2280, 600, 260, 220, 'component', 'nic-board', 'Ethernet port / optical module')
      .region('nic-offload', 'Optional offload engines / accelerate supported tasks such as IP/TCP/UDP checksums and transmit segmentation. Capabilities vary; offloads assist packet processing rather than replacing the MAC or PHY', 'device', 800, 1040, 640, 180, 'component', 'nic-controller', 'Checksum / segmentation offloads (optional)')
    this.connect(diagram)
    this.applyColors(diagram)
    return diagram
  }

  private static connect(diagram: HardwareDiagram): void {
    diagram.paths.push(
      { id: 'nic-host-link', d: 'M320 710H440', label: 'PCIe host connection / descriptors, payloads, configuration, and completion notifications', highlighted: false, directed: true, bidirectional: true },
      { id: 'nic-host-dma', d: 'M700 710H800', label: 'DMA reads transmit data from host memory and writes receive data to host memory through the host interface', highlighted: false, directed: true, bidirectional: true },
      { id: 'nic-dma-tx', d: 'M1060 675H1180', label: 'Transmit / DMA stages outgoing data in the TX buffer', highlighted: false, directed: true },
      { id: 'nic-tx-mac', d: 'M1420 675H1520', label: 'Transmit / buffered frame data to the MAC', highlighted: false, directed: true },
      { id: 'nic-mac-phy-tx', d: 'M1780 675H1880', label: 'Transmit / MAC frame data to the PHY', highlighted: false, directed: true, caption: { text: 'TX', x: 1800, y: 655 } },
      { id: 'nic-phy-medium-tx', d: 'M2140 675H2280', label: 'Transmit / PHY signals to the network connection', highlighted: false, directed: true },
      { id: 'nic-medium-phy-rx', d: 'M2280 790H2140', label: 'Receive / incoming link signals to the PHY', highlighted: false, directed: true },
      { id: 'nic-phy-mac-rx', d: 'M1880 790H1780', label: 'Receive / decoded frame data to the MAC', highlighted: false, directed: true, caption: { text: 'RX', x: 1800, y: 840 } },
      { id: 'nic-mac-rx', d: 'M1520 790H1480V815H1420', label: 'Receive / MAC delivers accepted frames to the RX buffer', highlighted: false, directed: true },
      { id: 'nic-rx-dma', d: 'M1180 815H1100V780H1060', label: 'Receive / DMA transfers incoming frame data from the RX buffer into host memory', highlighted: false, directed: true },
      { id: 'nic-config-control', d: 'M960 375H1100', label: 'Firmware and stored configuration used by controller management', highlighted: false, directed: true, bidirectional: true },
      { id: 'nic-host-control', d: 'M570 600V490H1140V450', label: 'Host configuration and queue setup / completion notifications return through the host interface', highlighted: false, directed: true, bidirectional: true },
      { id: 'nic-control-dma', d: 'M1220 450V510H930V600', label: 'Queue and descriptor management controls DMA transfers', highlighted: false, directed: true },
      { id: 'nic-control-mac', d: 'M1640 450V600', label: 'Controller configures MAC operation and link-facing frame handling', highlighted: false, directed: true },
      { id: 'nic-control-phy', d: 'M1780 375H2010V600', label: 'Link management and PHY status / separate from frame payloads', highlighted: false, directed: true, bidirectional: true },
      { id: 'nic-buffer-offload', d: 'M1300 920V1040', label: 'Optional packet processing on buffered data / logical offload branch, not a mandatory serial stage', highlighted: false, directed: true, bidirectional: true },
    )
  }

  private static applyColors(diagram: HardwareDiagram): void {
    for (let index = 0; index < diagram.regions.length; index += 1) {
      const region = diagram.regions[index]
      let color: SceneRegion['color'] = 'light-orange'
      if (region.id === 'nic-board') color = 'neutral'
      else if (region.id === 'nic-controller') color = 'lavender'
      else if (region.role === 'memory') color = region.id === 'nic-firmware' ? 'light-blue' : 'green'
      else if (region.role === 'interconnect') color = 'light-blue'
      diagram.regions[index] = { ...region, color }
    }
  }
}
