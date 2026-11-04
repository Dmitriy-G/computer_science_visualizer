import StructuredGraphAction from '../../../../ActionPlayback/StructuredGraphAction.tsx'
import { GraphDeleteByValueAnimation } from './GraphDeleteByValueAnimation.ts'
import './DeleteByValue.css'

export default class DeleteByValue extends StructuredGraphAction {
  protected readonly sequence = GraphDeleteByValueAnimation
}
