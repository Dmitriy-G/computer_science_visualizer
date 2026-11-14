import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import type { HardwareOverviewChoice } from '../HardwareOverviewChoice.ts'
import { NonAtomicIncrementAnimation } from './NonAtomicIncrement/NonAtomicIncrementAnimation.ts'
import { NonAtomicIncrementOverview } from './NonAtomicIncrement/NonAtomicIncrementOverview.ts'
import { AtomicLoadAnimation } from './AtomicLoad/AtomicLoadAnimation.ts'
import { AtomicLoadOverview } from './AtomicLoad/AtomicLoadOverview.ts'

export type CpuAlgorithmKind = 'cpu-non-atomic-increment' | 'cpu-atomic-load'

export class CpuAlgorithmCatalog {
  public static readonly choices: readonly HardwareOverviewChoice<CpuAlgorithmKind>[] = [
    { kind: 'cpu-non-atomic-increment', name: 'Non-atomic operation: i = i + 1', description: 'Follow separate LOAD, ADD, and STORE instructions and see how another core can cause a lost update.', components: ['CPU'], architectures: ['x86'] },
    { kind: 'cpu-atomic-load', name: 'Atomic operation: i = j', description: 'Load one aligned word from shared j into local i, capturing a complete value in one atomic read.', components: ['CPU'], architectures: ['x86'] },
  ]

  public static definition(kind: CpuAlgorithmKind): ActionDefinition<HardwareSnapshot> {
    switch (kind) {
      case 'cpu-non-atomic-increment': return new NonAtomicIncrementAnimation()
      case 'cpu-atomic-load': return new AtomicLoadAnimation()
    }
    throw new RangeError('Unknown CPU overview')
  }

  public static describeOverview(kind: CpuAlgorithmKind): SystemOverviewInformation {
    switch (kind) {
      case 'cpu-non-atomic-increment': return NonAtomicIncrementOverview.describe()
      case 'cpu-atomic-load': return AtomicLoadOverview.describe()
    }
    throw new RangeError('Unknown CPU overview')
  }

  public static describe(kind: CpuAlgorithmKind): AlgorithmInformation {
    switch (kind) {
      case 'cpu-non-atomic-increment': return NonAtomicIncrementAnimation.describe()
      case 'cpu-atomic-load': return AtomicLoadAnimation.describe()
    }
    throw new RangeError('Unknown CPU overview')
  }
}
