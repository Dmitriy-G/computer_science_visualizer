import type { ReactNode } from 'react'
import type { Scene } from '../../../../visualization/Scene.ts'
import ActionPlayback from '../../../ActionPlayback/ActionPlayback.tsx'
import ComponentWorkspace from './ComponentWorkspace.tsx'
import type { ComponentPlaybackProps } from './ComponentWorkspace.tsx'
import { HardwareOverviewCatalog } from './HardwareOverviewCatalog.ts'
import { ComponentFlowTrace } from './ComponentFlowTrace.ts'
import { CpuOperationTrace } from './Cpu/CpuOperationTrace.ts'
import { HddViewportLayout } from './Hdd/HddViewportLayout.ts'

export default class HardwareFundamentalWorkspace extends ComponentWorkspace {
  protected readonly group = 'hardware-fundamental' as const
  protected readonly choices = HardwareOverviewCatalog.choices

  protected presentScene(scene: Scene | null): Scene | null {
    const preview = this.props.previewScene
    if (!preview || !scene || !this.props.algorithm) return HddViewportLayout.present(preview)
    if (scene.layers?.some((layer) => layer.id === 'cpu-core')) return CpuOperationTrace.present(scene, preview)
    if (scene.kind !== 'hardware-component') return preview
    const group = HardwareOverviewCatalog.groupFor(this.props.algorithm)
    const presented = ComponentFlowTrace.present(scene, preview, `${group.slice('hardware-'.length)}-components`)
    return HddViewportLayout.present(presented)
  }

  protected renderLesson(props: ComponentPlaybackProps): ReactNode {
    if (!this.props.algorithm) return null
    return <ActionPlayback {...props} definition={HardwareOverviewCatalog.definition(this.props.algorithm)} />
  }
}
