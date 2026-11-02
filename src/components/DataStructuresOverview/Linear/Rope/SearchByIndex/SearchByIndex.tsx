import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { SearchByIndexAnimation } from './SearchByIndexAnimation.ts'
import './SearchByIndex.css'

export default class SearchByIndex extends StructuredLinearAction {
  protected readonly sequence = SearchByIndexAnimation
}
