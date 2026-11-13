import type { Scene, SceneLayer } from '../../../../../visualization/Scene.ts'

export class RamPlaybackLayout {
  public static create(scene: Scene, preview: Scene): Scene {
    const layers: SceneLayer[] = []
    for (const layer of preview.layers ?? []) {
      layers.push(layer.id === 'ram-components' ? { ...layer, scene } : layer)
    }
    return { ...preview, layers }
  }
}
