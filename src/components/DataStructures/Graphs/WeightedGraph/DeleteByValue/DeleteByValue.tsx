import StructuredGraphAction from '../../../../ActionPlayback/StructuredGraphAction.tsx'
import { DeleteByValueAnimation } from './DeleteByValueAnimation.ts'
import './DeleteByValue.css'

export default class DeleteByValue extends StructuredGraphAction {
  protected readonly sequence = DeleteByValueAnimation
}
