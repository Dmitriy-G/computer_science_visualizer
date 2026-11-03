import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { SearchByValueAnimation } from './SearchByValueAnimation.ts'
import './SearchByValue.css'

export default class SearchByValue extends StructuredLinearAction {
  protected readonly sequence = SearchByValueAnimation
}
