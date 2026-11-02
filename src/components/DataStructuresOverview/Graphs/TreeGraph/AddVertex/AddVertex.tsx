import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { AddVertexAnimation } from './AddVertexAnimation.ts'
import './AddVertex.css'

export default class AddVertex extends StructuredLinearAction {
  protected readonly sequence = AddVertexAnimation
}
