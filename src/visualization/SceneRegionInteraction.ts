import type { Scene } from './Scene.ts'

export class SceneRegionInteraction {
  public static boundaryPaths(scene: Scene, regionId: string | null): ReadonlySet<string> {
    const paths = new Set<string>()
    const regions = scene.regions ?? []
    if (!regionId || !regions.some((region) => region.id === regionId)) return paths
    const children = new Map<string, string[]>()
    for (const region of regions) {
      if (!region.parentId) continue
      const siblings = children.get(region.parentId) ?? []
      siblings.push(region.id)
      children.set(region.parentId, siblings)
    }
    const inside = new Set<string>()
    const pending = [regionId]
    while (pending.length > 0) {
      const id = pending.pop()!
      if (inside.has(id)) continue
      inside.add(id)
      for (const child of children.get(id) ?? []) pending.push(child)
    }
    for (const path of scene.paths ?? []) {
      const fromInside = path.fromRegionId !== undefined && inside.has(path.fromRegionId)
      const toInside = path.toRegionId !== undefined && inside.has(path.toRegionId)
      if (fromInside !== toInside) paths.add(path.id)
    }
    return paths
  }
}
