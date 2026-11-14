import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import type { Scene, SceneRegion } from '../../../../../visualization/Scene.ts'
import { GpuVramLayout } from './GpuVramLayout.ts'

export class GpuLayout {
  public static readonly width = 3400
  public static readonly height = 1450
  public static readonly componentCount = 9

  public static create(): Scene {
    const diagram = this.diagram()
    return {
      kind: 'system-overview', width: diagram.width, height: diagram.height,
      nodes: [], edges: [], regions: diagram.regions, paths: diagram.paths,
      count: this.componentCount, countLabel: 'GPU component groups', focusId: null,
    }
  }

  public static diagram(): HardwareDiagram {
    const diagram = new HardwareDiagram(this.width, this.height)
    diagram.region('gpu-board', 'GPU / illustrative discrete graphics card. Blocks represent logical functions, not a manufacturer floorplan. Unit counts and cache organization vary; integrated GPUs usually share system RAM instead of dedicated VRAM', 'device', 20, 20, 3360, 1410, 'system', undefined, 'GPU / discrete graphics card')
      .region('gpu-connector', 'Host connector / a discrete graphics card commonly connects to the computer through PCIe', 'interconnect', 60, 220, 260, 180, 'component', 'gpu-board', 'PCIe connector')
      .region('gpu-die', 'GPU chip / graphics, parallel computation, memory access, and display functions; this grouping does not specify exact physical placement or wiring', 'cpu', 380, 120, 1440, 1110, 'component', 'gpu-board', 'GPU chip')
      .region('gpu-host-interface', 'Host interface / exchanges commands and data with the computer over PCIe', 'interconnect', 440, 240, 260, 140, 'component', 'gpu-die', 'Host interface')
      .region('gpu-scheduler', 'Command processor and schedulers / accept work and schedule graphics or compute operations on available execution resources', 'device', 440, 450, 260, 170, 'component', 'gpu-die', 'Commands / scheduling')
      .region('gpu-raster', 'Geometry and rasterization / prepares primitives and generates fragments for pixel shading; this is a logical graphics path, not a cycle-by-cycle pipeline', 'device', 440, 760, 260, 140, 'component', 'gpu-die', 'Geometry / rasterization')
      .region('gpu-render-output', 'Render output units / perform operations such as depth/stencil tests and blending and write render results through the memory system; exact ordering and organization vary', 'device', 800, 790, 400, 160, 'component', 'gpu-die', 'Render output units')
      .region('gpu-cache', 'Cache / stores frequently used instructions and data near execution resources. This shared cache block abstracts the GPU cache hierarchy; local caches are not expanded', 'cache', 1300, 790, 400, 160, 'component', 'gpu-die', 'Shared cache')
      .region('gpu-memory-controllers', 'Memory controllers / manage data transfers between the GPU memory system and dedicated video memory', 'interconnect', 1300, 1050, 400, 120, 'component', 'gpu-die', 'Memory controllers')
      .region('gpu-display-engine', 'Display engine / reads a completed frame through the memory system and generates display timing and output streams', 'device', 440, 1030, 260, 140, 'component', 'gpu-die', 'Display engine')
      .region('gpu-display-ports', 'Display connections / interfaces such as HDMI or DisplayPort send display streams to monitors; available connectors depend on the card', 'interconnect', 2420, 1280, 860, 120, 'component', 'gpu-board', 'HDMI / DisplayPort')
      .region('gpu-power', 'Power regulation / converts input power into the supply voltages used by the GPU and memory', 'device', 440, 1320, 500, 80, 'component', 'gpu-board', 'Power regulation')
      .region('gpu-cooling', 'Cooling / heat spreader, heatsink, and often fans remove heat from the chip and board components; this is thermal support, not a data path', 'observer', 1120, 1320, 600, 80, 'component', 'gpu-board', 'Heatsink / cooling')
    this.addCompute(diagram)
    GpuVramLayout.add(diagram)
    this.connect(diagram)
    this.applyColors(diagram)
    return diagram
  }

  private static addCompute(diagram: HardwareDiagram): void {
    diagram.region('gpu-compute-clusters', 'Compute clusters / repeated execution groups, with one representative group expanded. Vendor names, counts, local caches, and allocation of specialized units vary', 'cpu', 800, 240, 950, 430, 'component', 'gpu-die', 'Compute clusters (one expanded)')
      .region('gpu-compute-cores', 'Compute cores / programmable parallel arithmetic units run shaders and general compute workloads', 'device', 840, 330, 400, 130, 'component', 'gpu-compute-clusters', 'Compute / shader cores')
      .region('gpu-texture-units', 'Texture units / fetch and filter texture samples requested by shaders through the memory hierarchy', 'device', 1300, 330, 400, 130, 'component', 'gpu-compute-clusters', 'Texture units')
      .region('gpu-ray-tracing', 'Optional ray tracing units / accelerate operations such as ray traversal and intersection tests; presence and organization depend on the GPU', 'device', 840, 510, 400, 100, 'component', 'gpu-compute-clusters', 'Ray tracing (optional)')
      .region('gpu-ai', 'Optional AI or matrix units / accelerate supported matrix operations; available operations and placement depend on the GPU', 'device', 1300, 510, 400, 100, 'component', 'gpu-compute-clusters', 'AI / matrix (optional)')
  }

