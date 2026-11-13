import type { ActionDefinition } from '../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../visualization/AlgorithmInformation.ts'
import type { SystemOverviewInformation } from '../../../../visualization/SystemOverviewInformation.ts'
import type { HardwareFundamentalGroupKind } from '../../../MainMenu/AdvancedAlgorithmCatalog.ts'
import type { HardwareSnapshot } from './HardwareSnapshot.ts'
import type { HardwareOverviewKind } from './HardwareOverviewKind.ts'
import type { HardwareOverviewChoice } from './HardwareOverviewChoice.ts'
export type { HardwareOverviewChoice } from './HardwareOverviewChoice.ts'
import { CpuAlgorithmCatalog } from './Cpu/CpuAlgorithmCatalog.ts'
import { RamAlgorithmCatalog } from './Ram/RamAlgorithmCatalog.ts'
import { HddAlgorithmCatalog } from './Hdd/HddAlgorithmCatalog.ts'
import { SsdAlgorithmCatalog } from './Ssd/SsdAlgorithmCatalog.ts'

export class HardwareOverviewCatalog {
  public static readonly choices: readonly HardwareOverviewChoice[] = [
    ...RamAlgorithmCatalog.choices,
    ...HddAlgorithmCatalog.choices,
    ...SsdAlgorithmCatalog.choices,
    ...CpuAlgorithmCatalog.choices,
  ]

  public static definition(kind: HardwareOverviewKind): ActionDefinition<HardwareSnapshot> {
    switch (kind) {
      case 'branch-prediction':
      case 'out-of-order':
      case 'register-renaming':
      case 'return-stack':
        return CpuAlgorithmCatalog.definition(kind)
      case 'ram-write-bit':
      case 'ram-read-bit':
        return RamAlgorithmCatalog.definition(kind)
      case 'hdd-sector':
        return HddAlgorithmCatalog.definition(kind)
      case 'nand-cell':
      case 'ssd-ftl':
      case 'ssd-garbage-collection':
      case 'ssd-wear-leveling':
        return SsdAlgorithmCatalog.definition(kind)
    }
    throw new RangeError('Unknown hardware component overview')
  }

  public static describeOverview(kind: HardwareOverviewKind): SystemOverviewInformation {
    switch (kind) {
      case 'branch-prediction':
      case 'out-of-order':
      case 'register-renaming':
      case 'return-stack':
        return CpuAlgorithmCatalog.describeOverview(kind)
      case 'ram-write-bit':
      case 'ram-read-bit':
        return RamAlgorithmCatalog.describeOverview(kind)
      case 'hdd-sector':
        return HddAlgorithmCatalog.describeOverview(kind)
      case 'nand-cell':
      case 'ssd-ftl':
      case 'ssd-garbage-collection':
      case 'ssd-wear-leveling':
        return SsdAlgorithmCatalog.describeOverview(kind)
    }
    throw new RangeError('Unknown hardware component overview')
  }

  public static describe(kind: HardwareOverviewKind): AlgorithmInformation {
    switch (kind) {
      case 'branch-prediction':
      case 'out-of-order':
      case 'register-renaming':
      case 'return-stack':
        return CpuAlgorithmCatalog.describe(kind)
      case 'ram-write-bit':
      case 'ram-read-bit':
        return RamAlgorithmCatalog.describe(kind)
      case 'hdd-sector':
        return HddAlgorithmCatalog.describe(kind)
      case 'nand-cell':
      case 'ssd-ftl':
      case 'ssd-garbage-collection':
      case 'ssd-wear-leveling':
        return SsdAlgorithmCatalog.describe(kind)
    }
    throw new RangeError('Unknown hardware component overview')
  }

  public static forGroup(group: HardwareFundamentalGroupKind): readonly HardwareOverviewChoice[] {
    switch (group) {
      case 'hardware-cpu': return CpuAlgorithmCatalog.choices
      case 'hardware-ram': return RamAlgorithmCatalog.choices
      case 'hardware-hdd': return HddAlgorithmCatalog.choices
      case 'hardware-ssd': return SsdAlgorithmCatalog.choices
    }
  }

  public static groupFor(kind: HardwareOverviewKind): HardwareFundamentalGroupKind {
    switch (kind) {
      case 'branch-prediction':
      case 'out-of-order':
      case 'register-renaming':
      case 'return-stack':
        return 'hardware-cpu'
      case 'ram-write-bit':
      case 'ram-read-bit':
        return 'hardware-ram'
      case 'hdd-sector':
        return 'hardware-hdd'
      case 'nand-cell':
      case 'ssd-ftl':
      case 'ssd-garbage-collection':
      case 'ssd-wear-leveling':
        return 'hardware-ssd'
    }
    throw new RangeError('Unknown hardware component overview')
  }
}
