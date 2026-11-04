import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { SearchSubstringAnimation } from './SearchSubstringAnimation.ts'
import './SearchSubstring.css'

export default class SearchSubstring extends StructuredTreeAction {
  protected readonly sequence = SearchSubstringAnimation
}
