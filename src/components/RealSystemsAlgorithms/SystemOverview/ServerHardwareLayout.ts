import { HardwareDiagram } from '../../../visualization/HardwareDiagram.ts'
import type { Scene, SceneBounds, ScenePath, SceneRegion } from '../../../visualization/Scene.ts'

type ServerAnchor = readonly [string, 'left' | 'right' | 'top' | 'bottom', number?]
type ServerPoint = readonly [number, number]
type ServerLinkStyle = Pick<ScenePath, 'caption' | 'dashed' | 'stroke' | 'bidirectional'>

export class ServerHardwareLayout {
  public static readonly width = 2320
  public static readonly height = 1440
  public static readonly chassis = { x: 0, y: 0, width: 1800, height: 1440 }
  public static readonly motherboard = { x: 450, y: 400, width: 940, height: 720 }
  public static readonly componentCount = 19
  private static readonly navigationTargets: Readonly<Record<string, string>> = {
    motherboard: 'hardware-bus', cpu: 'hardware-cpu', gpu: 'hardware-gpu',
    ram: 'hardware-ram', ssd: 'hardware-ssd', 'sata-ssd': 'hardware-ssd',
    hdd: 'hardware-hdd', 'network-adapter': 'hardware-network-adapter',
  }
  public static readonly components = {
    cpu: { x: 50, y: 170, width: 340, height: 300 },
    ram: { x: 500, y: 130, width: 600, height: 180 },
    gpu: { x: 1440, y: 130, width: 300, height: 190 },
    'network-adapter': { x: 1440, y: 420, width: 300, height: 150 },
    bus: this.motherboard,
    hdd: { x: 1440, y: 1020, width: 300, height: 100 },
    ssd: { x: 1380, y: 1230, width: 360, height: 140 },
  } as const

