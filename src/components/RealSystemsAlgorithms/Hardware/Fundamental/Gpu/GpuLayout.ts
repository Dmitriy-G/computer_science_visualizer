import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import type { Scene, SceneRegion } from '../../../../../visualization/Scene.ts'
import { HardwareDiagramFrame } from '../../../../../visualization/HardwareDiagramFrame.ts'
import { GpuVramLayout } from './GpuVramLayout.ts'

export class GpuLayout {
  public static readonly externalLeft = 300
  public static readonly width = 3400 + this.externalLeft + 400
  public static readonly height = 1640
  public static readonly componentCount = 8
  private static readonly blockWidth = 400
  private static readonly blockHeight = 180

  public static create(): Scene {
    const diagram = this.diagram()
    return {
      kind: 'system-overview', width: diagram.width, height: diagram.height,
      nodes: [], edges: [], regions: diagram.regions, paths: diagram.paths,
      count: this.componentCount, countLabel: 'GPU component groups', focusId: null,
    }
  }

  public static diagram(): HardwareDiagram {
    const diagram = new HardwareDiagram(3400, this.height)
    diagram.region('gpu-board', 'GPU / illustrative discrete graphics card. Blocks represent logical functions, not a manufacturer floorplan. Unit counts and cache organization vary; integrated GPUs usually share system RAM instead of dedicated VRAM', 'device', 20, 20, 3360, 1580, 'system', undefined, 'GPU / discrete graphics card')
      .region('gpu-connector', 'Host PCIe connector / carries GPU DMA transfers between host RAM and the GPU memory system, alongside commands and other control transactions. DMA is a transfer mechanism using PCIe, not a second connector', 'interconnect', 60, 240, 260, 180, 'component', 'gpu-board', 'PCIe / DMA')
      .region('gpu-die', 'GPU chip / graphics, parallel computation, memory access, and display functions; this grouping does not specify exact physical placement or wiring', 'cpu', 380, 120, 1560, 1440, 'component', 'gpu-board', 'GPU chip')
      .region('gpu-host-interface', 'Host interface / exchanges commands and data with the computer over PCIe', 'interconnect', 420, 240, this.blockWidth, this.blockHeight, 'component', 'gpu-die', 'Host interface')
      .region('gpu-scheduler', 'Command processor and schedulers / accept work and schedule graphics or compute operations on available execution resources', 'device', 420, 600, this.blockWidth, this.blockHeight, 'component', 'gpu-die', 'Commands / scheduling')
      .region('gpu-raster', 'Geometry and rasterization / prepares primitives and generates fragments for pixel shading; this is a logical graphics path, not a cycle-by-cycle pipeline', 'device', 420, 960, this.blockWidth, this.blockHeight, 'component', 'gpu-die', 'Geometry / rasterization')
      .region('gpu-render-output', 'Render output units / perform operations such as depth/stencil tests and blending and write render results through the memory system; exact ordering and organization vary', 'device', 980, 960, this.blockWidth, this.blockHeight, 'component', 'gpu-die', 'Render output units')
      .region('gpu-cache', 'Cache / stores frequently used instructions and data near execution resources. This shared cache block abstracts the GPU cache hierarchy; local caches are not expanded', 'cache', 1460, 960, this.blockWidth, this.blockHeight, 'component', 'gpu-die', 'Shared cache')
      .region('gpu-memory-controllers', 'Memory controllers / manage data transfers between the GPU memory system and dedicated video memory', 'interconnect', 1460, 1320, this.blockWidth, this.blockHeight, 'component', 'gpu-die', 'Memory controllers')
      .region('gpu-display-engine', 'Display engine / reads a completed frame through the memory system and generates display timing and output streams', 'device', 420, 1320, this.blockWidth, this.blockHeight, 'component', 'gpu-die', 'Display engine')
      .region('gpu-display-ports', 'Display connections / interfaces such as HDMI or DisplayPort send display streams to monitors; available connectors depend on the card', 'interconnect', 2420, 1320, this.blockWidth, this.blockHeight, 'component', 'gpu-board', 'HDMI / DisplayPort')
      .region('gpu-power', 'Power regulation / converts input power into the supply voltages used by the GPU and memory', 'device', 60, 1320, 260, 180, 'component', 'gpu-board', 'Power regulation')
    this.addCompute(diagram)
    GpuVramLayout.add(diagram)
    this.connect(diagram)
    this.applyColors(diagram)
    const framed = HardwareDiagramFrame.create(diagram, this.externalLeft, 400)
    framed.paths.push(
      { id: 'gpu-external-host', d: 'M360 330H20', label: 'PCIe / DMA / GPU transfer engines move data between mapped host RAM and the GPU memory system over this host link. Commands, MMIO, and completions also share PCIe; not every transaction is DMA', directed: true, bidirectional: true, highlighted: false, caption: { text: 'PCIe / DMA', x: 40, y: 362 } },
      { id: 'gpu-external-display', d: 'M3120 1410H4060', label: 'HDMI / DisplayPort connector to an external display / driven by the Display Engine, independently of VRAM memory-controller signals', directed: true, highlighted: false, caption: { text: 'HDMI / DisplayPort', x: 3730, y: 1388 } },
      { id: 'gpu-external-power', d: 'M20 1410H360', label: 'DC input from PCIe slot and auxiliary graphics-card power connectors where fitted / grouped supply to card regulators, not AC power', directed: true, stroke: '#b58a45', highlighted: false, caption: { text: 'Slot / auxiliary\nDC', x: 40, y: 1442 } },
    )
    return framed
  }

