import type { ReactNode } from 'react'
import ComponentWorkspace from '../ComponentWorkspace.tsx'
import type { ComponentPlaybackProps } from '../ComponentWorkspace.tsx'
import { HddAlgorithmCatalog } from './HddAlgorithmCatalog.ts'
import HddSector from '../HddSector/HddSector.tsx'

export default class HddWorkspace extends ComponentWorkspace {
  protected readonly group = 'hardware-hdd' as const
  protected readonly choices = HddAlgorithmCatalog.choices

  protected renderLesson(props: ComponentPlaybackProps): ReactNode {
    switch (this.props.algorithm) {
      case 'hdd-sector': return <HddSector {...props} />
    }
    return null
  }
}
