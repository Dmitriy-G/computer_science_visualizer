import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { RangeSumAnimation } from './RangeSumAnimation.ts'
import './RangeSum.css'

export default class RangeSum extends StructuredTreeAction {
  protected readonly sequence = RangeSumAnimation
}