  public static create(): Scene {
    const diagram = new HardwareDiagram(this.width, this.height)
    this.region(diagram, 'server-chassis', 'Server / independent compute, memory, expansion-card, storage, and power components attach to a physical motherboard. CPU and RAM are drawn apart from their sockets for clarity; this is a system connection map, not a literal chassis floorplan', 'device', this.chassis, undefined, 'Server', 'neutral', 'system')
    this.region(diagram, 'motherboard', 'Motherboard / simplified connection map showing sockets, slots, storage and USB connectors, and the dedicated management LAN port. Chipset, firmware flash, management processors, and their internal links are omitted here; open the motherboard diagram for internal components. CPU, RAM, expansion cards, drives, and PSU remain separate system components', 'memory', this.motherboard, 'server-chassis', 'Motherboard', 'green', 'system')
    this.region(diagram, 'cpu', 'CPU / independent processor package, shown apart from its motherboard socket. Its integrated memory controller directly serves RAM over DDR, and separate CPU PCIe links serve GPU, host NIC, NVMe SSD, and the storage-controller card. Chipset traffic uses a distinct DMI or equivalent uplink', 'cpu', this.components.cpu, 'server-chassis', 'CPU', 'light-orange')
    this.region(diagram, 'ram', 'RAM / independent DIMM modules shown apart from the physical DIMM sockets. DDR connects directly to the integrated memory controller inside the CPU, without passing through PCH', 'memory', this.components.ram, 'server-chassis', 'RAM', 'light-blue')
    this.region(diagram, 'gpu', 'GPU / discrete graphics card attached through its own PCIe motherboard slot. Display output belongs to this card; auxiliary DC power comes from the PSU', 'device', this.components.gpu, 'server-chassis', 'GPU', 'light-orange')
    this.region(diagram, 'network-adapter', 'Network Adapter / independent host Ethernet card with its own PCIe link and Ethernet cable connection. The dedicated BMC network interface is separate', 'device', this.components['network-adapter'], 'server-chassis', 'Network Adapter', 'light-blue')
    this.region(diagram, 'cpu-socket', 'CPU socket / passive package attachment carrying separate DDR, PCIe, chipset-link, and power contact groups. Controllers remain inside the CPU package; the single package-to-socket attachment groups those contacts for readability', 'interconnect', { x: 500, y: 470, width: 280, height: 160 }, 'motherboard', 'CPU socket', 'light-blue')
    this.region(diagram, 'dimm-sockets', 'DIMM sockets / physical memory-module connectors, with direct DDR PCB traces from CPU socket contacts. No separate motherboard memory controller is shown', 'interconnect', { x: 1020, y: 470, width: 320, height: 100 }, 'motherboard', 'DIMM sockets', 'light-blue')
    this.region(diagram, 'gpu-slot', 'GPU PCIe slot / passive motherboard connector for the independent GPU card', 'interconnect', { x: 1020, y: 650, width: 320, height: 70 }, 'motherboard', 'GPU PCIe slot', 'light-blue')
    this.region(diagram, 'nic-slot', 'Host NIC PCIe slot / passive motherboard connector on an independent CPU PCIe link', 'interconnect', { x: 1020, y: 750, width: 320, height: 70 }, 'motherboard', 'NIC PCIe slot', 'light-blue')
    this.region(diagram, 'hba-slot', 'Storage-controller PCIe slot / physical motherboard attachment for the separately drawn optional RAID/HBA card', 'interconnect', { x: 1020, y: 850, width: 320, height: 70 }, 'motherboard', 'RAID / HBA slot', 'light-blue')
    this.region(diagram, 'nvme-connector', 'NVMe storage connector / independent CPU PCIe lanes attach the cabled NVMe SSD drive-bay example. Connector families and backplanes vary; this is not a SATA connection', 'interconnect', { x: 1020, y: 940, width: 320, height: 60 }, 'motherboard', 'NVMe connector', 'light-blue')
    this.region(diagram, 'sata-ports', 'SATA ports / physical motherboard connectors served by native PCH SATA. The SATA SSD uses this path, while the HDD uses the separate RAID/HBA in the illustrated configuration', 'interconnect', { x: 500, y: 850, width: 180, height: 70 }, 'motherboard', 'SATA ports', 'light-blue')
    this.region(diagram, 'host-usb-ports', 'USB ports / physical peripheral connectors served by the PCH USB host controller, separate from management Ethernet', 'interconnect', { x: 500, y: 1020, width: 180, height: 70 }, 'motherboard', 'USB ports', 'light-blue')
    this.region(diagram, 'management-lan-port', 'Management LAN port / dedicated physical management Ethernet connection, separate from the host Network Adapter. Its BMC and NIC/PHY are omitted from this overview; shared-host-NIC management is another platform arrangement', 'interconnect', { x: 1020, y: 1020, width: 320, height: 70 }, 'motherboard', 'Management LAN port', 'light-blue')
    this.region(diagram, 'raid-hba', 'RAID / HBA / optional independent PCIe storage-controller card. Its SATA/SAS link serves the HDD here; a SATA HDD can instead use native PCH SATA in a different configuration. The native SATA SSD and direct NVMe SSD do not pass through this card', 'device', { x: 1440, y: 800, width: 300, height: 150 }, 'server-chassis', 'RAID / HBA (optional)', 'light-orange')
    this.region(diagram, 'psu', 'Power Supply / independent chassis PSU converts external AC to DC. Dashed lines simplify DC distribution to motherboard, GPU, and drives; slot power and CPU/DIMM regulation are supplied through the motherboard', 'device', { x: 50, y: 1230, width: 340, height: 140 }, 'server-chassis', 'Power Supply (PSU)', 'light-orange')
    this.region(diagram, 'hdd', 'HDD / actual SATA/SAS hard drive, connected to the optional RAID/HBA in this configuration and powered from the PSU. A native PCH SATA connection is another supported configuration, not a simultaneous second controller attachment', 'device', this.components.hdd, 'server-chassis', 'HDD', 'neutral')
    this.region(diagram, 'sata-ssd', 'SATA SSD / actual solid-state drive attached to native PCH SATA through the motherboard SATA connector. This is a separate device from the NVMe SSD', 'device', { x: 940, y: 1230, width: 360, height: 140 }, 'server-chassis', 'SATA SSD', 'neutral')
    this.region(diagram, 'ssd', 'NVMe SSD / actual cabled PCIe drive-bay device attached directly to CPU PCIe lanes through the motherboard NVMe connector, bypassing the SATA/SAS RAID/HBA and PCH SATA', 'device', this.components.ssd, 'server-chassis', 'NVMe SSD', 'neutral')
    this.connectData(diagram)
    this.connectPower(diagram)
    this.connectExternal(diagram)
    return { kind: 'system-overview', width: this.width, height: this.height, nodes: [], edges: [], regions: diagram.regions, paths: diagram.paths, count: this.componentCount, countLabel: 'server component groups', focusId: null }
  }

  private static region(diagram: HardwareDiagram, id: string, label: string, role: SceneRegion['role'], bounds: SceneBounds, parent: string | undefined, title: string, color: SceneRegion['color'], level: SceneRegion['level'] = 'component'): void {
    diagram.regions.push({ id, label, shortLabel: title, role, ...bounds, parentId: parent, color, level, titleFontSize: parent === 'motherboard' ? 20 : undefined, navigationTarget: this.navigationTargets[id] })
  }

