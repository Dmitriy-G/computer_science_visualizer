import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { EstimateFrequencyAnimation } from './EstimateFrequencyAnimation.ts'
import './EstimateFrequency.css'

export default class EstimateFrequency extends StructuredLinearAction {
  protected readonly sequence = EstimateFrequencyAnimation
}
