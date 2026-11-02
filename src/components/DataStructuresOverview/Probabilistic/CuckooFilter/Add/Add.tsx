import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { AddAnimation } from './AddAnimation.ts'
import './Add.css'

export default class Add extends StructuredLinearAction {
  protected readonly sequence = AddAnimation
}
