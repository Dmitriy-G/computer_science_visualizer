import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { DeleteByIdAnimation } from './DeleteByIdAnimation.ts'
import './DeleteById.css'

export default class DeleteById extends StructuredTreeAction {
  protected readonly sequence = DeleteByIdAnimation
}
