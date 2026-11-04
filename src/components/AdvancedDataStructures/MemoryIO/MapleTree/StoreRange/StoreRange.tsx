import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { StoreRangeAnimation } from './StoreRangeAnimation.ts'
import './StoreRange.css'

export default class StoreRange extends StructuredLinearAction {
  protected readonly sequence = StoreRangeAnimation
}
