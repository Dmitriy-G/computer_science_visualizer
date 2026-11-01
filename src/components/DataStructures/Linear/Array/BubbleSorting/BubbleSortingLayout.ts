import { ArrayLayout } from '../ArrayLayout.ts'
import type { ArrayEntry } from '../FixedArray.ts'
import type { Scene, SceneNode, SceneSlot } from '../../../../../visualization/Scene.ts'

export class BubbleSortingLayout {
  public create(entries: readonly ArrayEntry[], sortedFrom = entries.length, activeIndex = -1, swapping = false): Scene {
    const scene = new ArrayLayout().create(entries)
    const nodes: SceneNode[] = []
    const slots: SceneSlot[] = []
    const sourceSlots = scene.slots ?? []
    for (let index = 0; index < scene.nodes.length; index += 1) {
      const active = activeIndex >= 0 && (index === activeIndex || index === activeIndex + 1)
      const sorted = index >= sortedFrom
      nodes.push({
        ...scene.nodes[index],
        tone: active ? 'active' : sorted ? 'visited' : 'default',
        status: active ? swapping ? 'SWAP' : 'COMPARE' : sorted ? 'SORTED' : undefined,
      })
    }
    for (let index = 0; index < sourceSlots.length; index += 1) {
      slots.push({ ...sourceSlots[index], highlighted: activeIndex >= 0 && (index === activeIndex || index === activeIndex + 1) })
    }
    return { ...scene, nodes, slots, focusId: activeIndex >= 0 ? entries[activeIndex].id : null }
  }
}
