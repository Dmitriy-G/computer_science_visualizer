import type { Scene } from '../../../../visualization/Scene.ts'
import ComponentWorkspace from './ComponentWorkspace.tsx'
import { ComponentFlowTrace } from './ComponentFlowTrace.ts'

export default abstract class ComponentFlowWorkspace extends ComponentWorkspace {
  protected abstract readonly componentLayer: string
  private readonly preview = this.props.previewScene

  protected presentScene(scene: Scene | null): Scene | null {
    if (!this.preview || scene?.kind !== 'hardware-component') return this.preview
    return ComponentFlowTrace.present(scene, this.preview, this.componentLayer)
  }
}
