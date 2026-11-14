import type { ReactNode } from 'react'
import ComponentFlowWorkspace from '../ComponentFlowWorkspace.tsx'
import type { ComponentPlaybackProps } from '../ComponentWorkspace.tsx'
import { NetworkAdapterAlgorithmCatalog } from './NetworkAdapterAlgorithmCatalog.ts'
import ServerToNetwork from './ServerToNetwork/ServerToNetwork.tsx'
import NetworkToServer from './NetworkToServer/NetworkToServer.tsx'

export default class NetworkAdapterWorkspace extends ComponentFlowWorkspace {
  protected readonly group = 'hardware-network-adapter' as const
  protected readonly componentLayer = 'network-adapter-components'
  protected readonly choices = NetworkAdapterAlgorithmCatalog.choices

  protected renderLesson(props: ComponentPlaybackProps): ReactNode {
    switch (this.props.algorithm) {
      case 'nic-server-to-network': return <ServerToNetwork {...props} />
      case 'nic-network-to-server': return <NetworkToServer {...props} />
    }
    return null
  }
}
