import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { SearchRangeAnimation } from './SearchRangeAnimation.ts'
import './SearchRange.css'

export default class SearchRange extends StructuredLinearAction {
  protected readonly sequence = SearchRangeAnimation
}
