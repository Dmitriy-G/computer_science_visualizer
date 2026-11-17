import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { HardwareWireCrossings } from '../../../../../visualization/HardwareWireCrossings.ts'
import type { Scene, ScenePath, SceneRegion } from '../../../../../visualization/Scene.ts'

type BusAnchor = readonly [string, 'left' | 'right' | 'top' | 'bottom', number?]
type BusPoint = readonly [number, number]
type BusLinkStyle = Pick<ScenePath, 'caption' | 'dashed' | 'stroke' | 'bidirectional'>

export class BusLayout {
  public static readonly width = 2840
  public static readonly height = 1680
  public static readonly componentCount = 15
  private static readonly navigationTargets: Readonly<Record<string, string>> = {
    'bus-cpu-device': 'hardware-cpu', 'bus-gpu-device': 'hardware-gpu',
    'bus-ram-device': 'hardware-ram', 'bus-hdd-device': 'hardware-hdd',
    'bus-ssd-device': 'hardware-ssd', 'bus-network-adapter-device': 'hardware-network-adapter',
  }

  public static create(): Scene {
    const diagram = this.diagram()
    return {
      kind: 'system-overview', width: diagram.width, height: diagram.height,
      nodes: [], edges: [], regions: diagram.regions, paths: diagram.paths,
      count: this.componentCount, countLabel: 'motherboard component groups', focusId: null,
    }
  }

  public static diagram(): HardwareDiagram {
    const diagram = new HardwareDiagram(this.width, this.height)
    diagram.region('bus-motherboard', 'Motherboard / connection map of passive CPU and DIMM sockets, expansion slots, storage ports, chipset, and power distribution. CPU internals are abstracted by the compact external CPU reference. The PCB routing area contains individual physical signal traces; active protocol processing stays inside the CPU, chipset, and connected devices', 'memory', 300, 40, 2240, 1600, 'system', undefined, 'Motherboard')
    this.addConnectors(diagram)
    this.addSignalRouting(diagram)
    this.addPlatform(diagram)
    this.connectData(diagram)
    this.connectPlatform(diagram)
    this.connectSupport(diagram)
    this.connectPower(diagram)
    const paths = HardwareWireCrossings.create(diagram.paths)
    for (let index = 0; index < paths.length; index += 1) diagram.paths[index] = paths[index]
    this.applyColors(diagram)
    return diagram
  }

  private static addConnectors(diagram: HardwareDiagram): void {
    diagram.region('bus-cpu-device', 'CPU / installed processor shown as a compact external reference. Its controllers, cores, caches, and internal memory-system behavior are abstracted', 'device', 20, 190, 240, 100, 'component', undefined, 'CPU')
      .region('bus-cpu-port', 'CPU socket / passive motherboard connector with separate PCIe lane groups, DDR, chipset-link, and power contacts. Controllers remain inside the external CPU', 'interconnect', 340, 120, 360, 660, 'component', 'bus-motherboard', 'CPU socket / contacts')
    const contacts: readonly [string, string, number][] = [
      ['gpu', 'PCIe / GPU', 210], ['ssd', 'PCIe / NVMe', 290],
      ['network-adapter', 'PCIe / NIC', 370],
      ['chipset', 'DMI / chipset', 450], ['ddr', 'DDR memory', 530],
      ['power', 'CPU DC power', 610], ['control', 'Clock / reset', 690],
    ]
    for (const [key, title, y] of contacts) diagram.region(`bus-cpu-${key}-contacts`, `${title} / separate passive CPU socket contact group. Protocol controllers remain inside the CPU`, 'interconnect', 365, y, 310, 60, 'component', 'bus-cpu-port', title)
    this.connector(diagram, 'gpu', 'GPU', 'PCIe x16 slot', 810, 'PCIe / edge contacts', 'Mechanical x16 expansion slot; electrical lane width is platform-specific. The GPU protocol controller stays on the card', true)
    this.connector(diagram, 'ram', 'RAM', 'DIMM socket', 120, 'DDR / module contacts', 'DDR traces connect directly to CPU socket memory contacts, bypassing PCIe and PCH. The socket contains no memory controller')
    this.connector(diagram, 'hdd', 'HDD', 'SATA data port', 350, 'SATA signal contacts', 'SATA cable to the HDD; the host controller is in PCH and drive electronics stay inside the HDD. Drive power is supplied separately by the PSU')
    this.connector(diagram, 'ssd', 'SSD', 'M.2 M-key socket', 580, 'PCIe x4 contacts', 'NVMe SSD example wired for PCIe. M.2 SATA support depends on socket and device. The NVMe controller stays on the SSD')
    this.connector(diagram, 'network-adapter', 'Network Adapter', 'PCIe NIC slot', 810, 'PCIe / edge contacts', 'Separate Ethernet card; protocol, DMA, MAC, PHY, and Ethernet cable connector stay on the card')
  }

