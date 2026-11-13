import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { BranchPredictionAnimation } from './BranchPredictionAnimation.ts'
import './BranchPrediction.css'

export default class BranchPrediction extends ActionView<HardwareSnapshot> {
  protected readonly definition = new BranchPredictionAnimation()
}
