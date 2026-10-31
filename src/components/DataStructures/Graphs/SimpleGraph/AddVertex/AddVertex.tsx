import StructuredGraphAction from '../../../../ActionPlayback/StructuredGraphAction.tsx'
import { AddVertexAnimation } from './AddVertexAnimation.ts'
import './AddVertex.css'

export default class AddVertex extends StructuredGraphAction {
  protected readonly sequence = AddVertexAnimation
}
