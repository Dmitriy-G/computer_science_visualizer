import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { PushAnimation } from './PushAnimation.ts'
import './Push.css'

export default class Push extends StructuredLinearAction {
  protected readonly sequence = PushAnimation
}
