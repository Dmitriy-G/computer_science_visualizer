import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import type { HardwareOverviewChoice } from '../HardwareOverviewChoice.ts'
import { BranchPredictionAnimation } from '../BranchPrediction/BranchPredictionAnimation.ts'
import { BranchPredictionOverview } from '../BranchPrediction/BranchPredictionOverview.ts'
import { OutOfOrderAnimation } from '../OutOfOrder/OutOfOrderAnimation.ts'
import { OutOfOrderOverview } from '../OutOfOrder/OutOfOrderOverview.ts'
import { RegisterRenamingAnimation } from '../RegisterRenaming/RegisterRenamingAnimation.ts'
import { RegisterRenamingOverview } from '../RegisterRenaming/RegisterRenamingOverview.ts'
import { ReturnStackAnimation } from '../ReturnStack/ReturnStackAnimation.ts'
import { ReturnStackOverview } from '../ReturnStack/ReturnStackOverview.ts'

export type CpuAlgorithmKind = 'branch-prediction' | 'out-of-order' | 'register-renaming' | 'return-stack'

export class CpuAlgorithmCatalog {
  public static readonly choices: readonly HardwareOverviewChoice<CpuAlgorithmKind>[] = [
    { kind: 'branch-prediction', name: 'History-based branch prediction', description: 'Avoid fetch stalls by predicting unresolved branch direction.', components: ['CPU'], architectures: [] },
    { kind: 'out-of-order', name: 'Out-of-order execution', description: 'Keep ready work moving while an older instruction waits.', components: ['CPU'], architectures: [] },
    { kind: 'register-renaming', name: 'Register renaming', description: 'Remove false dependencies caused by reused register names.', components: ['CPU'], architectures: [] },
    { kind: 'return-stack', name: 'Return-address stack prediction', description: 'Predict changing return targets by tracking nested calls.', components: ['CPU'], architectures: [] },
  ]

  public static definition(kind: CpuAlgorithmKind): ActionDefinition<HardwareSnapshot> {
    switch (kind) {
      case 'branch-prediction': return new BranchPredictionAnimation()
      case 'out-of-order': return new OutOfOrderAnimation()
      case 'register-renaming': return new RegisterRenamingAnimation()
      case 'return-stack': return new ReturnStackAnimation()
    }
    throw new RangeError('Unknown CPU overview')
  }

  public static describeOverview(kind: CpuAlgorithmKind): SystemOverviewInformation {
    switch (kind) {
      case 'branch-prediction': return BranchPredictionOverview.describe()
      case 'out-of-order': return OutOfOrderOverview.describe()
      case 'register-renaming': return RegisterRenamingOverview.describe()
      case 'return-stack': return ReturnStackOverview.describe()
    }
    throw new RangeError('Unknown CPU overview')
  }

  public static describe(kind: CpuAlgorithmKind): AlgorithmInformation {
    switch (kind) {
      case 'branch-prediction': return BranchPredictionAnimation.describe()
      case 'out-of-order': return OutOfOrderAnimation.describe()
      case 'register-renaming': return RegisterRenamingAnimation.describe()
      case 'return-stack': return ReturnStackAnimation.describe()
    }
    throw new RangeError('Unknown CPU overview')
  }
}
