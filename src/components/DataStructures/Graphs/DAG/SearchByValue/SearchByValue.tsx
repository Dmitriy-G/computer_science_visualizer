import StructuredGraphAction from '../../../../ActionPlayback/StructuredGraphAction.tsx'
import { SearchByValueAnimation } from './SearchByValueAnimation.ts'
import './SearchByValue.css'

export default class SearchByValue extends StructuredGraphAction {
  protected readonly sequence = SearchByValueAnimation
}
