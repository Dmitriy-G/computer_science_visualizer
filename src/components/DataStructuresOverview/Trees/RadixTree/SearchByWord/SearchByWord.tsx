import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { SearchByWordAnimation } from './SearchByWordAnimation.ts'
import './SearchByWord.css'

export default class SearchByWord extends StructuredTreeAction {
  protected readonly sequence = SearchByWordAnimation
}
