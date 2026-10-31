import StructuredGraphAction from '../../../../ActionPlayback/StructuredGraphAction.tsx'
import { AddEdgeAnimation } from './AddEdgeAnimation.ts'
import './AddEdge.css'

export default class AddEdge extends StructuredGraphAction {
  protected readonly sequence = AddEdgeAnimation
}
