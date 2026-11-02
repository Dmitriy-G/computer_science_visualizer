import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { DeleteAnimation } from './DeleteAnimation.ts'
import './Delete.css'

export default class Delete extends StructuredLinearAction {
  protected readonly sequence = DeleteAnimation
}