  private static connector(diagram: HardwareDiagram, key: string, name: string, title: string, y: number, contacts: string, description: string, left = false): void {
    const x = left ? 340 : 2120
    diagram.region(`bus-${key}-device`, `${name} / compact external component reference. ${description}`, 'device', left ? 20 : 2580, y + 60, 240, 100, 'component', undefined, name)
      .region(`bus-${key}-port`, `${title} / passive motherboard connector. ${description}`, 'interconnect', x, y, left ? 360 : 340, 180, 'component', 'bus-motherboard', title)
      .region(`bus-${key}-link`, `${contacts} / passive electrical contacts, not controller circuitry`, 'interconnect', x + 25, y + 70, left ? 310 : 290, 80, 'component', `bus-${key}-port`, contacts)
  }

  private static addSignalRouting(diagram: HardwareDiagram): void {
    diagram.region('bus-fabric', 'PCB traces / signal routing / physical copper connections between CPU socket contacts and device connectors. PCIe lane groups remain separate point-to-point links. The outline identifies a routing area, not a chip or controller. Trace crossings on different PCB layers do not imply electrical junctions', 'interconnect', 820, 140, 1100, 820, 'component', 'bus-motherboard', 'PCB traces / signal routing')
  }

  private static addPlatform(diagram: HardwareDiagram): void {
    diagram.region('bus-clock-reset', 'Clock generator / buffer / physical motherboard reference-clock generation and distribution circuitry. CPU, chipset, and PCIe devices receive their appropriate reference clocks on distinct traces; output frequencies and source integration vary by platform', 'device', 340, 1020, 360, 100, 'component', 'bus-motherboard', 'Clock generator / buffer')
      .region('bus-reset-circuit', 'Reset circuitry / physical supervisor, power-good qualification, sequencing, and reset fan-out. Reset sourcing can involve the PCH; the physical board-level distribution shown here abstracts platform-specific sequencing', 'device', 820, 1220, 340, 100, 'component', 'bus-motherboard', 'Reset circuitry')
      .region('bus-power', 'DC power inputs and regulation / the PSU converts AC mains to DC before supplying the motherboard. Board regulators distribute required rails; these are power rails, separate from data links', 'device', 340, 1150, 360, 440, 'component', 'bus-motherboard', 'DC input / regulation')
      .region('bus-power-connectors', 'Motherboard DC input / PSU DC outputs through main-board and CPU power connectors. Exact connector standards vary; no AC mains enters the motherboard', 'interconnect', 365, 1230, 310, 100, 'component', 'bus-power', 'Main / CPU DC inputs')
      .region('bus-vrm', 'Board voltage regulators / derive regulated CPU and platform rails from PSU DC inputs. Not every load shares one voltage or regulator', 'device', 365, 1420, 310, 100, 'component', 'bus-power', 'VRMs / regulators')
      .region('bus-power-rails', 'Motherboard DC distribution / separate regulated copper planes and power traces supplying CPU, DIMM, PCH, expansion slots, M.2, clock generation, and reset circuitry. Voltages and DIMM power-management placement depend on platform', 'device', 820, 1100, 340, 100, 'component', 'bus-motherboard', 'Motherboard DC rails')
      .region('bus-dc-source', 'PSU DC output / the chassis PSU receives AC mains and converts it to motherboard DC. This external box represents only its DC output; it is not motherboard AC input', 'device', 20, 1230, 240, 100, 'component', undefined, 'PSU / DC out')
      .region('bus-pch', 'Chipset / PCH / platform I/O chip connected explicitly to the CPU chipset endpoint by DMI or platform-specific chipset uplink. SATA, USB, and SPI host controllers are active PCH functions', 'device', 1520, 1170, 340, 100, 'component', 'bus-motherboard', 'Chipset / PCH')
      .region('bus-flash', 'SPI flash / stores host boot firmware', 'memory', 820, 1390, 340, 100, 'component', 'bus-motherboard', 'SPI flash / UEFI')
      .region('bus-usb-port', 'USB ports and headers / passive contacts backed by PCH host controller', 'interconnect', 1240, 1390, 340, 100, 'component', 'bus-motherboard', 'USB ports / headers')
      .region('bus-rtc', 'RTC / battery / clock and configuration-retention support', 'observer', 1660, 1390, 340, 100, 'component', 'bus-motherboard', 'RTC / battery')
  }

