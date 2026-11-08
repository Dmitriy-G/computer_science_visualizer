import type { ActionDefinition } from '../../../../visualization/ActionDefinition.ts'
import type { OverviewArchitectureKind, OverviewComponentKind } from '../../../../visualization/OverviewComponent.ts'
import type { AlgorithmInformation } from '../../../../visualization/AlgorithmInformation.ts'
import type { SystemOverviewInformation } from '../../../../visualization/SystemOverviewInformation.ts'
import { StoreBufferingOverview } from './StoreBuffering/StoreBufferingOverview.ts'
import { MemoryFencesOverview } from './MemoryFences/MemoryFencesOverview.ts'
import { DmbOverview } from './Dmb/DmbOverview.ts'
import { DsbOverview } from './Dsb/DsbOverview.ts'
import { AcquireReleaseOverview } from './AcquireRelease/AcquireReleaseOverview.ts'
import { ExclusiveLoopOverview } from './ExclusiveLoop/ExclusiveLoopOverview.ts'
import { LseAtomicsOverview } from './LseAtomics/LseAtomicsOverview.ts'
import { LockedAtomicsOverview } from './LockedAtomics/LockedAtomicsOverview.ts'
import { MoesiOverview } from './Moesi/MoesiOverview.ts'
import { MesifOverview } from './Mesif/MesifOverview.ts'
import { TranslationOverview } from './Translation/TranslationOverview.ts'
import { InstructionSyncOverview } from './InstructionSync/InstructionSyncOverview.ts'
import type { HardwareAlgorithmKind, HardwareModel } from './HardwareModel.ts'
import { StoreBufferingAnimation } from './StoreBuffering/StoreBufferingAnimation.ts'
import { MemoryFencesAnimation } from './MemoryFences/MemoryFencesAnimation.ts'
import { DmbAnimation } from './Dmb/DmbAnimation.ts'
import { DsbAnimation } from './Dsb/DsbAnimation.ts'
import { AcquireReleaseAnimation } from './AcquireRelease/AcquireReleaseAnimation.ts'
import { ExclusiveLoopAnimation } from './ExclusiveLoop/ExclusiveLoopAnimation.ts'
import { LseAtomicsAnimation } from './LseAtomics/LseAtomicsAnimation.ts'
import { LockedAtomicsAnimation } from './LockedAtomics/LockedAtomicsAnimation.ts'
import { MoesiAnimation } from './Moesi/MoesiAnimation.ts'
import { MesifAnimation } from './Mesif/MesifAnimation.ts'
import { TranslationAnimation } from './Translation/TranslationAnimation.ts'
import { InstructionSyncAnimation } from './InstructionSync/InstructionSyncAnimation.ts'

export interface HardwareAlgorithmChoice {
  readonly kind: HardwareAlgorithmKind
  readonly name: string
  readonly description: string
  readonly components: readonly OverviewComponentKind[]
  readonly architectures: readonly OverviewArchitectureKind[]
}

