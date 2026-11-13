import type { ReactNode } from 'react'
import ComponentWorkspace from '../ComponentWorkspace.tsx'
import type { ComponentPlaybackProps } from '../ComponentWorkspace.tsx'
import { SsdAlgorithmCatalog } from './SsdAlgorithmCatalog.ts'
import NandCell from '../NandCell/NandCell.tsx'
import SsdFtl from '../SsdFtl/SsdFtl.tsx'
import SsdGarbageCollection from '../SsdGarbageCollection/SsdGarbageCollection.tsx'
import SsdWearLeveling from '../SsdWearLeveling/SsdWearLeveling.tsx'

export default class SsdWorkspace extends ComponentWorkspace {
  protected readonly group = 'hardware-ssd' as const
  protected readonly choices = SsdAlgorithmCatalog.choices

  protected renderLesson(props: ComponentPlaybackProps): ReactNode {
    switch (this.props.algorithm) {
      case 'nand-cell': return <NandCell {...props} />
      case 'ssd-ftl': return <SsdFtl {...props} />
      case 'ssd-garbage-collection': return <SsdGarbageCollection {...props} />
      case 'ssd-wear-leveling': return <SsdWearLeveling {...props} />
    }
    return null
  }
}
