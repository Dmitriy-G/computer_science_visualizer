import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { DeleteByWordAnimation } from './DeleteByWordAnimation.ts'
import './DeleteByWord.css'

export default class DeleteByWord extends StructuredTreeAction {
  protected readonly sequence = DeleteByWordAnimation
}
