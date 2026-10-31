import StructuredGraphAction from '../../../../ActionPlayback/StructuredGraphAction.tsx'
import { DepthFirstAnimation } from './DepthFirstAnimation.ts'
import './DepthFirst.css'

export default class DepthFirst extends StructuredGraphAction {
  protected readonly sequence = DepthFirstAnimation
}
