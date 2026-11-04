import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { RangeMinimumAnimation } from './RangeMinimumAnimation.ts'
import './RangeMinimum.css'

export default class RangeMinimum extends StructuredTreeAction {
  protected readonly sequence = RangeMinimumAnimation
}
