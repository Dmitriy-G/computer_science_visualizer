import StructuredGraphAction from '../../../../ActionPlayback/StructuredGraphAction.tsx'
import { RemoveEdgeAnimation } from './RemoveEdgeAnimation.ts'
import './RemoveEdge.css'

export default class RemoveEdge extends StructuredGraphAction {
  protected readonly sequence = RemoveEdgeAnimation
}