  private static connectData(diagram: HardwareDiagram): void {
    this.connect(diagram, 'bus-cpu-external-link', ['bus-cpu-device', 'right'], ['bus-cpu-port', 'left', 2 / 11], 'CPU package / electrical connection to motherboard socket')
    this.connect(diagram, 'bus-gpu-direct', ['bus-cpu-gpu-contacts', 'right'], ['bus-gpu-link', 'right'], 'GPU PCIe point-to-point PCB link / its own CPU socket lane group', [[950, 240], [950, 920]], { stroke: '#658bb5' })
    this.connect(diagram, 'bus-ssd-direct', ['bus-cpu-ssd-contacts', 'right'], ['bus-ssd-link', 'left'], 'NVMe PCIe point-to-point PCB link / its own CPU socket lane group to M.2', [[1280, 320], [1280, 690]], { stroke: '#579487' })
    this.connect(diagram, 'bus-network-adapter-direct', ['bus-cpu-network-adapter-contacts', 'right'], ['bus-network-adapter-link', 'left'], 'NIC PCIe point-to-point PCB link / its own CPU socket lane group; DMA uses this link', [[1600, 400], [1600, 920]], { stroke: '#9275ae' })
    this.connect(diagram, 'bus-ram-port-data', ['bus-cpu-ddr-contacts', 'right'], ['bus-ram-link', 'left'], 'DDR PCB traces / CPU socket directly to DIMM socket, bypassing PCIe and PCH', [[710, 560], [710, 100], [2080, 100], [2080, 230]], { caption: { text: 'DDR traces', x: 2160, y: 100 } })
    this.connect(diagram, 'bus-chipset-uplink', ['bus-cpu-chipset-contacts', 'right'], ['bus-pch', 'top'], 'DMI / chipset uplink / CPU socket chipset contacts directly to PCH, separate from PCIe device links and DDR', [[880, 480], [880, 980], [1690, 980]])
    for (const key of ['gpu', 'ram', 'hdd', 'ssd', 'network-adapter']) {
      const left = key === 'gpu'
      this.connect(diagram, `bus-${key}-external-link`, left ? [`bus-${key}-device`, 'right'] : [`bus-${key}-link`, 'right'], left ? [`bus-${key}-link`, 'left'] : [`bus-${key}-device`, 'left'], `${key} / electrical connection through the motherboard connector`)
    }
  }

  private static connectPlatform(diagram: HardwareDiagram): void {
    this.connect(diagram, 'bus-switch-hdd', ['bus-pch', 'right', 0.45], ['bus-hdd-link', 'left'], 'PCH SATA PCB traces / separate physical host link to HDD data connector', [[2100, 1215], [2100, 460]], { caption: { text: 'SATA', x: 2160, y: 560 } })
    this.connect(diagram, 'bus-pch-flash', ['bus-pch', 'bottom', 0.2], ['bus-flash', 'top'], 'SPI PCB traces / physical PCH SPI interface to the motherboard firmware flash chip', [[1588, 1350], [990, 1350]], { caption: { text: 'SPI', x: 1040, y: 1380 } })
    this.connect(diagram, 'bus-pch-usb', ['bus-pch', 'bottom'], ['bus-usb-port', 'top'], 'USB PCB traces / physical PCH USB interface to motherboard ports and headers', [[1690, 1380], [1410, 1380]])
    this.connect(diagram, 'bus-rtc-pch', ['bus-rtc', 'top'], ['bus-pch', 'bottom', 31 / 34], 'RTC / platform clock and standby context')
  }

