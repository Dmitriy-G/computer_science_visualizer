import { HardwareDiagram } from '../../../visualization/HardwareDiagram.ts'
import type { Scene, SceneBounds, ScenePath, SceneRegion } from '../../../visualization/Scene.ts'

type ServerAnchor = readonly [string, 'left' | 'right' | 'top' | 'bottom', number?]
type ServerPoint = readonly [number, number]
type ServerLinkStyle = Pick<ScenePath, 'caption' | 'dashed' | 'stroke' | 'bidirectional'>

export class ServerHardwareLayout {
  public static readonly width = 2240
  public static readonly height = 930
  public static readonly chassis = { x: 400, y: 0, width: 1400, height: 930 }
  public static readonly motherboard = { x: 790, y: 100, width: 620, height: 700 }
  public static readonly componentCount = 15
  private static readonly navigationTargets: Readonly<Record<string, string>> = {
    motherboard: 'hardware-bus', cpu: 'hardware-cpu', gpu: 'hardware-gpu',
    ram: 'hardware-ram', ssd: 'hardware-ssd',
    hdd: 'hardware-hdd', 'network-adapter': 'hardware-network-adapter',
  }
  private static readonly connectorSize = { width: 180, height: 70 }
  private static readonly deviceSize = { width: 300, height: 100 }
  public static readonly components = {
    cpu: { x: 440, y: 180, ...this.deviceSize },
    gpu: { x: 440, y: 500, ...this.deviceSize },
    ram: { x: 1450, y: 180, ...this.deviceSize },
    ssd: { x: 1450, y: 340, ...this.deviceSize },
    hdd: { x: 1450, y: 500, ...this.deviceSize },
    'network-adapter': { x: 1450, y: 660, ...this.deviceSize },
    bus: this.motherboard,
  } as const

  public static create(): Scene {
    const diagram = new HardwareDiagram(this.width, this.height)
    this.region(diagram, 'server-chassis', 'Server / independent compute, memory, expansion-card, storage, and power components attach to a physical motherboard. CPU and RAM are drawn apart from their sockets for clarity; this is a system connection map, not a literal chassis floorplan', 'device', this.chassis, undefined, 'Server', 'neutral', 'system')
    this.region(diagram, 'motherboard', 'Motherboard / simplified connection map showing sockets, slots, storage and USB connectors, and their physical attachments. Chipset, firmware flash, management processors, and their internal links are omitted here; open the motherboard diagram for internal components. CPU, RAM, expansion cards, drives, and PSU remain separate system components', 'memory', this.motherboard, 'server-chassis', 'Motherboard', 'green', 'system')
    this.region(diagram, 'cpu', 'CPU / independent processor package, shown apart from its motherboard socket. Its integrated memory controller directly serves RAM over DDR, and separate CPU PCIe links serve GPU, host NIC and NVMe SSD. Chipset traffic uses a distinct DMI or equivalent uplink', 'cpu', this.components.cpu, 'server-chassis', 'CPU', 'light-orange')
    this.region(diagram, 'ram', 'RAM / independent DIMM modules shown apart from the physical DIMM sockets. DDR connects directly to the integrated memory controller inside the CPU, without passing through PCH', 'memory', this.components.ram, 'server-chassis', 'RAM', 'light-blue')
    this.region(diagram, 'gpu', 'GPU / discrete graphics card attached through its own PCIe motherboard slot. Display output belongs to this card; auxiliary DC power comes from the PSU', 'device', this.components.gpu, 'server-chassis', 'GPU', 'light-orange')
    this.region(diagram, 'network-adapter', 'Network Adapter / independent host Ethernet card with its own PCIe link and Ethernet cable connection. Management interfaces are omitted from this map', 'device', this.components['network-adapter'], 'server-chassis', 'Network Adapter', 'light-blue')
    this.region(diagram, 'cpu-socket', 'CPU socket / passive package attachment carrying separate DDR, PCIe, chipset-link, and power contact groups. Controllers remain inside the CPU package; data and regulated DC power attachments are drawn separately for readability', 'interconnect', { x: 820, y: 195, ...this.connectorSize }, 'motherboard', 'CPU socket', 'light-blue')
    this.region(diagram, 'dimm-sockets', 'DIMM sockets / physical memory-module connectors, with direct DDR PCB traces from CPU socket contacts. No separate motherboard memory controller is shown', 'interconnect', { x: 1200, y: 195, ...this.connectorSize }, 'motherboard', 'DIMM sockets', 'light-blue')
    this.region(diagram, 'gpu-slot', 'GPU PCIe slot / passive motherboard connector for the independent GPU card', 'interconnect', { x: 820, y: 515, ...this.connectorSize }, 'motherboard', 'GPU PCIe slot', 'light-blue')
    this.region(diagram, 'nic-slot', 'Host NIC PCIe slot / passive motherboard connector on an independent CPU PCIe link', 'interconnect', { x: 1200, y: 675, ...this.connectorSize }, 'motherboard', 'NIC PCIe slot', 'light-blue')
    this.region(diagram, 'nvme-connector', 'M.2 NVMe socket / independent CPU PCIe lanes and motherboard DC power contacts attach the single M.2 SSD example. The SSD is shown apart from its socket for clarity; this is not a SATA connection', 'interconnect', { x: 1200, y: 355, ...this.connectorSize }, 'motherboard', 'M.2 socket', 'light-blue')
    this.region(diagram, 'sata-ports', 'SATA ports / physical motherboard connectors served by native PCH SATA. The HDD uses this connection in the illustrated configuration', 'interconnect', { x: 1200, y: 515, ...this.connectorSize }, 'motherboard', 'SATA ports', 'light-blue')
    this.region(diagram, 'host-usb-ports', 'USB ports / physical peripheral connectors served by the PCH USB host controller, separate from management Ethernet', 'interconnect', { x: 820, y: 355, ...this.connectorSize }, 'motherboard', 'USB ports', 'light-blue')
    this.region(diagram, 'psu', 'Power Supply / independent chassis PSU converts external AC to DC. Amber lines show direct feeds to motherboard, GPU auxiliary power, and HDD; the motherboard supplies CPU, DIMM, M.2 SSD, and PCIe slot power through its regulators and contacts', 'device', { x: 440, y: 660, ...this.deviceSize }, 'server-chassis', 'Power Supply (PSU)', 'light-orange')
    this.region(diagram, 'hdd', 'HDD / SATA hard drive connected to the motherboard SATA port and powered from the PSU. SAS drives require a compatible SAS controller, which is not shown', 'device', this.components.hdd, 'server-chassis', 'HDD', 'light-blue')
    this.region(diagram, 'ssd', 'M.2 NVMe SSD / single solid-state drive attached directly to CPU PCIe lanes through the motherboard M.2 socket, bypassing PCH SATA. Power comes through the same socket, without a separate PSU cable. The drive is drawn apart from the socket for clarity; other SSD form factors can use separate power connections', 'device', this.components.ssd, 'server-chassis', 'SSD', 'light-blue')
    this.connectData(diagram)
    this.connectPower(diagram)
    this.connectExternal(diagram)
    return { kind: 'system-overview', width: this.width, height: this.height, nodes: [], edges: [], regions: diagram.regions, paths: diagram.paths, count: this.componentCount, countLabel: 'server component groups', focusId: null }
  }

