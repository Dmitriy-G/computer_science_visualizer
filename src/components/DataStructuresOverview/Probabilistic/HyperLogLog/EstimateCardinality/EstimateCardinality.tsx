import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { EstimateCardinalityAnimation } from './EstimateCardinalityAnimation.ts'
import './EstimateCardinality.css'

export default class EstimateCardinality extends StructuredLinearAction {
  protected readonly sequence = EstimateCardinalityAnimation
}
