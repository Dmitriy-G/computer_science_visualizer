import type { ReactNode } from 'react'
import ComponentFlowWorkspace from '../ComponentFlowWorkspace.tsx'
import type { ComponentPlaybackProps } from '../ComponentWorkspace.tsx'
import { BusAlgorithmCatalog } from './BusAlgorithmCatalog.ts'

export default class BusWorkspace extends ComponentFlowWorkspace {
  protected readonly group = 'hardware-bus' as const
  protected readonly componentLayer = 'bus-components'
  protected readonly choices = BusAlgorithmCatalog.choices

  protected renderLesson(_props: ComponentPlaybackProps): ReactNode {
    return null
  }
}
