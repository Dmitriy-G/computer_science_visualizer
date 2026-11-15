import type { HardwareOverviewChoice } from '../HardwareOverviewChoice.ts'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { WriteOnePageAnimation } from './WriteOnePage/WriteOnePageAnimation.ts'
import { ReadOnePageAnimation } from './ReadOnePage/ReadOnePageAnimation.ts'
import { WriteOnePageOverview } from './WriteOnePage/WriteOnePageOverview.ts'
import { ReadOnePageOverview } from './ReadOnePage/ReadOnePageOverview.ts'

export type SsdAlgorithmKind = 'ssd-write-page' | 'ssd-read-page'

export class SsdAlgorithmCatalog {
  public static readonly choices: readonly HardwareOverviewChoice<SsdAlgorithmKind>[] = [
    { kind: 'ssd-write-page', name: 'Write one page (2 KiB)', description: 'Program one complete NAND page through controller buffers, ECC, and charge-storage cells.', components: ['Disk'], architectures: [], devices: ['SSD'] },
    { kind: 'ssd-read-page', name: 'Read one page (2 KiB)', description: 'Sense one NAND page and return its checked data through the controller to the host.', components: ['Disk'], architectures: [], devices: ['SSD'] },
  ]

  public static definition(kind: SsdAlgorithmKind): ActionDefinition<HardwareSnapshot> {
    switch (kind) {
      case 'ssd-write-page': return new WriteOnePageAnimation()
      case 'ssd-read-page': return new ReadOnePageAnimation()
    }
    throw new RangeError('Unknown SSD overview')
  }

  public static describeOverview(kind: SsdAlgorithmKind): SystemOverviewInformation {
    switch (kind) {
      case 'ssd-write-page': return WriteOnePageOverview.describe()
      case 'ssd-read-page': return ReadOnePageOverview.describe()
    }
    throw new RangeError('Unknown SSD overview')
  }

  public static describe(kind: SsdAlgorithmKind): AlgorithmInformation {
    switch (kind) {
      case 'ssd-write-page': return WriteOnePageAnimation.describe()
      case 'ssd-read-page': return ReadOnePageAnimation.describe()
    }
    throw new RangeError('Unknown SSD overview')
  }
}
