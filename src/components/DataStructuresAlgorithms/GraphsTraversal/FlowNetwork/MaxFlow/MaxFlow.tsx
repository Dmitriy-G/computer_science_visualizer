import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { MaxFlowAnimation } from './MaxFlowAnimation.ts'
import './MaxFlow.css'

export default class MaxFlow extends StructuredLinearAction {
  protected readonly sequence = MaxFlowAnimation
}
