import type { ActionDefinition } from '../../../../visualization/ActionDefinition.ts'
import { AdvancedAlgorithmCatalog } from '../../../MainMenu/AdvancedAlgorithmCatalog.ts'
import type { HardwareFundamentalGroupKind } from '../../../MainMenu/AdvancedAlgorithmCatalog.ts'
import { LatchAnimation } from './Latch/LatchAnimation.ts'
import { LatchOverview } from './Latch/LatchOverview.ts'
import { SramCellAnimation } from './SramCell/SramCellAnimation.ts'
import { SramCellOverview } from './SramCell/SramCellOverview.ts'
import { DramRowAnimation } from './DramRow/DramRowAnimation.ts'
import { DramRowOverview } from './DramRow/DramRowOverview.ts'
import { HddSectorAnimation } from './HddSector/HddSectorAnimation.ts'
import { HddSectorOverview } from './HddSector/HddSectorOverview.ts'
import { NandCellAnimation } from './NandCell/NandCellAnimation.ts'
import { NandCellOverview } from './NandCell/NandCellOverview.ts'
import { SsdFtlAnimation } from './SsdFtl/SsdFtlAnimation.ts'
import { SsdFtlOverview } from './SsdFtl/SsdFtlOverview.ts'
import { SsdGarbageCollectionAnimation } from './SsdGarbageCollection/SsdGarbageCollectionAnimation.ts'
import { SsdGarbageCollectionOverview } from './SsdGarbageCollection/SsdGarbageCollectionOverview.ts'
import { SsdWearLevelingAnimation } from './SsdWearLeveling/SsdWearLevelingAnimation.ts'
import { SsdWearLevelingOverview } from './SsdWearLeveling/SsdWearLevelingOverview.ts'
import type { OverviewArchitectureKind, OverviewComponentKind, OverviewDeviceKind } from '../../../../visualization/OverviewComponent.ts'
import type { AlgorithmInformation } from '../../../../visualization/AlgorithmInformation.ts'
import type { SystemOverviewInformation } from '../../../../visualization/SystemOverviewInformation.ts'
import { BranchPredictionOverview } from './BranchPrediction/BranchPredictionOverview.ts'
import { OutOfOrderOverview } from './OutOfOrder/OutOfOrderOverview.ts'
import { RegisterRenamingOverview } from './RegisterRenaming/RegisterRenamingOverview.ts'
import { ReturnStackOverview } from './ReturnStack/ReturnStackOverview.ts'
import type { CpuAlgorithmKind, CpuModel } from './CpuModel.ts'
import { BranchPredictionAnimation } from './BranchPrediction/BranchPredictionAnimation.ts'
import { OutOfOrderAnimation } from './OutOfOrder/OutOfOrderAnimation.ts'
import { RegisterRenamingAnimation } from './RegisterRenaming/RegisterRenamingAnimation.ts'
import { ReturnStackAnimation } from './ReturnStack/ReturnStackAnimation.ts'

export interface CpuAlgorithmChoice {
  readonly kind: CpuAlgorithmKind
  readonly name: string
  readonly description: string
  readonly components: readonly OverviewComponentKind[]
  readonly architectures: readonly OverviewArchitectureKind[]
  readonly devices?: readonly OverviewDeviceKind[]
}

export class CpuAlgorithmCatalog {
  public static readonly choices: readonly CpuAlgorithmChoice[] = [
    { kind: 'latch', name: 'A latch: capturing and holding one bit', description: 'A powered, level-sensitive storage circuit follows D while enabled and keeps one bit while disabled.', components: ['RAM'], architectures: [] },
    { kind: 'sram-cell', name: 'SRAM cell: hold, read, and write', description: 'A conventional six-transistor SRAM cell stores complementary states using feedback and accesses them through two transistors.', components: ['RAM'], architectures: [] },
    { kind: 'dram-row', name: 'DRAM cell and row access: activate, sense, restore, precharge', description: 'A DRAM bank senses small capacitor signals into a row buffer, restores the open row, and selects columns for data transfer.', components: ['RAM'], architectures: [] },
    { kind: 'hdd-sector', name: 'HDD: locating a sector and recording magnetic data', description: 'A rotating magnetic platter, positioning servo, head, and read/write channel cooperate to store and recover sector data.', components: ['Disk'], architectures: [], devices: ['HDD'] },
    { kind: 'nand-cell', name: 'NAND: charge storage, page access, and block erase', description: 'Stored charge shifts a NAND cell threshold; page access and whole-block erase expose that physical storage to a controller.', components: ['Disk'], architectures: [] },
    { kind: 'ssd-ftl', name: 'SSD FTL: logical-to-physical mapping and out-of-place updates', description: 'A Flash Translation Layer maps logical pages to flash locations and redirects updates to erased space.', components: ['Disk'], architectures: [], devices: ['SSD'] },
    { kind: 'ssd-garbage-collection', name: 'SSD garbage collection: reclaiming invalid pages', description: 'A flash controller preserves live pages and erases blocks containing obsolete copies to replenish erased space.', components: ['Disk'], architectures: [], devices: ['SSD'] },
    { kind: 'ssd-wear-leveling', name: 'SSD wear leveling: balancing block erases', description: 'Controller allocation and relocation spread erase use among usable flash blocks, including blocks occupied by cold data.', components: ['Disk'], architectures: [], devices: ['SSD'] },
    { kind: 'branch-prediction', name: 'History-based branch prediction', description: 'Avoid fetch stalls by predicting unresolved branch direction.', components: ['CPU'], architectures: [] },
    { kind: 'out-of-order', name: 'Out-of-order execution', description: 'Keep ready work moving while an older instruction waits.', components: ['CPU'], architectures: [] },
    { kind: 'register-renaming', name: 'Register renaming', description: 'Remove false dependencies caused by reused register names.', components: ['CPU'], architectures: [] },
    { kind: 'return-stack', name: 'Return-address stack prediction', description: 'Predict changing return targets by tracking nested calls.', components: ['CPU'], architectures: [] },
  ]

