import type { ReactNode } from 'react'
import ComponentFlowWorkspace from '../ComponentFlowWorkspace.tsx'
import type { ComponentPlaybackProps } from '../ComponentWorkspace.tsx'
import { HddAlgorithmCatalog } from './HddAlgorithmCatalog.ts'
import WriteOneSector from './WriteOneSector/WriteOneSector.tsx'
import ReadOneSector from './ReadOneSector/ReadOneSector.tsx'

export default class HddWorkspace extends ComponentFlowWorkspace {
  protected readonly group = 'hardware-hdd' as const
  protected readonly componentLayer = 'hdd-components'
  protected readonly choices = HddAlgorithmCatalog.choices

  protected renderLesson(props: ComponentPlaybackProps): ReactNode {
    switch (this.props.algorithm) {
      case 'hdd-write-sector': return <WriteOneSector {...props} />
      case 'hdd-read-sector': return <ReadOneSector {...props} />
    }
    return null
  }
}
