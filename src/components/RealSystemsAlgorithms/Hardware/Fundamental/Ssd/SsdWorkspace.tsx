import type { ReactNode } from 'react'
import ComponentFlowWorkspace from '../ComponentFlowWorkspace.tsx'
import type { ComponentPlaybackProps } from '../ComponentWorkspace.tsx'
import { SsdAlgorithmCatalog } from './SsdAlgorithmCatalog.ts'
import WriteOnePage from './WriteOnePage/WriteOnePage.tsx'
import ReadOnePage from './ReadOnePage/ReadOnePage.tsx'

export default class SsdWorkspace extends ComponentFlowWorkspace {
  protected readonly group = 'hardware-ssd' as const
  protected readonly componentLayer = 'ssd-components'
  protected readonly choices = SsdAlgorithmCatalog.choices

  protected renderLesson(props: ComponentPlaybackProps): ReactNode {
    switch (this.props.algorithm) {
      case 'ssd-write-page': return <WriteOnePage {...props} />
      case 'ssd-read-page': return <ReadOnePage {...props} />
    }
    return null
  }
}
