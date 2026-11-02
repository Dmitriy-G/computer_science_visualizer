import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { PeekAnimation } from './PeekAnimation.ts'
import './Peek.css'

export default class Peek extends StructuredLinearAction {
  protected readonly sequence = PeekAnimation
}
