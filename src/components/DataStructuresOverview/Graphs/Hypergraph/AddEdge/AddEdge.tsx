import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { AddEdgeAnimation } from './AddEdgeAnimation.ts'
import './AddEdge.css'

export default class AddEdge extends StructuredLinearAction {
  protected readonly sequence = AddEdgeAnimation
}
