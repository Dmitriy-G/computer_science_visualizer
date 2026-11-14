import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import type { HardwareOverviewChoice } from '../HardwareOverviewChoice.ts'
import { NetworkByteToSsdAnimation } from './NetworkByteToSsd/NetworkByteToSsdAnimation.ts'
import { NetworkByteToSsdOverview } from './NetworkByteToSsd/NetworkByteToSsdOverview.ts'

export type BusAlgorithmKind = 'bus-network-byte-to-ssd'

export class BusAlgorithmCatalog {
  public static readonly choices: readonly HardwareOverviewChoice<BusAlgorithmKind>[] = [
    { kind: 'bus-network-byte-to-ssd', name: 'Network byte to SSD', description: 'Receive SAVE 0x41, pass through RAM and CPU, and persist the byte in an SSD block.', components: ['Bus', 'CPU', 'RAM'], devices: ['SSD'], architectures: [] },
  ]

  public static definition(_kind: BusAlgorithmKind): ActionDefinition<HardwareSnapshot> { return new NetworkByteToSsdAnimation() }
  public static describeOverview(_kind: BusAlgorithmKind): SystemOverviewInformation { return NetworkByteToSsdOverview.describe() }
  public static describe(_kind: BusAlgorithmKind): AlgorithmInformation { return NetworkByteToSsdAnimation.describe() }
}
