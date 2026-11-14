import type { ReactNode } from 'react'
import ComponentFlowWorkspace from '../ComponentFlowWorkspace.tsx'
import type { ComponentPlaybackProps } from '../ComponentWorkspace.tsx'
import { BusAlgorithmCatalog } from './BusAlgorithmCatalog.ts'
import NetworkByteToSsd from './NetworkByteToSsd/NetworkByteToSsd.tsx'

export default class BusWorkspace extends ComponentFlowWorkspace {
  protected readonly group = 'hardware-bus' as const
  protected readonly componentLayer = 'bus-components'
  protected readonly choices = BusAlgorithmCatalog.choices

  protected renderLesson(props: ComponentPlaybackProps): ReactNode {
    if (this.props.algorithm === 'bus-network-byte-to-ssd') return <NetworkByteToSsd {...props} />
    return null
  }
}
