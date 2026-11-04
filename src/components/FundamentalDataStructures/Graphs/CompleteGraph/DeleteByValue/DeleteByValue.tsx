import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { DeleteByValueAnimation } from './DeleteByValueAnimation.ts'
import './DeleteByValue.css'

export default class DeleteByValue extends StructuredLinearAction {
  protected readonly sequence = DeleteByValueAnimation
}
