import type { Scene } from '../../../../../visualization/Scene.ts'

export class HddViewportLayout {
  public static present(scene: Scene | null): Scene | null {
    if (!scene?.camera || scene.countLabel !== 'HDD component groups') return scene
    const layer = scene.layers?.find((candidate) => candidate.id === 'hdd-components')
    if (!layer) return scene
    return { ...scene, width: layer.scene.width + 40, height: layer.scene.height + 40, viewportFit: 'width' }
  }
}
