import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import type { Scene, SceneRegion } from '../../../../../visualization/Scene.ts'

export class BusLayout {
  public static readonly width = 2800
  public static readonly height = 1520
  public static readonly componentCount = 12

  public static create(): Scene {
    const diagram = this.diagram()
    return {
      kind: 'system-overview', width: diagram.width, height: diagram.height,
      nodes: [], edges: [], regions: diagram.regions, paths: diagram.paths,
      count: this.componentCount, countLabel: 'bus / interconnect functional groups', focusId: null,
    }
  }

  public static diagram(): HardwareDiagram {
    const diagram = new HardwareDiagram(this.width, this.height)
    diagram.region('bus-fabric', 'Bus / interconnect / logical switched-fabric example with six separate endpoint connections. Memory and device links terminate through appropriate controller/interface functions; this is not one uniform physical bus. Left/right placement does not restrict requester roles: DMA-capable devices can initiate traffic. Component placement, protocols, wiring, and clock domains vary', 'interconnect', 340, 80, 2120, 1360, 'system', undefined, 'Bus / interconnect')
      .region('bus-buffers', 'Buffers and queues / hold requests, write payloads, and read responses while resources or downstream receivers are busy. Logical traffic classes are shown separately; physical allocation varies', 'memory', 800, 560, 300, 320, 'component', 'bus-fabric', 'Buffers / queues')
      .region('bus-request-queue', 'Request queue / pending addresses, operation types, and transaction metadata', 'memory', 830, 640, 240, 60, 'component', 'bus-buffers', 'Requests')
      .region('bus-write-queue', 'Write-data queue / buffered outgoing write payloads', 'memory', 830, 720, 240, 60, 'component', 'bus-buffers', 'Write data')
      .region('bus-response-queue', 'Response queue / buffered read data and completion responses', 'memory', 830, 800, 240, 60, 'component', 'bus-buffers', 'Responses')
      .region('bus-routing', 'Address decoding and destination-ID routing / memory-mapped requests use address decoding to select targets; other protocols or transaction types can route using destination IDs or other header fields. Routing can be distributed across endpoints and switches', 'device', 800, 240, 380, 180, 'component', 'bus-fabric', 'Address / ID routing')
      .region('bus-arbiter', 'Arbiters and schedulers / required when multiple requesters or traffic streams compete for a shared resource, such as the same output port. CPU and GPU requests illustrate possible contention here; independent paths need not arbitrate against each other. Policies and quality-of-service guarantees vary', 'device', 1260, 240, 380, 180, 'component', 'bus-fabric', 'Arbiter / scheduler (shared resource)')
      .region('bus-flow-control', 'Flow-control logic / uses mechanisms such as ready signaling, backpressure, or credits to prevent receivers from being overrun. Exact mechanisms depend on the protocol', 'interconnect', 1680, 240, 300, 180, 'component', 'bus-fabric', 'Flow control')
      .region('bus-switch', 'Switches and routers / connect multiple endpoints through selectable ports. Separate CPU and GPU ingress paths and RAM, HDD, SSD, and Network Adapter egress paths are shown. Bidirectional links carry requests, data, and responses; a simple shared bus may omit switching', 'interconnect', 1220, 560, 300, 320, 'component', 'bus-fabric', 'Switch / router')
      .region('bus-bridge', 'Optional bridge or adapter / used only when protocols or interfaces require translation or adaptation. The illustrated Network Adapter branch can use this function when needed, while a direct path remains available. It is not required for every transfer', 'interconnect', 1680, 900, 300, 180, 'component', 'bus-fabric', 'Bridge / adapter (optional)')
      .region('bus-clock-reset', 'Clock, reset, and synchronization circuitry / coordinate interface operation and cross clock domains where required. Dashed connections indicate support and control rather than payload traffic', 'observer', 400, 1240, 480, 160, 'component', 'bus-fabric', 'Clock / reset / synchronization')
      .region('bus-error-control', 'Error detection and recovery / check transfers using the selected protocol mechanisms and report errors or retry where supported. Parity, CRC, ECC, and retries are alternatives rather than mandatory features of every bus', 'device', 960, 1240, 480, 160, 'component', 'bus-fabric', 'Error detection / recovery')
      .region('bus-coherence', 'Optional cache-coherence logic / coordinates cached copies, ownership, and snoop or directory transactions in a coherent interconnect. Noncoherent links omit this function', 'observer', 1520, 1240, 380, 160, 'component', 'bus-fabric', 'Cache coherence (optional)')
    this.addEndpoint(diagram, 'cpu', 'CPU', 'CPU / issues memory and device requests and receives data and responses', 'left', 240, 'Protocol controller')
    this.addEndpoint(diagram, 'gpu', 'GPU', 'GPU / exchanges memory and device traffic through its own interface; coherent capability depends on the system', 'left', 740, 'Protocol controller')
    this.addEndpoint(diagram, 'ram', 'RAM', 'RAM / connects through the shown memory-controller and memory-link functions; DRAM signaling is not interchangeable with the fabric protocol', 'right', 160, 'Memory controller')
    this.addEndpoint(diagram, 'hdd', 'HDD', 'HDD / storage endpoint connected through its controller and device link; host and storage protocols are abstracted', 'right', 460, 'HDD controller')
    this.addEndpoint(diagram, 'ssd', 'SSD', 'SSD / storage endpoint connected through its controller and device link; PCIe/NVMe and SATA implementations differ', 'right', 760, 'SSD controller')
    this.addEndpoint(diagram, 'network-adapter', 'Network Adapter', 'Network Adapter / device interface exchanges frames, buffers, descriptors, and DMA traffic with the system; the external network is beyond this endpoint', 'right', 1060, 'Adapter interface')
    this.connectPayloads(diagram)
    this.connectControl(diagram)
    this.applyColors(diagram)
    return diagram
  }

