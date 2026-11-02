import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { SearchByKeyAnimation } from './SearchByKeyAnimation.ts'
import './SearchByKey.css'

export default class SearchByKey extends StructuredTreeAction {
  protected readonly sequence = SearchByKeyAnimation
}
