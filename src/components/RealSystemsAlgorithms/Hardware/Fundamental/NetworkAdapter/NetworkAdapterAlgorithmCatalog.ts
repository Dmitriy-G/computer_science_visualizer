import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import type { HardwareOverviewChoice } from '../HardwareOverviewChoice.ts'
import { ServerToNetworkAnimation } from './ServerToNetwork/ServerToNetworkAnimation.ts'
import { ServerToNetworkOverview } from './ServerToNetwork/ServerToNetworkOverview.ts'
import { NetworkToServerAnimation } from './NetworkToServer/NetworkToServerAnimation.ts'
import { NetworkToServerOverview } from './NetworkToServer/NetworkToServerOverview.ts'

export type NetworkAdapterAlgorithmKind = 'nic-server-to-network' | 'nic-network-to-server'

export class NetworkAdapterAlgorithmCatalog {
  public static readonly choices: readonly HardwareOverviewChoice<NetworkAdapterAlgorithmKind>[] = [
    { kind: 'nic-server-to-network', name: 'Server to network', description: 'Move one small Ethernet frame from server memory through DMA, MAC, and PHY onto the link.', components: ['Network Adapter'], architectures: [] },
    { kind: 'nic-network-to-server', name: 'Network to server', description: 'Check an incoming frame and deliver it through the RX buffer and DMA into server memory.', components: ['Network Adapter'], architectures: [] },
  ]

  public static definition(kind: NetworkAdapterAlgorithmKind): ActionDefinition<HardwareSnapshot> {
    switch (kind) {
      case 'nic-server-to-network': return new ServerToNetworkAnimation()
      case 'nic-network-to-server': return new NetworkToServerAnimation()
    }
    throw new RangeError('Unknown network adapter overview')
  }

  public static describeOverview(kind: NetworkAdapterAlgorithmKind): SystemOverviewInformation {
    switch (kind) {
      case 'nic-server-to-network': return ServerToNetworkOverview.describe()
      case 'nic-network-to-server': return NetworkToServerOverview.describe()
    }
    throw new RangeError('Unknown network adapter overview')
  }

  public static describe(kind: NetworkAdapterAlgorithmKind): AlgorithmInformation {
    switch (kind) {
      case 'nic-server-to-network': return ServerToNetworkAnimation.describe()
      case 'nic-network-to-server': return NetworkToServerAnimation.describe()
    }
    throw new RangeError('Unknown network adapter overview')
  }
}
