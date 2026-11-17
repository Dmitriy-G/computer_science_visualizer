import type { Scene } from '../../../../../visualization/Scene.ts'
import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { HardwareDiagramFrame } from '../../../../../visualization/HardwareDiagramFrame.ts'
import { CpuCoreLayout } from '../CpuCore/CpuCoreLayout.ts'
import { CpuDiagramCoreLayout } from './CpuDiagramCoreLayout.ts'

export class CpuLayout {
  public static readonly externalLeft = 400
  public static readonly width = 3300 + this.externalLeft
  public static readonly height = 1760
  public static readonly coreCount = 4
  public static readonly componentCount = CpuCoreLayout.componentCount + 7

  public static create(): Scene {
    const diagram = new HardwareDiagram(3300, this.height)
    diagram.region('cpu-package', 'CPU package / illustrative four-core, single-die socketed processor; other CPUs can have different core counts, multiple dies, and different cache or I/O organization. This is a logical component map, not a manufacturer die floorplan', 'device', 440, 20, 2780, 1700, 'system', undefined, 'CPU package (4-core example)')
      .region('cpu-die', 'CPU die / contains the processor cores and shared cache, interconnect, memory controller, and I/O functions in this example', 'device', 480, 100, 2700, 1440, 'component', 'cpu-package', 'CPU die')
      .region('cpu-socket', 'CPU socket / electrical connector mating with the processor package contacts, carrying DDR, PCIe, chipset-link, clock/reset, and power/ground signals. The memory and I/O controllers are inside the CPU die, not in the socket. Signal groups shown here are contacts, not controllers. The socket is unfolded beside the package for clarity; physically it is underneath', 'interconnect', 60, 180, 280, 940, 'component', undefined, 'CPU socket / contacts')
      .region('cpu-socket-clock-reset', 'Clock / Reset signals / electrical contacts for the CPU reference clock, such as BCLK, and platform CPU reset inputs. Motherboard clock-generation and reset circuitry supplies these inputs to processor clock/reset logic. Exact pins, sources, frequencies, and sequencing are platform-specific', 'interconnect', 100, 285, 200, 130, 'component', 'cpu-socket', 'Clock / Reset')
      .region('cpu-socket-memory', 'DDR memory signals / channels connect the integrated memory controller inside the CPU directly to RAM through package contacts, socket contacts, and motherboard traces. They carry DRAM commands, addresses, data, clocks, and strobes; this is a DDR connection rather than PCIe', 'interconnect', 100, 455, 200, 130, 'component', 'cpu-socket', 'DDR memory signals')
      .region('cpu-socket-io', 'PCIe lane signals / dedicated transmit and receive lanes connect the CPU I/O controller to PCIe devices or switches through electrical package/socket contacts. Device DMA memory traffic shares this interconnect with other PCIe transactions; DMA is not an extra physical channel', 'interconnect', 100, 625, 200, 130, 'component', 'cpu-socket', 'PCIe lanes')
      .region('cpu-socket-chipset', 'Chipset-link signals / a separate CPU-to-chipset connection, such as Intel DMI or a platform-specific equivalent. This is distinct from the CPU PCIe-device lane group shown above, even where related signaling technology is used. Some SoCs omit a separate chipset link', 'interconnect', 100, 795, 200, 130, 'component', 'cpu-socket', 'Chipset link')
      .region('cpu-socket-power', 'Power and ground / electrical supply and return contacts from motherboard voltage regulators. Clock and reset contacts are shown in their own separate signal group', 'device', 100, 965, 200, 130, 'component', 'cpu-socket', 'Power / ground')
      .region('cpu-package-contacts', 'Package contacts / electrical lands or pins on the underside of the CPU package, mating with the socket; shown as a separate logical strip, not a physical pin map', 'interconnect', 520, 1600, 2620, 80, 'component', 'cpu-package', 'Package contacts')
    diagram.region('cpu-shared-cache', 'Shared L3 cache / last-level cache shared by the four cores in this example; physical cache slices and capacity depend on the processor', 'cache', 2360, 240, 600, 180, 'component', 'cpu-die', 'Shared L3 cache')
      .region('cpu-interconnect', 'On-die interconnect / routes coherent requests and data between cores, shared cache, memory controller, and I/O; topology and coherence timing are not simulated', 'interconnect', 2360, 510, 600, 180, 'component', 'cpu-die', 'On-die interconnect')
      .region('cpu-memory-controller', 'Integrated memory controller / located inside the CPU die. Issues DDR commands and addresses, exchanges RAM data, and manages timing through electrical package/socket contacts. Both CPU-core requests and routed device DMA requests can reach it', 'device', 2360, 780, 600, 180, 'component', 'cpu-die', 'Integrated memory controller')
      .region('cpu-io-controller', 'CPU I/O controller / logical grouping of CPU-side PCIe and chipset-link controllers inside the die. PCIe-device lanes and the separate chipset uplink have distinct package/socket connections. DMA is a transfer mechanism using these or another supported interconnect, not an additional physical channel', 'device', 2360, 1050, 600, 180, 'component', 'cpu-die', 'CPU I/O controller')
      .region('cpu-clock-power', 'Clock, reset, power, and thermal control / processor-side management logic receives external reference-clock and reset inputs through package/socket contacts. Internal clock generation and reset sequencing are abstracted; motherboard power regulation and cooling remain outside the die', 'device', 2360, 1320, 600, 180, 'component', 'cpu-die', 'Clock / reset / power / thermal control')
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
      if (color) diagram.regions[index] = { ...region, color, titleFontSize: region.level === 'system' ? 40 : 32 }
    }
    const core = CpuDiagramCoreLayout.create()
    const boundary = core.regions.findIndex((region) => region.id === 'core')
    core.regions[boundary] = {
      ...core.regions[boundary],
      color: 'green',
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
    const framed = HardwareDiagramFrame.create(diagram, this.externalLeft, 0)
    framed.paths.push(
      { id: 'cpu-external-memory', d: 'M500 520H20', label: 'DDR channels / integrated memory controller inside CPU to external RAM, through electrical package/socket contacts and motherboard traces. DDR command/address and read/write data signals are grouped', directed: true, bidirectional: true, highlighted: false, caption: { text: 'RAM / DDR channels', x: 40, y: 552 } },
      { id: 'cpu-external-pcie', d: 'M500 690H20', label: 'PCIe lanes / CPU-side I/O controller to PCIe devices. Device DMA memory requests and normal control transactions use these same lanes. DMA is a transfer mechanism, not a separate physical channel; CPU software configures the device or DMA engine', directed: true, bidirectional: true, highlighted: false, caption: { text: 'PCIe lanes\n(device DMA traffic)', x: 40, y: 722 } },
      { id: 'cpu-external-chipset', d: 'M500 860H20', label: 'Separate chipset uplink / Intel DMI on applicable Intel platforms, or a platform-specific equivalent. Chipset-attached devices can send memory traffic through this link; the CPU PCIe-device lanes are shown separately', directed: true, bidirectional: true, highlighted: false, caption: { text: 'Chipset link\n(Intel DMI /\nequivalent)', x: 40, y: 892 } },
      { id: 'cpu-external-clock', d: 'M20 310H500', label: 'CPU reference-clock input / motherboard clock source to processor clock logic through electrical socket/package contacts. BCLK is an example name; clock arrangements vary by platform', directed: true, highlighted: false, caption: { text: 'Reference clock / BCLK', x: 40, y: 292 } },
      { id: 'cpu-external-reset', d: 'M20 390H500', label: 'CPU reset input / platform reset circuitry to processor reset logic through electrical socket/package contacts. This is a control signal, not a memory or PCIe data channel', directed: true, highlighted: false, caption: { text: 'CPU reset', x: 40, y: 422 } },
      { id: 'cpu-external-power', d: 'M20 1030H500', label: 'Motherboard voltage regulators supply DC power through the CPU socket / not direct AC mains input', directed: true, stroke: '#b58a45', highlighted: false, caption: { text: 'DC power / ground', x: 40, y: 1062 } },
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
      ['core-fabric', 'M1920 1355H2280V600H2360', 'Representative core cache interface to the shared on-die interconnect'],
      ['cache-fabric', 'M2660 420V510', 'Shared L3 cache exchanges requests and data with the on-die interconnect'],
      ['fabric-memory', 'M2660 690V780', 'Interconnect to integrated memory controller'],
      ['fabric-io', 'M2960 600H3080V1100H2960', 'Interconnect to I/O controller'],
      ['memory-contacts', 'M2360 870H2320V1600', 'Memory-controller signals reach the package contacts'],
      ['io-contacts', 'M2960 1140H3040V1600', 'CPU PCIe-controller lane signals reach their package contacts, separately from the chipset-link signal group'],
      ['chipset-contacts', 'M2960 1190H3000V1600', 'CPU-side chipset-link controller to its distinct package contacts'],
      ['socket-memory', 'M520 1620H460V520H300', 'Bidirectional memory signals between package contacts and motherboard CPU socket'],
      ['socket-io', 'M520 1640H420V690H300', 'Bidirectional PCIe lane signals between CPU package contacts and motherboard socket contacts'],
      ['socket-chipset', 'M520 1660H400V860H300', 'Separate chipset-link signals between CPU package contacts and motherboard socket contacts'],
    ]
    for (const [id, d, label] of paths) diagram.paths.push({ id: `cpu-${id}`, d, label, highlighted: false, directed: true, bidirectional: true, foreground: id === 'core-fabric' })
    diagram.paths.push(
      { id: 'cpu-socket-clock-reset-contacts', d: 'M300 350H370V1560H2500V1600', label: 'Reference-clock and reset input signals / electrical socket contacts to package contacts; grouped control inputs, not payload traffic', highlighted: false, directed: true },
      { id: 'cpu-contacts-clock-reset', d: 'M2760 1600V1500', label: 'Reference-clock and reset inputs from package contacts to processor-side clock/reset management logic', highlighted: false, directed: true },
    )
  }
}