export class HardwareAlgorithmCatalog {
  public static readonly choices: readonly HardwareAlgorithmChoice[] = [
    { kind: 'acquire-release', name: 'Acquire/release: LDAR and STLR', description: 'Publish data and consume it with directional ordering.', components: ['CPU', 'RAM', 'Bus'], architectures: ['ARM'] },
    { kind: 'dmb', name: 'Data Memory Barrier: DMB', description: 'Order publication accesses within a selected domain.', components: ['CPU', 'RAM', 'Bus'], architectures: ['ARM'] },
    { kind: 'dsb', name: 'Data Synchronization Barrier: DSB', description: 'Wait for relevant maintenance before continuing execution.', components: ['CPU', 'RAM', 'Bus'], architectures: ['ARM'] },
    { kind: 'exclusive-loop', name: 'Exclusive retry loop: LDXR/STXR', description: 'Detect interference and retry a contested increment.', components: ['CPU', 'RAM', 'Bus'], architectures: ['ARM'] },
    { kind: 'instruction-sync', name: 'Instruction-cache synchronization and ISB', description: 'Synchronize data writes with instruction fetch on each core.', components: ['CPU', 'RAM', 'Bus'], architectures: ['ARM'] },
    { kind: 'locked-atomics', name: 'Locked atomic read-modify-write', description: 'Serialize indivisible x86 counter updates and comparisons.', components: ['CPU', 'RAM', 'Bus'], architectures: ['x86'] },
    { kind: 'lse-atomics', name: 'LSE atomics: CAS, SWP, LDADD', description: 'Perform architectural atomic updates with FEAT_LSE.', components: ['CPU', 'RAM', 'Bus'], architectures: ['ARM'] },
    { kind: 'memory-fences', name: 'Memory fences: MFENCE, SFENCE, LFENCE', description: 'Compare load/store fences and write-combining publication.', components: ['CPU', 'RAM', 'Bus'], architectures: ['x86'] },
    { kind: 'mesif', name: 'MESIF cache coherence', description: 'Choose a clean forwarding responder among shared copies.', components: ['CPU', 'RAM', 'Bus'], architectures: [] },
    { kind: 'moesi', name: 'MOESI cache coherence', description: 'Track dirty ownership, sharing, and whole-line invalidation.', components: ['CPU', 'RAM', 'Bus'], architectures: [] },
    { kind: 'store-buffering', name: 'Store buffering and memory ordering', description: 'Explore buffered stores and permitted two-core observations.', components: ['CPU', 'RAM', 'Bus'], architectures: [] },
    { kind: 'translation', name: 'TLB lookup and translation-table walking', description: 'Walk page tables on a miss and maintain cached mappings.', components: ['CPU', 'RAM', 'Bus'], architectures: [] },
  ]

  public static definition(kind: HardwareAlgorithmKind): ActionDefinition<HardwareModel> {
    switch (kind) {
      case 'store-buffering': return new StoreBufferingAnimation()
      case 'memory-fences': return new MemoryFencesAnimation()
      case 'dmb': return new DmbAnimation()
      case 'dsb': return new DsbAnimation()
      case 'acquire-release': return new AcquireReleaseAnimation()
      case 'exclusive-loop': return new ExclusiveLoopAnimation()
      case 'lse-atomics': return new LseAtomicsAnimation()
      case 'locked-atomics': return new LockedAtomicsAnimation()
      case 'moesi': return new MoesiAnimation()
      case 'mesif': return new MesifAnimation()
      case 'translation': return new TranslationAnimation()
      case 'instruction-sync': return new InstructionSyncAnimation()
    }
  }

  public static describeOverview(kind: HardwareAlgorithmKind): SystemOverviewInformation {
    switch (kind) {
      case 'store-buffering': return StoreBufferingOverview.describe()
      case 'memory-fences': return MemoryFencesOverview.describe()
      case 'dmb': return DmbOverview.describe()
      case 'dsb': return DsbOverview.describe()
      case 'acquire-release': return AcquireReleaseOverview.describe()
      case 'exclusive-loop': return ExclusiveLoopOverview.describe()
      case 'lse-atomics': return LseAtomicsOverview.describe()
      case 'locked-atomics': return LockedAtomicsOverview.describe()
      case 'moesi': return MoesiOverview.describe()
      case 'mesif': return MesifOverview.describe()
      case 'translation': return TranslationOverview.describe()
      case 'instruction-sync': return InstructionSyncOverview.describe()
    }
  }

  public static describe(kind: HardwareAlgorithmKind): AlgorithmInformation {
    switch (kind) {
      case 'store-buffering': return StoreBufferingAnimation.describe()
      case 'memory-fences': return MemoryFencesAnimation.describe()
      case 'dmb': return DmbAnimation.describe()
      case 'dsb': return DsbAnimation.describe()
      case 'acquire-release': return AcquireReleaseAnimation.describe()
      case 'exclusive-loop': return ExclusiveLoopAnimation.describe()
      case 'lse-atomics': return LseAtomicsAnimation.describe()
      case 'locked-atomics': return LockedAtomicsAnimation.describe()
      case 'moesi': return MoesiAnimation.describe()
      case 'mesif': return MesifAnimation.describe()
      case 'translation': return TranslationAnimation.describe()
      case 'instruction-sync': return InstructionSyncAnimation.describe()
    }
  }
}