  public static definition(kind: CpuAlgorithmKind): ActionDefinition<CpuModel> {
    switch (kind) {
      case 'latch': return new LatchAnimation()
      case 'sram-cell': return new SramCellAnimation()
      case 'dram-row': return new DramRowAnimation()
      case 'hdd-sector': return new HddSectorAnimation()
      case 'nand-cell': return new NandCellAnimation()
      case 'ssd-ftl': return new SsdFtlAnimation()
      case 'ssd-garbage-collection': return new SsdGarbageCollectionAnimation()
      case 'ssd-wear-leveling': return new SsdWearLevelingAnimation()
      case 'branch-prediction': return new BranchPredictionAnimation()
      case 'out-of-order': return new OutOfOrderAnimation()
      case 'register-renaming': return new RegisterRenamingAnimation()
      case 'return-stack': return new ReturnStackAnimation()
    }
  }

  public static forGroup(group: HardwareFundamentalGroupKind): readonly CpuAlgorithmChoice[] {
    const component = AdvancedAlgorithmCatalog.getGroup(group).component
    const choices: CpuAlgorithmChoice[] = []
    for (const choice of this.choices) {
      if (component && choice.components.includes(component)) choices.push(choice)
    }
    return choices
  }

  public static groupFor(kind: CpuAlgorithmKind): HardwareFundamentalGroupKind {
    for (const choice of this.choices) {
      if (choice.kind === kind) return AdvancedAlgorithmCatalog.fundamentalGroupFor(choice.components)
    }
    throw new RangeError('Unknown fundamental hardware overview')
  }

  public static describeOverview(kind: CpuAlgorithmKind): SystemOverviewInformation {
    switch (kind) {
      case 'latch': return LatchOverview.describe()
      case 'sram-cell': return SramCellOverview.describe()
      case 'dram-row': return DramRowOverview.describe()
      case 'hdd-sector': return HddSectorOverview.describe()
      case 'nand-cell': return NandCellOverview.describe()
      case 'ssd-ftl': return SsdFtlOverview.describe()
      case 'ssd-garbage-collection': return SsdGarbageCollectionOverview.describe()
      case 'ssd-wear-leveling': return SsdWearLevelingOverview.describe()
      case 'branch-prediction': return BranchPredictionOverview.describe()
      case 'out-of-order': return OutOfOrderOverview.describe()
      case 'register-renaming': return RegisterRenamingOverview.describe()
      case 'return-stack': return ReturnStackOverview.describe()
    }
  }

  public static describe(kind: CpuAlgorithmKind): AlgorithmInformation {
    switch (kind) {
      case 'latch': return LatchAnimation.describe()
      case 'sram-cell': return SramCellAnimation.describe()
      case 'dram-row': return DramRowAnimation.describe()
      case 'hdd-sector': return HddSectorAnimation.describe()
      case 'nand-cell': return NandCellAnimation.describe()
      case 'ssd-ftl': return SsdFtlAnimation.describe()
      case 'ssd-garbage-collection': return SsdGarbageCollectionAnimation.describe()
      case 'ssd-wear-leveling': return SsdWearLevelingAnimation.describe()
      case 'branch-prediction': return BranchPredictionAnimation.describe()
      case 'out-of-order': return OutOfOrderAnimation.describe()
      case 'register-renaming': return RegisterRenamingAnimation.describe()
      case 'return-stack': return ReturnStackAnimation.describe()
    }
  }
}