  private static connectData(diagram: HardwareDiagram): void {
    this.link(diagram, 'cpu-socket-attachment', ['cpu', 'right'], ['cpu-socket', 'left'], 'CPU package contacts / electrical attachment to its motherboard socket', [[420, 320], [420, 550]])
    this.link(diagram, 'dimm-ram', ['dimm-sockets', 'top'], ['ram', 'bottom'], 'DDR module attachment / physical DIMM sockets to the independently shown RAM modules', [[1180, 350], [800, 350]])
    this.link(diagram, 'gpu-slot-card', ['gpu-slot', 'right'], ['gpu', 'left'], 'PCIe slot / physical GPU card attachment', [[1410, 685], [1410, 225]])
    this.link(diagram, 'nic-slot-card', ['nic-slot', 'right'], ['network-adapter', 'left'], 'PCIe slot / physical host NIC card attachment', [[1420, 785], [1420, 495]])
    this.link(diagram, 'hba-slot-card', ['hba-slot', 'right'], ['raid-hba', 'left', 17 / 30], 'PCIe slot / physical attachment of optional RAID/HBA card')
    this.link(diagram, 'nvme-ssd', ['nvme-connector', 'right'], ['ssd', 'top'], 'Direct PCIe / NVMe SSD connection, bypassing the SATA/SAS controller', [[1410, 970], [1410, 1190], [1560, 1190]], { stroke: '#5279ad' })
    this.link(diagram, 'pch-sata-ssd', ['sata-ports', 'bottom'], ['sata-ssd', 'top'], 'SATA / motherboard native SATA port to actual SATA SSD; a SATA HDD may use another native port in the same way', [[590, 1000], [920, 1000], [920, 1190], [1120, 1190]], { stroke: '#3f8068' })
    this.link(diagram, 'raid-hdd', ['raid-hba', 'bottom'], ['hdd', 'top'], 'SATA / SAS / optional RAID/HBA to the actual HDD; a compatible SATA/SAS SSD may use this controller path instead. Alternative PCH SATA attachment is not drawn simultaneously', [], { stroke: '#9369a6', caption: { text: 'SATA / SAS', x: 1450, y: 995 } })
  }

  private static connectPower(diagram: HardwareDiagram): void {
    const power: ServerLinkStyle = { dashed: true, bidirectional: false, stroke: '#b58a45' }
    this.link(diagram, 'psu-motherboard', ['psu', 'top'], ['motherboard', 'bottom', 0.1], 'DC power / PSU to motherboard regulation, CPU/DIMM sockets, and slot power', [[220, 1160], [544, 1160]], power)
    this.link(diagram, 'psu-gpu', ['psu', 'bottom', 0.8], ['gpu', 'right', 0.8], 'GPU auxiliary DC power / PSU to graphics card; slot power comes from motherboard', [[322, 1410], [1760, 1410], [1760, 282]], power)
    this.link(diagram, 'psu-hdd', ['psu', 'bottom', 0.35], ['hdd', 'right'], 'HDD DC power / PSU to drive', [[169, 1390], [1780, 1390], [1780, 1070]], power)
    this.link(diagram, 'psu-sata-ssd', ['psu', 'bottom'], ['sata-ssd', 'bottom'], 'SATA SSD DC power / PSU to drive', [[220, 1400], [1120, 1400]], power)
    this.link(diagram, 'psu-ssd', ['psu', 'bottom', 0.65], ['ssd', 'bottom'], 'NVMe SSD DC power / PSU to drive bay', [[271, 1420], [1560, 1420]], power)
  }

  private static connectExternal(diagram: HardwareDiagram): void {
    const outputs: readonly [string, ServerAnchor, number, string, string, boolean, (readonly ServerPoint[])?][] = [
      ['external-display', ['gpu', 'right'], 225, 'HDMI / DisplayPort', 'GPU display output to an external monitor', false],
      ['external-lan', ['network-adapter', 'right'], 495, 'LAN / Ethernet', 'Independent host NIC Ethernet connection to the data network', true],
      ['external-usb', ['host-usb-ports', 'right'], 650, 'USB', 'Motherboard USB port connection to an external peripheral', true, [[700, 1055], [700, 1140], [1810, 1140], [1810, 650]]],
      ['external-management-lan', ['management-lan-port', 'right'], 1055, 'Management LAN', 'Separate dedicated BMC management Ethernet connection', true, [[1370, 1055], [1370, 1130], [1830, 1130], [1830, 1055]]],
    ]
    for (const [id, from, y, title, label, bidirectional, via = []] of outputs) {
      const start = this.anchor(diagram, from)
      diagram.paths.push({ id, d: this.route(start, [2270, y], via), label, caption: { text: title, x: 1840, y: y - 22 }, directed: true, bidirectional, highlighted: false })
    }
    diagram.paths.push({
      id: 'external-ac-power', d: this.route([2270, 1180], this.anchor(diagram, ['psu', 'right']), [[410, 1180], [410, 1300]]),
      label: 'AC power input to the independent PSU / AC is converted to DC before reaching motherboard, GPU, or drives',
      caption: { text: 'AC power', x: 1840, y: 1158 }, directed: true, dashed: true, stroke: '#b58a45', highlighted: false,
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
