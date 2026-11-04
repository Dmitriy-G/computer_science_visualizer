import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { FindGapAnimation } from './FindGapAnimation.ts'
import './FindGap.css'

export default class FindGap extends StructuredLinearAction {
  protected readonly sequence = FindGapAnimation
}