  private static connect(diagram: HardwareDiagram): void {
    diagram.paths.push(
      { id: 'gpu-host-link', d: 'M320 310H440', label: 'Host commands and data / PCIe connection', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-command-input', d: 'M570 380V450', label: 'Commands from the host interface to the command processor', highlighted: false, directed: true },
      { id: 'gpu-schedule-compute', d: 'M700 535H760V395H840', label: 'Scheduled shader and compute work', highlighted: false, directed: true },
      { id: 'gpu-schedule-graphics', d: 'M570 620V760', label: 'Graphics commands to geometry and rasterization', highlighted: false, directed: true },
      { id: 'gpu-raster-shader', d: 'M700 830H780V440H840', label: 'Rasterized fragments to programmable shader cores', highlighted: false, directed: true },
      { id: 'gpu-vertex-raster', d: 'M840 410H790V800H700', label: 'Vertex shader results to primitive setup and rasterization', highlighted: false, directed: true },
      { id: 'gpu-texture-requests', d: 'M1240 370H1300', label: 'Shader texture requests and returned samples / texture access uses the memory hierarchy', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-ray-work', d: 'M1040 460V510', label: 'Optional ray tracing work and results', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-matrix-work', d: 'M1200 460V485H1500V510', label: 'Optional matrix operations and results', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-shader-output', d: 'M1240 425H1260V730H1000V790', label: 'Shaded fragments to render output operations', highlighted: false, directed: true },
      { id: 'gpu-render-cache', d: 'M1200 870H1300', label: 'Render output reads and writes through the memory system', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-compute-cache', d: 'M1240 445H1280V990H1540V950', label: 'Compute load/store traffic through the shared cache / logical memory path', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-texture-cache', d: 'M1700 395H1780V870H1700', label: 'Texture data fetched through the memory hierarchy / local texture caches omitted', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-cache-memory', d: 'M1500 950V1050', label: 'Cache fills and memory writeback through the memory controllers', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-memory-vram', d: 'M1700 1110H1880V490H1980V950H2060', label: 'Memory channels exchange payload data with GDDR data I/O / multiple channels grouped', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-memory-vram-command', d: 'M1700 1090H1860V430H2060', label: 'Memory controllers issue GDDR commands and addresses separately from payload data', highlighted: false, directed: true },
      { id: 'gpu-host-memory', d: 'M700 310H730V1200H1760V1140H1700', label: 'Host data transfers to and from the GPU memory system / transfer engines abstracted', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-frame-scanout', d: 'M1300 910H1240V990H740V1100H700', label: 'Display engine frame requests and returned data through the memory system / logical scanout path', highlighted: false, directed: true, bidirectional: true },
      { id: 'gpu-display-output', d: 'M570 1170V1260H1920V1340H2420', label: 'Display Engine to HDMI / DisplayPort / display signals originate only at the display engine; separate from memory-controller and VRAM traffic', highlighted: false, directed: true },
      { id: 'gpu-chip-power', d: 'M690 1320V1230', label: 'Regulated power to the GPU chip / dashed supply path', highlighted: false, directed: true, dashed: true },
      { id: 'gpu-memory-power', d: 'M940 1360V1420H3360V1140H3320', label: 'Regulated power to video memory / dashed supply path', highlighted: false, directed: true, dashed: true },
    )
  }

  private static applyColors(diagram: HardwareDiagram): void {
    for (let index = 0; index < diagram.regions.length; index += 1) {
      const region = diagram.regions[index]
      if (region.color) continue
      let color: SceneRegion['color'] = 'light-orange'
      if (region.id === 'gpu-board' || region.id === 'gpu-power' || region.id === 'gpu-cooling') color = 'neutral'
      else if (region.id === 'gpu-die' || region.id === 'gpu-compute-clusters') color = 'lavender'
      else if (region.id === 'gpu-cache' || region.id === 'gpu-vram') color = 'green'
      else if (region.role === 'interconnect') color = 'light-blue'
      diagram.regions[index] = { ...region, color }
    }
  }
}
