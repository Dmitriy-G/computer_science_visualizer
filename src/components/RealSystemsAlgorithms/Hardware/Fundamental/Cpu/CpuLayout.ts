import type { Scene } from '../../../../../visualization/Scene.ts'
import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { HardwareDiagramFrame } from '../../../../../visualization/HardwareDiagramFrame.ts'
import { CpuCoreLayout } from '../CpuCore/CpuCoreLayout.ts'

export class CpuLayout {
  public static readonly externalLeft = 600
  public static readonly width = 4300 + this.externalLeft
  public static readonly height = 3100
  public static readonly coreCount = 4
  public static readonly componentCount = CpuCoreLayout.componentCount + 7

  public static create(): Scene {
    const diagram = new HardwareDiagram(4300, this.height)
    diagram.region('cpu-package', 'CPU package / illustrative four-core, single-die socketed processor; other CPUs can have different core counts, multiple dies, and different cache or I/O organization. This is a logical component map, not a manufacturer die floorplan', 'device', 440, 20, 3820, 3020, 'system', undefined, 'CPU package (4-core example)')
      .region('cpu-die', 'CPU die / contains the processor cores and shared cache, interconnect, memory controller, and I/O functions in this example', 'device', 480, 100, 3740, 2740, 'component', 'cpu-package', 'CPU die')
      .region('cpu-socket', 'CPU socket / electrical connector mating with the processor package contacts, carrying DDR, PCIe, chipset-link, clock/reset, and power/ground signals. The memory and I/O controllers are inside the CPU die, not in the socket. Signal groups shown here are contacts, not controllers. The socket is unfolded beside the package for clarity; physically it is underneath', 'interconnect', 40, 180, 320, 2820, 'component', undefined, 'CPU socket / contacts')
      .region('cpu-socket-clock-reset', 'Clock / Reset signals / electrical contacts for the CPU reference clock, such as BCLK, and platform CPU reset inputs. Motherboard clock-generation and reset circuitry supplies these inputs to processor clock/reset logic. Exact pins, sources, frequencies, and sequencing are platform-specific', 'interconnect', 80, 1540, 240, 180, 'component', 'cpu-socket', 'Clock / Reset')
      .region('cpu-socket-memory', 'DDR memory signals / channels connect the integrated memory controller inside the CPU directly to RAM through package contacts, socket contacts, and motherboard traces. They carry DRAM commands, addresses, data, clocks, and strobes; this is a DDR connection rather than PCIe', 'interconnect', 80, 1950, 240, 160, 'component', 'cpu-socket', 'DDR memory signals')
      .region('cpu-socket-io', 'PCIe lane signals / dedicated transmit and receive lanes connect the CPU I/O controller to PCIe devices or switches through electrical package/socket contacts. Device DMA memory traffic shares this interconnect with other PCIe transactions; DMA is not an extra physical channel', 'interconnect', 80, 2250, 240, 160, 'component', 'cpu-socket', 'PCIe lanes')
      .region('cpu-socket-chipset', 'Chipset-link signals / a separate CPU-to-chipset connection, such as Intel DMI or a platform-specific equivalent. This is distinct from the CPU PCIe-device lane group shown above, even where related signaling technology is used. Some SoCs omit a separate chipset link', 'interconnect', 80, 2450, 240, 160, 'component', 'cpu-socket', 'Chipset link')
      .region('cpu-socket-power', 'Power and ground / electrical supply and return contacts from motherboard voltage regulators. Clock and reset contacts are shown in their own separate signal group', 'device', 80, 2650, 240, 160, 'component', 'cpu-socket', 'Power / ground')
      .region('cpu-package-contacts', 'Package contacts / electrical lands or pins on the underside of the CPU package, mating with the socket; shown as a separate logical strip, not a physical pin map', 'interconnect', 520, 2900, 3620, 100, 'component', 'cpu-package', 'Package contacts')
    diagram.region('cpu-shared-cache', 'Shared L3 cache / last-level cache shared by the four cores in this example; physical cache slices and capacity depend on the processor', 'cache', 3050, 420, 1000, 240, 'component', 'cpu-die', 'Shared L3 cache')
      .region('cpu-interconnect', 'On-die interconnect / routes coherent requests and data between cores, shared cache, memory controller, and I/O; topology and coherence timing are not simulated', 'interconnect', 3050, 1030, 1000, 220, 'component', 'cpu-die', 'On-die interconnect')
      .region('cpu-memory-controller', 'Integrated memory controller / located inside the CPU die. Issues DDR commands and addresses, exchanges RAM data, and manages timing through electrical package/socket contacts. Both CPU-core requests and routed device DMA requests can reach it', 'device', 3050, 1700, 460, 300, 'component', 'cpu-die', 'Integrated memory controller')
      .region('cpu-io-controller', 'CPU I/O controller / logical grouping of CPU-side PCIe and chipset-link controllers inside the die. PCIe-device lanes and the separate chipset uplink have distinct package/socket connections. DMA is a transfer mechanism using these or another supported interconnect, not an additional physical channel', 'device', 3590, 1700, 460, 300, 'component', 'cpu-die', 'CPU I/O controller')
      .region('cpu-clock-power', 'Clock, reset, power, and thermal control / processor-side management logic receives external reference-clock and reset inputs through package/socket contacts. Internal clock generation and reset sequencing are abstracted; motherboard power regulation and cooling remain outside the die', 'device', 520, 2650, 2360, 140, 'component', 'cpu-die', 'Clock / reset / power / thermal control')
    this.connect(diagram)
    const orangeRegions = new Set([
      'cpu-socket-memory', 'cpu-socket-io', 'cpu-socket-chipset', 'cpu-socket-clock-reset', 'cpu-socket-power',
      'cpu-shared-cache', 'cpu-interconnect', 'cpu-memory-controller', 'cpu-io-controller',
    ])
    for (let index = 0; index < diagram.regions.length; index += 1) {
      const region = diagram.regions[index]
      const color = orangeRegions.has(region.id) ? 'light-orange'
        : region.id === 'cpu-package' || region.id === 'cpu-clock-power' ? 'green'
          : region.id === 'cpu-die' ? 'lavender'
            : region.role === 'interconnect' || region.id.endsWith('controller') ? 'light-blue' : undefined
      if (color) diagram.regions[index] = { ...region, color }
    }
    const core = CpuCoreLayout.create([], false)
    const boundary = core.regions.findIndex((region) => region.id === 'core')
    core.regions[boundary] = {
      ...core.regions[boundary],
      label: `Cores / ${this.coreCount} per die in this illustrative CPU; one representative core is expanded, with its own front end, registers, execution units, and private caches. Core counts vary by processor`,
      shortLabel: `Cores (~${this.coreCount} per die)`,
    }
    const orangeComponents = new Set([
      'instruction-fetch', 'instruction-decoder', 'instruction-queue',
      'instruction-tlb', 'instruction-cache', 'branch-predictor',
      'register-renaming', 'rename-map', 'dispatch-allocation', 'instruction-scheduler',
      'integer-alus', 'floating-point-simd', 'exception-control', 'reorder-retirement',
      'address-generation', 'data-cache', 'data-tlb', 'address-translation', 'load-store',
      'cache-interface',
    ])
    for (let index = 0; index < core.regions.length; index += 1) {
      const region = core.regions[index]
      if (orangeComponents.has(region.id.replace('component-', ''))) core.regions[index] = { ...region, color: 'light-orange' }
    }
    CpuCoreLayout.pipeline(core)
    const framed = HardwareDiagramFrame.create(diagram, this.externalLeft, 0)
    framed.paths.push(
      { id: 'cpu-external-memory', d: 'M680 2030H40', label: 'DDR channels / integrated memory controller inside CPU to external RAM, through electrical package/socket contacts and motherboard traces. DDR command/address and read/write data signals are grouped', directed: true, bidirectional: true, highlighted: false, caption: { text: 'RAM / DDR channels', x: 60, y: 2008 } },
      { id: 'cpu-external-pcie', d: 'M680 2330H40', label: 'PCIe lanes / CPU-side I/O controller to PCIe devices. Device DMA memory requests and normal control transactions use these same lanes. DMA is a transfer mechanism, not a separate physical channel; CPU software configures the device or DMA engine', directed: true, bidirectional: true, highlighted: false, caption: { text: 'PCIe lanes\n(device DMA traffic)', x: 60, y: 2276 } },
      { id: 'cpu-external-chipset', d: 'M680 2530H40', label: 'Separate chipset uplink / Intel DMI on applicable Intel platforms, or a platform-specific equivalent. Chipset-attached devices can send memory traffic through this link; the CPU PCIe-device lanes are shown separately', directed: true, bidirectional: true, highlighted: false, caption: { text: 'Chipset link\n(Intel DMI / equivalent)', x: 60, y: 2476 } },
      { id: 'cpu-external-clock', d: 'M40 1590H680', label: 'CPU reference-clock input / motherboard clock source to processor clock logic through electrical socket/package contacts. BCLK is an example name; clock arrangements vary by platform', directed: true, dashed: true, highlighted: false, caption: { text: 'Reference clock / BCLK', x: 60, y: 1568 } },
      { id: 'cpu-external-reset', d: 'M40 1670H680', label: 'CPU reset input / platform reset circuitry to processor reset logic through electrical socket/package contacts. This is a control signal, not a memory or PCIe data channel', directed: true, dashed: true, highlighted: false, caption: { text: 'CPU reset', x: 60, y: 1648 } },
      { id: 'cpu-external-power', d: 'M40 2730H680', label: 'Motherboard voltage regulators supply DC power through the CPU socket / not direct AC mains input', directed: true, dashed: true, stroke: '#b58a45', highlighted: false, caption: { text: 'DC power / ground', x: 60, y: 2708 } },
    )
    return {
      kind: 'system-overview', width: this.width, height: this.height,
      nodes: [], edges: [], regions: framed.regions, paths: framed.paths,
      count: this.componentCount, countLabel: 'CPU functional components', focusId: null,
      layers: [{
        id: 'cpu-core', x: 500 + this.externalLeft, y: 160, scale: 1,
        scene: {
          kind: 'system-overview', width: core.width, height: core.height,
          nodes: [], edges: [], regions: core.regions, paths: core.paths,
          count: CpuCoreLayout.componentCount, countLabel: 'core components', focusId: null,
        },
      }],
    }
  }

