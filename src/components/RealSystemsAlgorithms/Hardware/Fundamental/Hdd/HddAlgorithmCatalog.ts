import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import type { HardwareOverviewChoice } from '../HardwareOverviewChoice.ts'
import { HddSectorAnimation } from '../HddSector/HddSectorAnimation.ts'
import { HddSectorOverview } from '../HddSector/HddSectorOverview.ts'

export type HddAlgorithmKind = 'hdd-sector'

export class HddAlgorithmCatalog {
  public static readonly choices: readonly HardwareOverviewChoice<HddAlgorithmKind>[] = [
    { kind: 'hdd-sector', name: 'HDD: locating a sector and recording magnetic data', description: 'A rotating magnetic platter, positioning servo, head, and read/write channel cooperate to store and recover sector data.', components: ['Disk'], architectures: [], devices: ['HDD'] },
  ]

  public static definition(kind: HddAlgorithmKind): ActionDefinition<HardwareSnapshot> {
    switch (kind) {
      case 'hdd-sector': return new HddSectorAnimation()
    }
    throw new RangeError('Unknown HDD overview')
  }

  public static describeOverview(kind: HddAlgorithmKind): SystemOverviewInformation {
    switch (kind) {
      case 'hdd-sector': return HddSectorOverview.describe()
    }
    throw new RangeError('Unknown HDD overview')
  }

  public static describe(kind: HddAlgorithmKind): AlgorithmInformation {
    switch (kind) {
      case 'hdd-sector': return HddSectorAnimation.describe()
    }
    throw new RangeError('Unknown HDD overview')
  }
}
