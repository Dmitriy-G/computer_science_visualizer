import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { DepthFirstAnimation } from './DepthFirstAnimation.ts'
import './DepthFirst.css'

export default class DepthFirst extends StructuredLinearAction {
  protected readonly sequence = DepthFirstAnimation
}