  private static addCompute(diagram: HardwareDiagram): void {
    diagram.region('gpu-compute-clusters', 'Compute clusters / repeated execution groups, with one representative group expanded. Vendor names, counts, local caches, and allocation of specialized units vary', 'cpu', 940, 160, 960, 680, 'component', 'gpu-die', 'Compute clusters (one expanded)')
      .region('gpu-compute-cores', 'Compute cores / programmable parallel arithmetic units run shaders and general compute workloads', 'device', 980, 240, this.blockWidth, this.blockHeight, 'component', 'gpu-compute-clusters', 'Compute / shader cores')
      .region('gpu-texture-units', 'Texture units / fetch and filter texture samples requested by shaders through the memory hierarchy', 'device', 1460, 240, this.blockWidth, this.blockHeight, 'component', 'gpu-compute-clusters', 'Texture units')
      .region('gpu-ray-tracing', 'Optional ray tracing units / accelerate operations such as ray traversal and intersection tests; presence and organization depend on the GPU', 'device', 980, 600, this.blockWidth, this.blockHeight, 'component', 'gpu-compute-clusters', 'Ray tracing (optional)')
      .region('gpu-ai', 'Optional AI or matrix units / accelerate supported matrix operations; available operations and placement depend on the GPU', 'device', 1460, 600, this.blockWidth, this.blockHeight, 'component', 'gpu-compute-clusters', 'AI / matrix (optional)')
  }

  private static connect(diagram: HardwareDiagram): void {
    diagram.paths.push(
      { id: 'gpu-host-link', d: 'M320 330H420', label: 'PCIe host commands and data / includes DMA transfers between host RAM and GPU memory through the host interface', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-command-input', d: 'M620 420V600', label: 'Commands from the host interface to the command processor', highlighted: false, directed: true },
      { id: 'gpu-schedule-compute', d: 'M820 690H900V330H980', label: 'Scheduled shader and compute work', highlighted: false, directed: true },
      { id: 'gpu-schedule-graphics', d: 'M620 780V960', label: 'Graphics commands to geometry and rasterization', highlighted: false, directed: true },
      { id: 'gpu-raster-shader', d: 'M820 1080H930V390H980', label: 'Rasterized fragments to programmable shader cores', highlighted: false, directed: true },
      { id: 'gpu-vertex-raster', d: 'M980 360H870V1020H820', label: 'Vertex shader results to primitive setup and rasterization', highlighted: false, directed: true },
      { id: 'gpu-texture-requests', d: 'M1380 330H1460', label: 'Shader texture requests and returned samples / texture access uses the memory hierarchy', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-ray-work', d: 'M1180 420V600', label: 'Optional ray tracing work and results', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-matrix-work', d: 'M1320 420V510H1660V600', label: 'Optional matrix operations and results', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-shader-output', d: 'M1380 370H1400V1020H1380', label: 'Shaded fragments to render output operations', highlighted: false, directed: true },
      { id: 'gpu-render-cache', d: 'M1380 1050H1460', label: 'Render output reads and writes through the memory system', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-compute-cache', d: 'M1380 400H1430V1080H1460', label: 'Compute load/store traffic through the shared cache / logical memory path', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-texture-cache', d: 'M1860 330H1910V1050H1860', label: 'Texture data fetched through the memory hierarchy / local texture caches omitted', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-cache-memory', d: 'M1660 1140V1320', label: 'Cache fills and memory writeback through the memory controllers', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-memory-vram', d: 'M1860 1410H1980V950H2060', label: 'Memory channels exchange payload data with GDDR data I/O / multiple channels grouped', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-memory-vram-command', d: 'M1860 1360H1950V430H2060', label: 'Memory controllers issue GDDR commands and addresses separately from payload data', highlighted: false, directed: true },
      { id: 'gpu-host-memory', d: 'M820 330H840V1380H1460', label: 'Host DMA data transfers to and from the GPU memory system / PCIe host interface to memory controllers, with transfer engines abstracted', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-frame-scanout', d: 'M1580 1140V1230H700V1320', label: 'Display engine frame requests and returned data through the memory system / logical scanout path', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-display-output', d: 'M620 1500V1540H2620V1500', label: 'Display Engine to HDMI / DisplayPort / display signals originate only at the display engine; separate from memory-controller and VRAM traffic', highlighted: false, directed: true },
    )
  }

  private static applyColors(diagram: HardwareDiagram): void {
    for (let index = 0; index < diagram.regions.length; index += 1) {
      const region = diagram.regions[index]
      if (region.color) continue
      let color: SceneRegion['color'] = 'light-orange'
      if (region.id === 'gpu-board' || region.id === 'gpu-power') color = 'neutral'
      else if (region.id === 'gpu-die') color = 'lavender'
      else if (region.id === 'gpu-compute-clusters') color = 'light-blue'
      else if (region.id === 'gpu-cache' || region.id === 'gpu-vram') color = 'green'
      else if (region.role === 'interconnect') color = 'light-blue'
      diagram.regions[index] = { ...region, color }
    }
  }
}