  private static connectSupport(diagram: HardwareDiagram): void {
    const clock: BusLinkStyle = { bidirectional: false, stroke: '#648ea2' }
    const reset: BusLinkStyle = { bidirectional: false, stroke: '#9a7c94' }
    this.connect(diagram, 'bus-cpu-clock', ['bus-clock-reset', 'left'], ['bus-cpu-control-contacts', 'left'], 'Reference-clock PCB traces / clock generator to CPU socket control contacts', [[320, 1070], [320, 720]], clock)
    this.connect(diagram, 'bus-requester-clock', ['bus-clock-reset', 'top'], ['bus-gpu-port', 'bottom'], 'PCIe reference-clock PCB traces / clock buffer to GPU slot clock contacts', [], clock)
    this.connect(diagram, 'bus-pch-clock', ['bus-clock-reset', 'right', 0.65], ['bus-pch', 'left', 0.1], 'Chipset reference-clock PCB traces / clock generator to PCH; platform-appropriate clock source and frequency are abstracted', [[1360, 1085], [1360, 1180]], clock)
    this.connect(diagram, 'bus-ssd-clock', ['bus-clock-reset', 'right', 0.35], ['bus-ssd-link', 'left', 0.15], 'PCIe reference-clock PCB traces / clock buffer to M.2 clock contacts', [[1980, 1055], [1980, 662]], clock)
    this.connect(diagram, 'bus-network-adapter-clock', ['bus-clock-reset', 'right', 0.05], ['bus-network-adapter-link', 'left', 0.15], 'PCIe reference-clock PCB traces / clock buffer to NIC slot clock contacts', [[2010, 1025], [2010, 892]], clock)
    this.connect(diagram, 'bus-cpu-reset', ['bus-reset-circuit', 'left'], ['bus-cpu-control-contacts', 'right', 0.75], 'Reset PCB traces / board reset circuitry to CPU socket reset contacts', [[800, 1270], [800, 735]], reset)
    this.connect(diagram, 'bus-gpu-reset', ['bus-reset-circuit', 'left', 0.8], ['bus-gpu-port', 'right', 5 / 6], 'PCIe reset PCB traces / board reset distribution to GPU slot reset contacts', [[780, 1300], [780, 960]], reset)
    this.connect(diagram, 'bus-pch-reset', ['bus-reset-circuit', 'right', 0.9], ['bus-pch', 'left'], 'Chipset reset PCB traces / PCH and board supervisor participate in platform reset sequencing', [[1460, 1310], [1460, 1220]], reset)
    this.connect(diagram, 'bus-ssd-reset', ['bus-reset-circuit', 'right', 0.1], ['bus-ssd-link', 'left', 0.85], 'PCIe reset PCB traces / reset distribution to M.2 reset contacts', [[1200, 1230], [1200, 718]], reset)
    this.connect(diagram, 'bus-network-adapter-reset', ['bus-reset-circuit', 'right', 0.7], ['bus-network-adapter-link', 'left', 0.85], 'PCIe reset PCB traces / reset distribution to NIC slot reset contacts', [[1280, 1290], [1280, 948]], reset)
  }