  private static region(diagram: HardwareDiagram, id: string, label: string, role: SceneRegion['role'], bounds: SceneBounds, parent: string | undefined, title: string, color: SceneRegion['color'], level: SceneRegion['level'] = 'component'): void {
    diagram.regions.push({ id, label, shortLabel: title, role, ...bounds, parentId: parent, color, level, titleFontSize: parent === 'motherboard' ? 20 : undefined, navigationTarget: this.navigationTargets[id] })
  }

  private static connectData(diagram: HardwareDiagram): void {
    this.link(diagram, 'cpu-socket-attachment', ['cpu', 'right'], ['cpu-socket', 'left'], 'CPU package contacts / electrical attachment to its motherboard socket')
    this.link(diagram, 'dimm-ram', ['dimm-sockets', 'right'], ['ram', 'left'], 'DDR module attachment / physical DIMM sockets to the independently shown RAM modules')
    this.link(diagram, 'gpu-slot-card', ['gpu-slot', 'left'], ['gpu', 'right'], 'PCIe slot / physical GPU card attachment')
    this.link(diagram, 'nic-slot-card', ['nic-slot', 'right'], ['network-adapter', 'left'], 'PCIe slot / physical host NIC card attachment')
    this.link(diagram, 'nvme-ssd', ['nvme-connector', 'right'], ['ssd', 'left'], 'Direct PCIe / NVMe SSD connection, bypassing PCH SATA', [], { stroke: '#5279ad' })
    this.link(diagram, 'pch-sata-hdd', ['sata-ports', 'right'], ['hdd', 'left'], 'SATA / motherboard native SATA port to the HDD', [], { stroke: '#3f8068' })
  }

