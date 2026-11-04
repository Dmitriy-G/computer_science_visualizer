import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { SearchOverlapAnimation } from './SearchOverlapAnimation.ts'
import './SearchOverlap.css'

export default class SearchOverlap extends StructuredLinearAction {
  protected readonly sequence = SearchOverlapAnimation
}
