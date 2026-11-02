import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { DeleteByKeyAnimation } from './DeleteByKeyAnimation.ts'
import './DeleteByKey.css'

export default class DeleteByKey extends StructuredLinearAction {
  protected readonly sequence = DeleteByKeyAnimation
}
