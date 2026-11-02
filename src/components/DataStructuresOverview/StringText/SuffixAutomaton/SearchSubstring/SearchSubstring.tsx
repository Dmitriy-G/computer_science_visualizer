import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { SearchSubstringAnimation } from './SearchSubstringAnimation.ts'
import './SearchSubstring.css'

export default class SearchSubstring extends StructuredLinearAction {
  protected readonly sequence = SearchSubstringAnimation
}
