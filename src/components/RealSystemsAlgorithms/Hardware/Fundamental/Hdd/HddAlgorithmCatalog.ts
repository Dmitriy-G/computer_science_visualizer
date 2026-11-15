import type { HardwareOverviewChoice } from '../HardwareOverviewChoice.ts'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { WriteOneSectorAnimation } from './WriteOneSector/WriteOneSectorAnimation.ts'
import { ReadOneSectorAnimation } from './ReadOneSector/ReadOneSectorAnimation.ts'
import { WriteOneSectorOverview } from './WriteOneSector/WriteOneSectorOverview.ts'
import { ReadOneSectorOverview } from './ReadOneSector/ReadOneSectorOverview.ts'

export type HddAlgorithmKind = 'hdd-write-sector' | 'hdd-read-sector'

export class HddAlgorithmCatalog {
  public static readonly choices: readonly HardwareOverviewChoice<HddAlgorithmKind>[] = [
    { kind: 'hdd-write-sector', name: 'Write one sector (512 B)', description: 'Write the minimum logical sector through cache, ECC, encoding, and the positioned head.', components: ['Disk'], architectures: [], devices: ['HDD'] },
    { kind: 'hdd-read-sector', name: 'Read one sector (512 B)', description: 'Locate one logical sector and return its checked data through the read path and cache.', components: ['Disk'], architectures: [], devices: ['HDD'] },
  ]

  public static definition(kind: HddAlgorithmKind): ActionDefinition<HardwareSnapshot> {
    switch (kind) {
      case 'hdd-write-sector': return new WriteOneSectorAnimation()
      case 'hdd-read-sector': return new ReadOneSectorAnimation()
    }
    throw new RangeError('Unknown HDD overview')
  }

  public static describeOverview(kind: HddAlgorithmKind): SystemOverviewInformation {
    switch (kind) {
      case 'hdd-write-sector': return WriteOneSectorOverview.describe()
      case 'hdd-read-sector': return ReadOneSectorOverview.describe()
    }
    throw new RangeError('Unknown HDD overview')
  }

  public static describe(kind: HddAlgorithmKind): AlgorithmInformation {
    switch (kind) {
      case 'hdd-write-sector': return WriteOneSectorAnimation.describe()
      case 'hdd-read-sector': return ReadOneSectorAnimation.describe()
    }
    throw new RangeError('Unknown HDD overview')
  }
}