  private static addEndpoint(diagram: HardwareDiagram, key: string, name: string, description: string, side: 'left' | 'right', y: number, controller: string): void {
    const left = side === 'left'
    const x = left ? 400 : 2080
    const linkY = y + (left ? 50 : 160)
    const protocolY = y + (left ? 160 : 50)
    const id = `bus-${key}-port`
    diagram.region(`bus-${key}-device`, description, 'device', left ? 40 : 2520, linkY - 10, 240, 100, 'component', undefined, name)
      .region(id, `${name} interface port / separate bidirectional connection to the switching fabric. The six visible ports illustrate multiple endpoints; actual system organization and port counts vary`, 'interconnect', x, y, 340, 260, 'component', 'bus-fabric', name === 'Network Adapter' ? 'NIC port' : `${name} port`)
      .region(`bus-${key}-link`, 'Physical links and signal circuitry / wires or lanes, drivers, and receivers carry signals between compatible interfaces. Memory, storage, and host-device links can use different signaling', 'interconnect', x + 40, linkY, 260, 80, 'component', id, 'Link / signal I/O')
      .region(`bus-${key}-protocol`, `${controller} / constructs and interprets requests, data, and responses for this endpoint. The depicted boundary includes appropriate controller/interface functions; this is logical context, not an exact chip placement`, 'device', x + 40, protocolY, 260, 80, 'component', id, controller)
    diagram.paths.push(
      { id: `bus-${key}-external-link`, d: left ? `M280 ${linkY + 40}H440` : `M2380 ${linkY + 40}H2520`, label: `${name} / separate external endpoint connection`, directed: true, bidirectional: true, highlighted: false },
      { id: `bus-${key}-port-data`, d: left ? `M570 ${linkY + 80}V${protocolY}` : `M2250 ${protocolY + 80}V${linkY}`, label: `${name} port / signal circuitry and controller exchange data and transactions`, directed: true, bidirectional: true, highlighted: false },
    )
  }

