import StructuredGraphAction from '../../../../ActionPlayback/StructuredGraphAction.tsx'
import { GraphSearchByValueAnimation } from './GraphSearchByValueAnimation.ts'
import './SearchByValue.css'

export default class SearchByValue extends StructuredGraphAction {
  protected readonly sequence = GraphSearchByValueAnimation
}
