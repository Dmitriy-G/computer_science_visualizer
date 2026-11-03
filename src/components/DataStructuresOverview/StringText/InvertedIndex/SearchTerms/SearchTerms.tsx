import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { SearchTermsAnimation } from './SearchTermsAnimation.ts'
import './SearchTerms.css'

export default class SearchTerms extends StructuredLinearAction {
  protected readonly sequence = SearchTermsAnimation
}
