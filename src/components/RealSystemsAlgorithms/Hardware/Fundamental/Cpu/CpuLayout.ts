import type { Scene } from '../../../../../visualization/Scene.ts'
import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { CpuCoreLayout } from '../CpuCore/CpuCoreLayout.ts'

export class CpuLayout {
  public static readonly width = 4300
  public static readonly height = 3100
  public static readonly coreCount = 4
  public static readonly componentCount = CpuCoreLayout.componentCount + 7

  public static create(): Scene {
    const diagram = new HardwareDiagram(this.width, this.height)
    diagram.region('cpu-package', 'CPU package / illustrative four-core, single-die socketed processor; other CPUs can have different core counts, multiple dies, and different cache or I/O organization. This is a logical component map, not a manufacturer die floorplan', 'device', 440, 20, 3820, 3020, 'system', undefined, 'CPU package (4-core example)')
      .region('cpu-die', 'CPU die / contains the processor cores and shared cache, interconnect, memory controller, and I/O functions in this example', 'device', 480, 100, 3740, 2740, 'component', 'cpu-package', 'CPU die')
      .region('cpu-socket', 'CPU socket / motherboard connector mating with the package contacts; carries bidirectional memory and I/O signals, power, ground, clocks, and control. Shown beside the package for clarity; the physical socket is underneath it', 'interconnect', 40, 180, 320, 2820, 'component', undefined, 'CPU socket')
      .region('cpu-socket-memory', 'Memory signals / command, address, data, and strobes between the integrated memory controller and motherboard RAM traces', 'interconnect', 80, 1950, 240, 160, 'component', 'cpu-socket', 'Memory signals')
      .region('cpu-socket-io', 'I/O signals / PCIe and chipset-link traffic through the processor package and motherboard socket', 'interconnect', 80, 2250, 240, 160, 'component', 'cpu-socket', 'I/O signals')
      .region('cpu-socket-power', 'Power and ground / motherboard supply and return contacts; clocks and management signals also pass through the socket', 'device', 80, 2650, 240, 160, 'component', 'cpu-socket', 'Power / ground')
      .region('cpu-package-contacts', 'Package contacts / electrical lands or pins on the underside of the CPU package, mating with the socket; shown as a separate logical strip, not a physical pin map', 'interconnect', 520, 2900, 3620, 100, 'component', 'cpu-package', 'Package contacts')
    diagram.region('cpu-shared-cache', 'Shared L3 cache / last-level cache shared by the four cores in this example; physical cache slices and capacity depend on the processor', 'cache', 3050, 420, 1000, 240, 'component', 'cpu-die', 'Shared L3 cache')
      .region('cpu-interconnect', 'On-die interconnect / routes coherent requests and data between cores, shared cache, memory controller, and I/O; topology and coherence timing are not simulated', 'interconnect', 3050, 1030, 1000, 220, 'component', 'cpu-die', 'On-die interconnect')
      .region('cpu-memory-controller', 'Integrated memory controller / issues DRAM commands and addresses, exchanges data, and manages memory timing through the package and CPU socket', 'device', 3050, 1700, 460, 300, 'component', 'cpu-die', 'Memory controller')
      .region('cpu-io-controller', 'I/O controller / PCIe and chipset-link interfaces connecting the processor to external platform devices through the CPU socket', 'device', 3590, 1700, 460, 300, 'component', 'cpu-die', 'I/O controller')
      .region('cpu-clock-power', 'Clock, power, and thermal control / processor management logic; external power regulation and cooling are outside the die', 'device', 520, 2650, 2360, 140, 'component', 'cpu-die', 'Clock / power / thermal control')
    this.connect(diagram)
    const orangeRegions = new Set([
      'cpu-socket-memory', 'cpu-socket-io', 'cpu-socket-power',
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
    return {
      kind: 'system-overview', width: this.width, height: this.height,
      nodes: [], edges: [], regions: diagram.regions, paths: diagram.paths,
      count: this.componentCount, countLabel: 'CPU functional components', focusId: null,
      layers: [{
        id: 'cpu-core', x: 500, y: 160, scale: 1,
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
      ['io-contacts', 'M3820 2000V2900', 'I/O-controller signals reach the package contacts'],
      ['socket-memory', 'M520 2940H400V2030H320', 'Bidirectional memory signals between package contacts and motherboard CPU socket'],
      ['socket-io', 'M520 2980H410V2330H320', 'Bidirectional I/O signals between package contacts and motherboard CPU socket'],
    ]
    for (const [id, d, label] of paths) diagram.paths.push({ id: `cpu-${id}`, d, label, highlighted: false, directed: true, bidirectional: true })
    diagram.paths.push(
      { id: 'cpu-socket-power-contacts', d: 'M320 2730H390V3020H1700V3000', label: 'Motherboard power and ground connect through the socket and package contacts', highlighted: false, dashed: true },
      { id: 'cpu-contacts-power-control', d: 'M1700 2900V2790', label: 'Package power and management connections to on-die clock, power, and thermal control', highlighted: false, dashed: true },
    )
  }
}
