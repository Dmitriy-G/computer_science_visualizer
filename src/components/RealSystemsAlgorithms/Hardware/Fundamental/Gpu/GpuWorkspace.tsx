import type { ReactNode } from 'react'
import ComponentFlowWorkspace from '../ComponentFlowWorkspace.tsx'
import type { ComponentPlaybackProps } from '../ComponentWorkspace.tsx'
import { GpuAlgorithmCatalog } from './GpuAlgorithmCatalog.ts'
import FrameRendering from './FrameRendering/FrameRendering.tsx'
import HashcatIteration from './HashcatIteration/HashcatIteration.tsx'

export default class GpuWorkspace extends ComponentFlowWorkspace {
  protected readonly group = 'hardware-gpu' as const
  protected readonly componentLayer = 'gpu-components'
  protected readonly choices = GpuAlgorithmCatalog.choices

  protected renderLesson(props: ComponentPlaybackProps): ReactNode {
    switch (this.props.algorithm) {
      case 'gpu-frame-rendering': return <FrameRendering {...props} />
      case 'gpu-hashcat-iteration': return <HashcatIteration {...props} />
    }
    return null
  }
}