  private static connectPower(diagram: HardwareDiagram): void {
    const power: ServerLinkStyle = { bidirectional: false, stroke: '#b58a45' }
    this.link(diagram, 'psu-motherboard', ['psu', 'right'], ['motherboard', 'left', 61 / 70], 'DC power / PSU to motherboard regulation, CPU/DIMM sockets, and slot power', [], power)
    this.link(diagram, 'psu-gpu', ['psu', 'top'], ['gpu', 'bottom'], 'GPU auxiliary DC power / PSU to graphics card; slot power comes from motherboard', [], power)
    this.link(diagram, 'psu-hdd', ['psu', 'bottom', 0.2], ['hdd', 'right', 0.8], 'HDD DC power / PSU to drive', [[500, 900], [1780, 900], [1780, 580]], power)
    this.link(diagram, 'socket-cpu-power', ['cpu-socket', 'left', 6 / 7], ['cpu', 'right', 0.75], 'CPU DC power / PSU CPU-power input to motherboard voltage regulators, then through CPU socket power contacts to the processor', [], power)
    this.link(diagram, 'dimm-ram-power', ['dimm-sockets', 'right', 6 / 7], ['ram', 'left', 0.75], 'RAM DC power / motherboard supply through DIMM socket power contacts to the memory modules', [], power)
    this.link(diagram, 'slot-gpu-power', ['gpu-slot', 'left', 6 / 7], ['gpu', 'right', 0.75], 'GPU slot DC power / motherboard supply through PCIe slot power contacts; separate from the auxiliary PSU cable', [], power)
    this.link(diagram, 'slot-nic-power', ['nic-slot', 'right', 6 / 7], ['network-adapter', 'left', 0.75], 'Network Adapter DC power / motherboard supply through PCIe slot power contacts to the Ethernet card', [], power)
    this.link(diagram, 'socket-ssd-power', ['nvme-connector', 'right', 6 / 7], ['ssd', 'left', 0.75], 'M.2 SSD DC power / motherboard supply through M.2 socket power contacts; no separate PSU cable in this example', [], power)
  }

  private static connectExternal(diagram: HardwareDiagram): void {
    const outputs: readonly [string, ServerAnchor, number, string, string, boolean, 'left' | 'right'][] = [
      ['external-display', ['gpu', 'left'], 550, 'HDMI / DisplayPort', 'GPU display output to an external monitor', false, 'left'],
      ['external-usb', ['host-usb-ports', 'left'], 390, 'USB', 'Motherboard USB port connection to an external peripheral', true, 'left'],
      ['external-lan', ['network-adapter', 'right'], 710, 'LAN / Ethernet', 'Independent host NIC Ethernet connection to the data network', true, 'right'],
    ]
    for (const [id, from, y, title, label, bidirectional, side] of outputs) {
      const start = this.anchor(diagram, from)
      const endX = side === 'left' ? 20 : 2190
      const captionX = side === 'left' ? 40 : 1840
      diagram.paths.push({ id, d: this.route(start, [endX, y]), label, caption: { text: title, x: captionX, y: y - 22 }, directed: true, bidirectional, highlighted: false })
    }
    diagram.paths.push({
      id: 'external-ac-power', d: this.route([20, 710], this.anchor(diagram, ['psu', 'left'])),
      label: 'AC power input to the independent PSU / AC is converted to DC before reaching motherboard, GPU, or drives',
      caption: { text: 'AC power', x: 40, y: 688 }, directed: true, stroke: '#b58a45', highlighted: false,
    })
  }

  private static anchor(diagram: HardwareDiagram, anchor: ServerAnchor): ServerPoint {
    const [id, side, fraction = 0.5] = anchor
    const region = diagram.regions.find((candidate) => candidate.id === id)
    if (!region || fraction < 0 || fraction > 1) throw new RangeError(`Invalid server connection anchor: ${id}`)
    if (side === 'left' || side === 'right') return [region.x + (side === 'right' ? region.width : 0), region.y + region.height * fraction]
    return [region.x + region.width * fraction, region.y + (side === 'bottom' ? region.height : 0)]
  }

  private static route(from: ServerPoint, to: ServerPoint, via: readonly ServerPoint[] = []): string {
    let [x, y] = from
    let d = `M${x} ${y}`
    for (const point of [...via, to]) {
      if (x !== point[0]) d += `H${point[0]}`
      if (y !== point[1]) d += `V${point[1]}`
      x = point[0]
      y = point[1]
    }
    return d
  }

  private static link(diagram: HardwareDiagram, id: string, from: ServerAnchor, to: ServerAnchor, label: string, via: readonly ServerPoint[] = [], style: ServerLinkStyle = {}): void {
    diagram.paths.push({ id, d: this.route(this.anchor(diagram, from), this.anchor(diagram, to), via), label, directed: true, bidirectional: true, highlighted: false, ...style })
  }
}
