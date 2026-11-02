import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { BreadthFirstAnimation } from './BreadthFirstAnimation.ts'
import './BreadthFirst.css'

export default class BreadthFirst extends StructuredLinearAction {
  protected readonly sequence = BreadthFirstAnimation
}
