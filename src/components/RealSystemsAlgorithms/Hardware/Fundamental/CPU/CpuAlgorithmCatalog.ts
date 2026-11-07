import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import type { CpuAlgorithmKind, CpuModel } from './CpuModel.ts'
import { BranchPredictionAnimation } from './BranchPrediction/BranchPredictionAnimation.ts'
import { OutOfOrderAnimation } from './OutOfOrder/OutOfOrderAnimation.ts'
import { RegisterRenamingAnimation } from './RegisterRenaming/RegisterRenamingAnimation.ts'
import { ReturnStackAnimation } from './ReturnStack/ReturnStackAnimation.ts'

export interface CpuAlgorithmChoice {
  readonly kind: CpuAlgorithmKind
  readonly name: string
  readonly description: string
}

export class CpuAlgorithmCatalog {
  public static readonly choices: readonly CpuAlgorithmChoice[] = [
    { kind: 'branch-prediction', name: 'History-based branch prediction', description: 'Predict branch direction from earlier outcomes.' },
    { kind: 'out-of-order', name: 'Out-of-order execution', description: 'Execute ready operations and retire results in order.' },
    { kind: 'register-renaming', name: 'Register renaming', description: 'Separate register names from physical operand storage.' },
    { kind: 'return-stack', name: 'Return-address stack prediction', description: 'Predict return targets with a hardware stack.' },
  ]

  public static definition(kind: CpuAlgorithmKind): ActionDefinition<CpuModel> {
    switch (kind) {
      case 'branch-prediction': return new BranchPredictionAnimation()
      case 'out-of-order': return new OutOfOrderAnimation()
      case 'register-renaming': return new RegisterRenamingAnimation()
      case 'return-stack': return new ReturnStackAnimation()
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
