import type { ActionDefinition } from '../../../../visualization/ActionDefinition.ts'
import type { OverviewArchitectureKind, OverviewComponentKind } from '../../../../visualization/OverviewComponent.ts'
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
}

export class CpuAlgorithmCatalog {
  public static readonly choices: readonly CpuAlgorithmChoice[] = [
    { kind: 'branch-prediction', name: 'History-based branch prediction', description: 'Avoid fetch stalls by predicting unresolved branch direction.', components: ['CPU'], architectures: [] },
    { kind: 'out-of-order', name: 'Out-of-order execution', description: 'Keep ready work moving while an older instruction waits.', components: ['CPU'], architectures: [] },
    { kind: 'register-renaming', name: 'Register renaming', description: 'Remove false dependencies caused by reused register names.', components: ['CPU'], architectures: [] },
    { kind: 'return-stack', name: 'Return-address stack prediction', description: 'Predict changing return targets by tracking nested calls.', components: ['CPU'], architectures: [] },
  ]

  public static definition(kind: CpuAlgorithmKind): ActionDefinition<CpuModel> {
    switch (kind) {
      case 'branch-prediction': return new BranchPredictionAnimation()
      case 'out-of-order': return new OutOfOrderAnimation()
      case 'register-renaming': return new RegisterRenamingAnimation()
      case 'return-stack': return new ReturnStackAnimation()
    }
  }

  public static describeOverview(kind: CpuAlgorithmKind): SystemOverviewInformation {
    switch (kind) {
      case 'branch-prediction': return BranchPredictionOverview.describe()
      case 'out-of-order': return OutOfOrderOverview.describe()
      case 'register-renaming': return RegisterRenamingOverview.describe()
      case 'return-stack': return ReturnStackOverview.describe()
    }
  }

  public static describe(kind: CpuAlgorithmKind): AlgorithmInformation {
    switch (kind) {
      case 'branch-prediction': return BranchPredictionAnimation.describe()
      case 'out-of-order': return OutOfOrderAnimation.describe()
      case 'register-renaming': return RegisterRenamingAnimation.describe()
      case 'return-stack': return ReturnStackAnimation.describe()
    }
  }
}
