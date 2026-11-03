import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { EraseRangeAnimation } from './EraseRangeAnimation.ts'
import './EraseRange.css'

export default class EraseRange extends StructuredLinearAction {
  protected readonly sequence = EraseRangeAnimation
}
