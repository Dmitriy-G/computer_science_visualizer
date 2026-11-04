import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { SearchAnimation } from './SearchAnimation.ts'
import './Search.css'

export default class Search extends StructuredLinearAction {
  protected readonly sequence = SearchAnimation
}
