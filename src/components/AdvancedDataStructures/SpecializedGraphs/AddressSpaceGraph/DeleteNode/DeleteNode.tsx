import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { DeleteNodeAnimation } from './DeleteNodeAnimation.ts'
import './DeleteNode.css'

export default class DeleteNode extends StructuredLinearAction {
  protected readonly sequence = DeleteNodeAnimation
}