  private static connectPower(diagram: HardwareDiagram): void {
    const power: BusLinkStyle = { stroke: '#b58a45', bidirectional: false }
    this.connect(diagram, 'bus-dc-input', ['bus-dc-source', 'right'], ['bus-power-connectors', 'left'], 'DC input / PSU converts AC mains to DC before the motherboard power connectors', [], power)
    this.connect(diagram, 'bus-power-regulation', ['bus-power-connectors', 'bottom'], ['bus-vrm', 'top'], 'Motherboard DC input to voltage regulators', [], power)
    this.connect(diagram, 'bus-power-distribution', ['bus-vrm', 'right'], ['bus-power-rails', 'left', 0.65], 'Regulated motherboard DC rails / separate voltages and regulator paths are abstracted', [[760, 1470], [760, 1165]], power)
    this.connect(diagram, 'bus-power-cpu', ['bus-power-rails', 'left', 0.4], ['bus-cpu-power-contacts', 'right'], 'CPU DC rail / distribution to CPU socket power contacts', [[720, 1140], [720, 640]], power)
    this.connect(diagram, 'bus-power-dimm', ['bus-power-rails', 'right', 0.05], ['bus-ram-port', 'bottom'], 'DIMM DC supply / board rails to DIMM power contacts; memory generation determines local regulation', [[2520, 1105], [2520, 325], [2290, 325]], power)
    this.connect(diagram, 'bus-power-pch', ['bus-power-rails', 'right', 1], ['bus-pch', 'left', 0.9], 'Chipset DC supply / motherboard rails power PCH', [[1400, 1200], [1400, 1260]], power)
    this.connect(diagram, 'bus-power-m2', ['bus-power-rails', 'right', 0.3], ['bus-ssd-port', 'bottom'], 'M.2 DC supply / motherboard rails power the NVMe SSD through socket power contacts', [[2490, 1130], [2490, 790], [2290, 790]], power)
    this.connect(diagram, 'bus-power-slots', ['bus-power-rails', 'left', 0.9], ['bus-gpu-port', 'bottom', 0.65], 'GPU slot DC supply / distinct from PCIe data lanes; auxiliary card power is outside this map', [[740, 1190], [740, 1000], [574, 1000]], power)
    this.connect(diagram, 'bus-power-nic', ['bus-power-rails', 'right', 0.55], ['bus-network-adapter-port', 'bottom'], 'NIC slot DC supply / motherboard rails to slot power contacts', [[2460, 1155], [2460, 1020], [2290, 1020]], power)
    this.connect(diagram, 'bus-power-clock', ['bus-power-rails', 'left', 0.05], ['bus-clock-reset', 'right', 0.85], 'Clock generator DC supply / motherboard rails to clock generation and buffer circuitry', [], power)
    this.connect(diagram, 'bus-power-reset', ['bus-power-rails', 'bottom'], ['bus-reset-circuit', 'top'], 'Reset circuitry DC supply / board standby or main support rail as required by the platform', [], power)
  }

  private static anchor(diagram: HardwareDiagram, anchor: BusAnchor): BusPoint {
    const [id, side, fraction = 0.5] = anchor
    const region = diagram.regions.find((candidate) => candidate.id === id)
    if (!region || fraction < 0 || fraction > 1) throw new RangeError(`Invalid motherboard connection anchor: ${id}`)
    if (side === 'left' || side === 'right') return [region.x + (side === 'right' ? region.width : 0), region.y + region.height * fraction]
    return [region.x + region.width * fraction, region.y + (side === 'bottom' ? region.height : 0)]
  }

  private static connect(diagram: HardwareDiagram, id: string, from: BusAnchor, to: BusAnchor, label: string, via: readonly BusPoint[] = [], style: BusLinkStyle = {}): void {
    const start = this.anchor(diagram, from)
    const end = this.anchor(diagram, to)
    let [x, y] = start
    let d = `M${x} ${y}`
    for (const point of [...via, end]) {
      if (point[0] !== x) d += `H${point[0]}`
      if (point[1] !== y) d += `V${point[1]}`
      x = point[0]
      y = point[1]
    }
    diagram.paths.push({ id, d, label, directed: true, bidirectional: true, highlighted: false, ...style })
  }

  private static applyColors(diagram: HardwareDiagram): void {
    for (let index = 0; index < diagram.regions.length; index += 1) {
      const region = diagram.regions[index]
      let color: SceneRegion['color'] = 'light-orange'
      if (region.id === 'bus-motherboard') color = 'green'
      else if (region.id === 'bus-vrm') color = 'light-blue'
      else if (region.id === 'bus-flash' || region.id === 'bus-rtc') color = 'light-red'
      else if (region.id === 'bus-fabric' || region.role === 'device' && !region.parentId || region.role === 'observer') color = 'neutral'
      else if (region.id === 'bus-pch' || region.id.endsWith('-port')) color = 'lavender'
      else if (region.role === 'memory') color = 'green'
      else if (region.role === 'interconnect') color = 'light-blue'
      diagram.regions[index] = { ...region, color, navigationTarget: this.navigationTargets[region.id], borderStyle: region.id === 'bus-rtc' ? 'solid' : undefined }
    }
  }
}