  private static connect(diagram: HardwareDiagram): void {
    const paths: readonly [string, string, string][] = [
      ['core-fabric', 'M2880 2435H2960V1140H3050', 'Representative core cache interface to the shared on-die interconnect'],
      ['cache-fabric', 'M3550 660V1030', 'Shared L3 cache exchanges requests and data with the on-die interconnect'],
      ['fabric-memory', 'M3280 1250V1700', 'Interconnect to integrated memory controller'],
      ['fabric-io', 'M3820 1250V1700', 'Interconnect to I/O controller'],
      ['memory-contacts', 'M3280 2000V2900', 'Memory-controller signals reach the package contacts'],
      ['io-contacts', 'M3820 2000V2900', 'CPU PCIe-controller lane signals reach their package contacts, separately from the chipset-link signal group'],
      ['chipset-contacts', 'M3960 2000V2900', 'CPU-side chipset-link controller to its distinct package contacts'],
      ['socket-memory', 'M520 2940H400V2030H320', 'Bidirectional memory signals between package contacts and motherboard CPU socket'],
      ['socket-io', 'M520 2980H410V2330H320', 'Bidirectional PCIe lane signals between CPU package contacts and motherboard socket contacts'],
      ['socket-chipset', 'M520 2960H380V2530H320', 'Separate chipset-link signals between CPU package contacts and motherboard socket contacts'],
    ]
    for (const [id, d, label] of paths) diagram.paths.push({ id: `cpu-${id}`, d, label, highlighted: false, directed: true, bidirectional: true })
    diagram.paths.push(
      { id: 'cpu-socket-power-contacts', d: 'M320 2730H390V3020H1700V3000', label: 'Motherboard power and ground connect through electrical socket and package contacts', highlighted: false, dashed: true, stroke: '#b58a45' },
      { id: 'cpu-contacts-power-control', d: 'M1700 2900V2790', label: 'DC supply connections from package contacts to processor power-control logic', highlighted: false, dashed: true, stroke: '#b58a45' },
      { id: 'cpu-socket-clock-reset-contacts', d: 'M320 1630H370V2880H2100V2900', label: 'Reference-clock and reset input signals / electrical socket contacts to package contacts; grouped control inputs, not payload traffic', highlighted: false, directed: true, dashed: true },
      { id: 'cpu-contacts-clock-reset', d: 'M2100 2900V2790', label: 'Reference-clock and reset inputs from package contacts to processor-side clock/reset management logic', highlighted: false, directed: true, dashed: true },
    )
  }
}
