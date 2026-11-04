import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { DeleteByKeyAnimation } from './DeleteByKeyAnimation.ts'
import './DeleteByKey.css'

export default class DeleteByKey extends StructuredTreeAction {
  protected readonly sequence = DeleteByKeyAnimation
}
