import type { Scene, SceneNode } from '../../../../../visualization/Scene.ts'
import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { CpuCoreLayout } from '../CpuCore/CpuCoreLayout.ts'
import { CpuLayout } from './CpuLayout.ts'

export interface CpuOperationActivity {
  readonly from: string | null
  readonly to: string | null
  readonly message: string
  readonly peer?: boolean
}

export class CpuOperationLayout {
  public static create(values: ReadonlyMap<string, string>, activity: CpuOperationActivity): Scene {
    const scene = CpuLayout.create()
    const layer = scene.layers![0]
    const core = layer.scene
    const diagram = new HardwareDiagram(core.width, core.height)
    for (const region of core.regions!) diagram.regions.push({ ...region, shortLabel: region.shortLabel?.replace(/\s*\(~[^)]*\)/g, '') })
    const placements: readonly [string, string, string][] = [
      ['fetch', 'instruction-fetch', 'PC'], ['decode', 'instruction-decoder', 'Instruction'],
      ['queue', 'instruction-queue', 'Decoded instruction'], ['dispatch', 'dispatch-allocation', 'Dispatch'],
      ['issue', 'instruction-scheduler', 'Issue'], ['address', 'address-generation', 'Address'],
      ['translation', 'data-tlb', 'Translation'], ['memory', 'data-cache', 'Coherent L1 data'],
      ['lsu', 'load-store', 'Load / store buffer'], ['register', 'register-files', 'Private register r'],
      ['alu', 'integer-alus', 'Integer ALU'], ['retirement', 'reorder-retirement', 'Retirement'],
      ['committed', 'architectural-state', 'Local architectural state'],
    ]
    for (const [id, component, label] of placements) {
      const region = diagram.regions.find((candidate) => candidate.id === `component-${component}`)!
      diagram.fixture(`cpu-op-${id}`, label, values.get(id) ?? 'idle', region.x + region.width / 2,
        region.y + (region.height > 200 ? region.height / 2 : 110), '', Math.min(520, region.width - 40), 44)
    }
    if (activity.from && activity.to) {
      diagram.connect('cpu-operation-transfer', `cpu-op-${activity.from}`, `cpu-op-${activity.to}`, activity.message, true, 0, activity.message)
      CpuCoreLayout.route(diagram)
    }
    const nodes: SceneNode[] = []
    for (let index = 0; index < diagram.positions.length; index += 1) {
      const position = diagram.positions[index]
      const cell = diagram.fixtures[index]
      nodes.push({
        id: cell.id, value: index, displayValue: cell.value, label: cell.label, status: '',
        x: position.x, y: position.y, width: position.width, height: position.height,
        opacity: 1, tone: cell.id === `cpu-op-${activity.to}` ? 'active' : 'default',
      })
    }
    const paths = []
    for (const path of scene.paths!) {
      paths.push(activity.peer && path.id === 'cpu-core-fabric' ? {
        ...path, d: 'M3050 1140H2960V2435H2880', highlighted: true, bidirectional: false,
        label: 'Another core publishes a coherent store / cache-coherence details are abstracted',
      } : path)
    }
    return {
      ...scene, paths,
      layers: [{ ...layer, scene: {
        ...core, kind: 'cpu-hardware', regions: diagram.regions, nodes, edges: diagram.edges,
        focusId: activity.to ? `cpu-op-${activity.to}` : null,
      } }],
    }
  }
}
