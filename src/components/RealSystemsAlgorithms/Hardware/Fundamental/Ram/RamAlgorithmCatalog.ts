import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import type { HardwareOverviewChoice } from '../HardwareOverviewChoice.ts'
import { WriteOneBitAnimation } from './WriteOneBit/WriteOneBitAnimation.ts'
import { WriteOneBitOverview } from './WriteOneBit/WriteOneBitOverview.ts'
import { ReadOneBitAnimation } from './ReadOneBit/ReadOneBitAnimation.ts'
import { ReadOneBitOverview } from './ReadOneBit/ReadOneBitOverview.ts'

export type RamAlgorithmKind = 'ram-write-bit' | 'ram-read-bit'

export class RamAlgorithmCatalog {
  public static readonly choices: readonly HardwareOverviewChoice<RamAlgorithmKind>[] = [
    { kind: 'ram-write-bit', name: 'Write one bit', description: 'Follow a selected write bit through the controller, row buffer, transistor, and storage capacitor.', components: ['RAM'], architectures: [] },
    { kind: 'ram-read-bit', name: 'Read one bit', description: 'Activate and restore a row, then follow its selected bit back to the memory controller.', components: ['RAM'], architectures: [] },
  ]

  public static definition(kind: RamAlgorithmKind): ActionDefinition<HardwareSnapshot> {
    switch (kind) {
      case 'ram-write-bit': return new WriteOneBitAnimation()
      case 'ram-read-bit': return new ReadOneBitAnimation()
    }
    throw new RangeError('Unknown RAM overview')
  }

  public static describeOverview(kind: RamAlgorithmKind): SystemOverviewInformation {
    switch (kind) {
      case 'ram-write-bit': return WriteOneBitOverview.describe()
      case 'ram-read-bit': return ReadOneBitOverview.describe()
    }
    throw new RangeError('Unknown RAM overview')
  }

  public static describe(kind: RamAlgorithmKind): AlgorithmInformation {
    switch (kind) {
      case 'ram-write-bit': return WriteOneBitAnimation.describe()
      case 'ram-read-bit': return ReadOneBitAnimation.describe()
    }
    throw new RangeError('Unknown RAM overview')
  }
}
