import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { CpuCoreLayout } from '../CpuCore/CpuCoreLayout.ts'

export class CpuDiagramCoreLayout {
  public static readonly width = 1760
  public static readonly height = 1340
  public static readonly blockWidth = 200
  public static readonly blockHeight = 130

  public static create(): HardwareDiagram {
    const source = CpuCoreLayout.create([], false)
    CpuCoreLayout.pipeline(source)
    const diagram = new HardwareDiagram(this.width, this.height)
    const bounds = new Map<string, readonly [number, number, number, number]>([
      ['core', [20, 20, 1720, 1300]],
      ['front-end', [40, 90, 800, 420]],
      ['scheduling', [920, 90, 800, 420]],
      ['execution', [40, 670, 800, 420]],
      ['memory-access', [920, 670, 800, 420]],
      ['component-instruction-fetch', [80, 150, 200, 130]],
      ['component-instruction-decoder', [340, 150, 200, 130]],
      ['component-instruction-queue', [600, 150, 200, 130]],
      ['component-instruction-tlb', [80, 330, 200, 130]],
      ['component-instruction-cache', [340, 330, 200, 130]],
      ['component-branch-predictor', [600, 330, 200, 130]],
      ['component-register-renaming', [960, 150, 200, 130]],
      ['component-rename-map', [1220, 150, 200, 130]],
      ['component-dispatch-allocation', [1480, 150, 200, 130]],
      ['component-instruction-scheduler', [960, 330, 200, 130]],
      ['component-register-files', [1220, 330, 200, 130]],
      ['component-architectural-state', [1480, 330, 200, 130]],
      ['component-integer-alus', [80, 730, 200, 130]],
      ['component-floating-point-simd', [340, 730, 200, 130]],
      ['component-exception-control', [600, 730, 200, 130]],
      ['component-reorder-retirement', [80, 910, 200, 130]],
      ['component-address-generation', [960, 730, 200, 130]],
      ['component-data-cache', [1220, 730, 200, 130]],
      ['component-data-tlb', [1480, 730, 200, 130]],
      ['component-address-translation', [960, 910, 200, 130]],
      ['component-load-store', [1220, 910, 200, 130]],
      ['component-l2-cache', [340, 1130, 200, 130]],
      ['component-cache-interface', [1220, 1130, 200, 130]],
    ])
    for (const region of source.regions) {
      const geometry = bounds.get(region.id)
      if (!geometry) throw new Error(`Missing CPU diagram geometry: ${region.id}`)
      const [x, y, regionWidth, regionHeight] = geometry
      const component = region.id.startsWith('component-')
      const width = component ? this.blockWidth : regionWidth
      const height = component ? this.blockHeight : regionHeight
      let titleFontSize = region.id === 'core' ? 34 : 32
      if (component) {
        for (const word of (region.shortLabel ?? region.label).split(' ')) {
          titleFontSize = Math.min(titleFontSize, Math.floor((width - 32) / (Math.max(1, word.length) * 0.62)))
        }
        if (region.id === 'component-register-files' || region.id === 'component-reorder-retirement') titleFontSize = 24
      }
      diagram.regions.push({ ...region, x, y, width, height, titleFontSize })
    }
    const routes = new Map<string, string>([
      ['pipeline-fetch-decode', 'M280 215H340'],
      ['pipeline-decode-queue', 'M540 215H600'],
      ['pipeline-queue-rename', 'M800 215H960'],
      ['pipeline-rename-dispatch', 'M1060 150V140H1580V150'],
      ['pipeline-dispatch-issue', 'M1580 280V305H1060V330'],
      ['pipeline-issue-register-read', 'M1160 395H1220'],
      ['pipeline-issue-execute', 'M1320 460V590H48V765H80'],
      ['pipeline-execute-writeback', 'M80 825H30V630H1360V460'],
      ['pipeline-writeback-retire', 'M1280 460V550H900V975H280'],
      ['pipeline-fetch-itlb', 'M180 280V330'],
      ['pipeline-instruction-cache-l2', 'M540 395H570V1100H440V1130'],
      ['pipeline-data-cache-l2', 'M1420 795H1450V1120H460V1130'],
      ['pipeline-l2-interface', 'M540 1195H1220'],
    ])
    for (const path of source.paths) {
      const d = routes.get(path.id)
      if (!d) throw new Error(`Missing CPU diagram route: ${path.id}`)
      diagram.paths.push({ ...path, d })
    }
    return diagram
  }
}
