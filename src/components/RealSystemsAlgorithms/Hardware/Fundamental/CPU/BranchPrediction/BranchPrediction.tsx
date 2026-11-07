import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { CpuModel } from '../CpuModel.ts'
import { BranchPredictionAnimation } from './BranchPredictionAnimation.ts'
import './BranchPrediction.css'

export default class BranchPrediction extends ActionView<CpuModel> {
  protected readonly definition = new BranchPredictionAnimation()
}
