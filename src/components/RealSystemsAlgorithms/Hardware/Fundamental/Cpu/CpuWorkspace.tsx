import type { ReactNode } from 'react'
import type { Scene } from '../../../../../visualization/Scene.ts'
import { SystemOverviewLayout } from '../../../SystemOverview/SystemOverviewLayout.ts'
import ComponentWorkspace from '../ComponentWorkspace.tsx'
import type { ComponentPlaybackProps } from '../ComponentWorkspace.tsx'
import { CpuAlgorithmCatalog } from './CpuAlgorithmCatalog.ts'
import { CpuOperationTrace } from './CpuOperationTrace.ts'
import NonAtomicIncrement from './NonAtomicIncrement/NonAtomicIncrement.tsx'
import AtomicLoad from './AtomicLoad/AtomicLoad.tsx'

export default class CpuWorkspace extends ComponentWorkspace {
  protected readonly group = 'hardware-cpu' as const
  protected readonly choices = CpuAlgorithmCatalog.choices
  private readonly preview = this.props.previewScene ?? SystemOverviewLayout.create('cpu', null)

  protected presentScene(scene: Scene | null): Scene {
    return scene?.layers?.some((layer) => layer.id === 'cpu-core') ? CpuOperationTrace.present(scene, this.preview) : this.preview
  }

  protected renderLesson(props: ComponentPlaybackProps): ReactNode {
    switch (this.props.algorithm) {
      case 'cpu-non-atomic-increment': return <NonAtomicIncrement {...props} />
      case 'cpu-atomic-load': return <AtomicLoad {...props} />
    }
    return null
  }
}
