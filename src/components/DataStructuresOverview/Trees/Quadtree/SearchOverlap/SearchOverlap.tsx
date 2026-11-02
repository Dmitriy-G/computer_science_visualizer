import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { SearchOverlapAnimation } from './SearchOverlapAnimation.ts'
import './SearchOverlap.css'

export default class SearchOverlap extends StructuredTreeAction {
  protected readonly sequence = SearchOverlapAnimation
}
