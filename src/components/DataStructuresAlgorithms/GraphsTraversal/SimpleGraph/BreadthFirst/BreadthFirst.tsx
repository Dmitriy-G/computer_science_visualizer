import StructuredGraphAction from '../../../../ActionPlayback/StructuredGraphAction.tsx'
import { BreadthFirstAnimation } from './BreadthFirstAnimation.ts'
import './BreadthFirst.css'

export default class BreadthFirst extends StructuredGraphAction {
  protected readonly sequence = BreadthFirstAnimation
}
