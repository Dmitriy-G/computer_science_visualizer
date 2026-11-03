import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { LowerBoundAnimation } from './LowerBoundAnimation.ts'
import './LowerBound.css'

export default class LowerBound extends StructuredLinearAction {
  protected readonly sequence = LowerBoundAnimation
}
