import type { ReactNode } from 'react'
import ComponentWorkspace from '../ComponentWorkspace.tsx'
import type { ComponentPlaybackProps } from '../ComponentWorkspace.tsx'
import { CpuAlgorithmCatalog } from './CpuAlgorithmCatalog.ts'
import BranchPrediction from '../BranchPrediction/BranchPrediction.tsx'
import OutOfOrder from '../OutOfOrder/OutOfOrder.tsx'
import RegisterRenaming from '../RegisterRenaming/RegisterRenaming.tsx'
import ReturnStack from '../ReturnStack/ReturnStack.tsx'

export default class CpuWorkspace extends ComponentWorkspace {
  protected readonly group = 'hardware-cpu' as const
  protected readonly choices = CpuAlgorithmCatalog.choices

  protected renderLesson(props: ComponentPlaybackProps): ReactNode {
    switch (this.props.algorithm) {
      case 'branch-prediction': return <BranchPrediction {...props} />
      case 'out-of-order': return <OutOfOrder {...props} />
      case 'register-renaming': return <RegisterRenaming {...props} />
      case 'return-stack': return <ReturnStack {...props} />
    }
    return null
  }
}
