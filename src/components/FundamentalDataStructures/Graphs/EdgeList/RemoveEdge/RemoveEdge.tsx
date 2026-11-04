import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { RemoveEdgeAnimation } from './RemoveEdgeAnimation.ts'
import './RemoveEdge.css'

export default class RemoveEdge extends StructuredLinearAction {
  protected readonly sequence = RemoveEdgeAnimation
}
