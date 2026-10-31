import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { PeekAnimation } from './PeekAnimation.ts'
import './Peek.css'

export default class Peek extends StructuredTreeAction {
  protected readonly sequence = PeekAnimation
}
