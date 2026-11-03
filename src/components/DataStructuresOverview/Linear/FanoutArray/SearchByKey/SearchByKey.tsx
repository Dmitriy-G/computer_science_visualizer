import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { SearchByKeyAnimation } from './SearchByKeyAnimation.ts'
import './SearchByKey.css'

export default class SearchByKey extends StructuredLinearAction {
  protected readonly sequence = SearchByKeyAnimation
}
