import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import type { HardwareOverviewChoice } from '../HardwareOverviewChoice.ts'
import { NandCellAnimation } from '../NandCell/NandCellAnimation.ts'
import { NandCellOverview } from '../NandCell/NandCellOverview.ts'
import { SsdFtlAnimation } from '../SsdFtl/SsdFtlAnimation.ts'
import { SsdFtlOverview } from '../SsdFtl/SsdFtlOverview.ts'
import { SsdGarbageCollectionAnimation } from '../SsdGarbageCollection/SsdGarbageCollectionAnimation.ts'
import { SsdGarbageCollectionOverview } from '../SsdGarbageCollection/SsdGarbageCollectionOverview.ts'
import { SsdWearLevelingAnimation } from '../SsdWearLeveling/SsdWearLevelingAnimation.ts'
import { SsdWearLevelingOverview } from '../SsdWearLeveling/SsdWearLevelingOverview.ts'

export type SsdAlgorithmKind = 'nand-cell' | 'ssd-ftl' | 'ssd-garbage-collection' | 'ssd-wear-leveling'

export class SsdAlgorithmCatalog {
  public static readonly choices: readonly HardwareOverviewChoice<SsdAlgorithmKind>[] = [
    { kind: 'nand-cell', name: 'NAND: charge storage, page access, and block erase', description: 'Stored charge shifts a NAND cell threshold; page access and whole-block erase expose that physical storage to a controller.', components: ['Disk'], architectures: [], devices: ['SSD'] },
    { kind: 'ssd-ftl', name: 'SSD FTL: logical-to-physical mapping and out-of-place updates', description: 'A Flash Translation Layer maps logical pages to flash locations and redirects updates to erased space.', components: ['Disk'], architectures: [], devices: ['SSD'] },
    { kind: 'ssd-garbage-collection', name: 'SSD garbage collection: reclaiming invalid pages', description: 'A flash controller preserves live pages and erases blocks containing obsolete copies to replenish erased space.', components: ['Disk'], architectures: [], devices: ['SSD'] },
    { kind: 'ssd-wear-leveling', name: 'SSD wear leveling: balancing block erases', description: 'Controller allocation and relocation spread erase use among usable flash blocks, including blocks occupied by cold data.', components: ['Disk'], architectures: [], devices: ['SSD'] },
  ]

  public static definition(kind: SsdAlgorithmKind): ActionDefinition<HardwareSnapshot> {
    switch (kind) {
      case 'nand-cell': return new NandCellAnimation()
      case 'ssd-ftl': return new SsdFtlAnimation()
      case 'ssd-garbage-collection': return new SsdGarbageCollectionAnimation()
      case 'ssd-wear-leveling': return new SsdWearLevelingAnimation()
    }
    throw new RangeError('Unknown SSD overview')
  }

  public static describeOverview(kind: SsdAlgorithmKind): SystemOverviewInformation {
    switch (kind) {
      case 'nand-cell': return NandCellOverview.describe()
      case 'ssd-ftl': return SsdFtlOverview.describe()
      case 'ssd-garbage-collection': return SsdGarbageCollectionOverview.describe()
      case 'ssd-wear-leveling': return SsdWearLevelingOverview.describe()
    }
    throw new RangeError('Unknown SSD overview')
  }

  public static describe(kind: SsdAlgorithmKind): AlgorithmInformation {
    switch (kind) {
      case 'nand-cell': return NandCellAnimation.describe()
      case 'ssd-ftl': return SsdFtlAnimation.describe()
      case 'ssd-garbage-collection': return SsdGarbageCollectionAnimation.describe()
      case 'ssd-wear-leveling': return SsdWearLevelingAnimation.describe()
    }
    throw new RangeError('Unknown SSD overview')
  }
}