  private static connectPayloads(diagram: HardwareDiagram): void {
    const paths: readonly [string, string, string][] = [
      ['bus-cpu-queues', 'M700 440H760V640H800', 'CPU port / requests, payloads, and responses through traffic queues'],
      ['bus-gpu-queues', 'M700 940H760V800H800', 'GPU port / independent requests, payloads, and responses through traffic queues'],
      ['bus-queues-switch', 'M1100 720H1220', 'Buffered requests and data / exchange with the selected switching path'],
      ['bus-switch-ram', 'M1520 600H2000V250H2120', 'RAM branch / switch to the memory-controller port; responses return through the fabric'],
      ['bus-switch-hdd', 'M1520 690H2020V550H2120', 'HDD branch / switch to the HDD controller port'],
      ['bus-switch-ssd', 'M1520 780H2040V850H2120', 'SSD branch / switch to the SSD controller port'],
      ['bus-switch-network-adapter', 'M1520 860H1600V1110H2020V1150H2120', 'Network Adapter direct branch / compatible transactions bypass the optional bridge'],
      ['bus-switch-bridge', 'M1520 820H1580V990H1680', 'Optional adapted branch / only transactions needing interface or protocol adaptation enter the bridge'],
      ['bus-bridge-target', 'M1980 990H2040V1170H2120', 'Optional adapted Network Adapter branch / an alternative to its direct switch connection'],
    ]
    for (const [id, d, label] of paths) diagram.paths.push({ id, d, label, directed: true, bidirectional: true, highlighted: false })
  }

  private static connectControl(diagram: HardwareDiagram): void {
    const paths: readonly [string, string, string, boolean, boolean][] = [
      ['bus-address-input', 'M950 560V440H990V420', 'Queued routing metadata / memory-mapped addresses or protocol-defined destination IDs', false, true],
      ['bus-route-selection', 'M1180 330H1200V500H1370V560', 'Route selection / decoded memory-mapped address or destination ID selects a switch port', false, true],
      ['bus-arbitration-request', 'M1040 560V500H1370V420', 'Competing queued work / multiple requesters can contend for the same output or shared path', false, true],
      ['bus-arbitration-grant', 'M1510 420V500H1470V560', 'Arbitration grant / choose among contenders for the shared resource, not between unrelated independent paths', false, true],
      ['bus-buffer-status', 'M1100 640H1140V460H1800V420', 'Buffer availability / occupancy and resource status feed flow control', false, true],
      ['bus-cpu-flow', 'M1680 330H1660V140H780V450H700', 'CPU port flow control / ready, credit, or backpressure information', true, true],
      ['bus-gpu-flow', 'M1680 370H1660V700H780V950H700', 'GPU port flow control / ready, credit, or backpressure information', true, true],
      ['bus-ram-flow', 'M1980 330H2060V250H2120', 'Memory-controller port flow control / receiver availability', true, true],
      ['bus-adapter-flow', 'M1980 370H2060V1130H2120', 'Network Adapter port flow control / receiver availability', true, true],
      ['bus-requester-clock', 'M570 1240V1000', 'Requester interface clock, reset, and synchronization support / not payload traffic', false, true],
      ['bus-target-clock', 'M880 1320H920V1420H2440V1320H2250', 'Target interface clock, reset, and synchronization support / clock domains may differ', false, true],
      ['bus-requester-errors', 'M1100 1240V1180H660V1000', 'Requester interface error checks, status, and recovery coordination', true, true],
      ['bus-target-errors', 'M1320 1240V1200H2000V1280H2080', 'Target interface error checks, status, and recovery coordination', true, true],
      ['bus-coherence-control', 'M1370 880V1140H1710V1240', 'Optional coherent transactions / snoop, directory, and ownership coordination; absent on noncoherent links', true, true],
    ]
    for (const [id, d, label, bidirectional, dashed] of paths) diagram.paths.push({ id, d, label, directed: true, bidirectional, dashed, highlighted: false })
  }

  private static applyColors(diagram: HardwareDiagram): void {
    for (let index = 0; index < diagram.regions.length; index += 1) {
      const region = diagram.regions[index]
      let color: SceneRegion['color'] = 'light-orange'
      if (region.id === 'bus-fabric' || region.role === 'device' && !region.parentId || region.role === 'observer') color = 'neutral'
      else if (region.id === 'bus-switch' || region.id.endsWith('-port')) color = 'lavender'
      else if (region.role === 'memory') color = 'green'
      else if (region.role === 'interconnect') color = 'light-blue'
      diagram.regions[index] = { ...region, color }
    }
  }
}
