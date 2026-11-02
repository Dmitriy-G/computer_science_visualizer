import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { MoveGapAnimation } from './MoveGapAnimation.ts'
import './MoveGap.css'

export default class MoveGap extends StructuredLinearAction {
  protected readonly sequence = MoveGapAnimation
}
