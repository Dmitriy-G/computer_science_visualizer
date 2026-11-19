import type { HardwareElementInformation } from '../../../../../visualization/HardwareElementInformation.ts'
import { GpuIllustrations } from './GpuIllustrations.ts'
import { GpuProcessingInformation } from './GpuProcessingInformation.ts'
import { GpuVramInformation } from './GpuVramInformation.ts'

export class GpuInformation {
  private static readonly architectureDocumentation = {
    title: 'NVIDIA / Ada GPU architecture: graphics, compute, caches, and memory interfaces',
    url: 'https://images.nvidia.com/aem-dam/Solutions/Data-Center/l4/nvidia-ada-gpu-architecture-whitepaper-V2.02.pdf',
  }

  private static readonly memoryInformation: HardwareElementInformation = {
    photos: GpuIllustrations.memory,
    overview: 'Dedicated graphics memory stores buffers used by the GPU, including textures, geometry, compute inputs, and rendered frames.',
    problem: 'It provides local storage with the bandwidth needed by the GPU memory system.',
    characteristicNote: 'The package photograph is a separate physical example. It does not establish the memory type or capacity fitted to the board photo. The diagram uses its existing illustrative 16 GiB GDDR6 configuration; the photographed package exterior does not reveal its internal die, banks, or cells.',
    characteristics: [
      { name: 'Visible parts', value: 'A marked package top and an underside ball-grid array of solder connections.' },
      { name: 'Volatility', value: 'GDDR is DRAM: stored data requires power and refresh.' },
      { name: 'Connection', value: 'GPU memory controllers exchange commands, addresses, and data with the memory devices over their supported graphics-memory interface.' },
    ],
    documentation: [{
      title: 'SK hynix / Graphics DRAM and GDDR product family',
      url: 'https://product.skhynix.com/products/dram/gddr.go',
    }, this.architectureDocumentation],
  }

  private static readonly entries: Readonly<Record<string, HardwareElementInformation>> = {
    'gpu-board': {
      photos: GpuIllustrations.board,
      overview: 'A discrete graphics card combines a GPU package, local memory, host and display connections, and power circuitry on one printed circuit board.',
      problem: 'It connects graphics and parallel-compute hardware to the computer and its display devices.',
      characteristicNote: 'These are separate supplied hardware examples. The board GPU marking differs from the package close-up; the memory and power photos do not identify the exact components fitted to this card. The schematic remains a logical teaching map, rather than this board floorplan.',
      characteristics: [
        { name: 'Main package', value: 'The large central GPU package contains the processing die.' },
        { name: 'Local memory', value: 'Memory packages are mounted around the GPU package.' },
        { name: 'Connections', value: 'Gold card-edge contacts provide the host attachment; display and auxiliary power connectors are separate physical connections.' },
        { name: 'Board support', value: 'Power stages, inductors, capacitors, and PCB conductors support the GPU and memory.' },
      ],
      documentation: [this.architectureDocumentation],
    },
    'gpu-die': {
      photos: GpuIllustrations.chip,
      overview: 'The GPU die is the silicon inside the package that implements graphics, parallel computation, memory access, and display-related functions.',
      problem: 'It integrates the processing and interface circuitry needed to execute GPU workloads.',
      characteristicNote: 'The close-up visibly carries the marking AD104-250-A1; the board photo carries a different AD104 marking. These are distinct examples. The package photograph does not locate shader cores, caches, schedulers, or other internal circuits on the exposed surface.',
      characteristics: [
        { name: 'Die', value: 'The central exposed surface is the GPU die.' },
        { name: 'Substrate', value: 'The surrounding package substrate supports the die and routes its connections to the board.' },
        { name: 'Schematic scope', value: 'Nested blocks describe logical functions. Their positions and quantities are not measurements from this photograph.' },
      ],
      documentation: [this.architectureDocumentation],
    },
    'gpu-vram': this.memoryInformation,
    'gpu-vram-chip': this.memoryInformation,
    'gpu-power': {
      photos: GpuIllustrations.power,
      overview: 'Graphics-card voltage regulators convert incoming DC power into the supply rails required by the GPU and memory.',
      problem: 'They provide controlled local voltages and current for components with changing workloads.',
      characteristicNote: 'The regulator and power-header photos are separate examples. The header is identified only by its visible housing and board tails; its exact pinout and compatibility with the main card are not established by the photograph.',
      characteristics: [
        { name: 'Power stage', value: 'The SiC788A-marked ICs illustrate integrated switching power stages. Vishay describes the SiC788A family as a driver and MOSFET power-stage solution.' },
        { name: 'Inductors and capacitors', value: 'The highlighted choke and capacitor are parts of the regulator output network.' },
        { name: 'Power attachment', value: 'Cards can receive power through the PCIe slot and supported auxiliary connectors. Connector keying and pin assignments depend on the specified interface.' },
      ],
      documentation: [{
        title: 'Vishay / SiC788 and SiC788A integrated power stages',
        url: 'https://www.vishay.com/docs/62985/sic788a.pdf',
      }, {
        title: 'Intel / DC connectors: distinct CPU and PCIe auxiliary power connections',
        url: 'https://edc.intel.com/content/www/us/en/design/products-and-solutions/processors-and-chipsets/alder-lake-s/atx12vo-12v-only-desktop-power-supply-design-guide/dc-connectors/',
      }],
    },
    'gpu-display-ports': {
      photos: GpuIllustrations.displayPorts,
      overview: 'Physical display connectors attach the GPU display outputs to monitor cables. HDMI and DisplayPort are alternative interfaces supported by different cards.',
      problem: 'They provide removable electrical connections for display streams and the control signals required by the supported interface.',
      characteristicNote: 'Both supplied connector photos are HDMI examples: one board receptacle and one disassembled cable plug. They are separate products and do not establish the model, HDMI version, or supported display modes of the main graphics card. No DisplayPort connector is pictured in this pair.',
      characteristics: [
        { name: 'Receptacle', value: 'The metal shell surrounds an insulating contact tongue; solder tails connect the socket to the PCB.' },
        { name: 'Plug assembly', value: 'The separate insert, shell halves, strain-relief boot, and screws form the pictured cable-end connector.' },
        { name: 'Interface', value: 'Standard HDMI Type A uses 19 contacts. Supported bandwidth and display modes depend on the complete implementation, rather than connector appearance alone.' },
      ],
      documentation: [{
        title: 'Intel / HDMI cable and connector types',
        url: 'https://www.intel.com/content/www/us/en/support/articles/000029650/graphics.html',
      }],
    },
  }

  public static get(regionId: string | null): HardwareElementInformation | null {
    if (regionId === null) return null
    return this.entries[regionId] ?? GpuProcessingInformation.get(regionId) ?? GpuVramInformation.get(regionId)
  }
}
