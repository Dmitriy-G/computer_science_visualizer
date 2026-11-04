import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { SearchTimestampAnimation } from './SearchTimestampAnimation.ts'
import './SearchTimestamp.css'

export default class SearchTimestamp extends StructuredLinearAction {
  protected readonly sequence = SearchTimestampAnimation
}
