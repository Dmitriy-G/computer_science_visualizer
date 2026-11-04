import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ContainsAnimation } from './ContainsAnimation.ts'
import './Contains.css'

export default class Contains extends StructuredLinearAction {
  protected readonly sequence = ContainsAnimation
}
