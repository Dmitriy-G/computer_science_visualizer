import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { DequeueAnimation } from './DequeueAnimation.ts'
import './Dequeue.css'

export default class Dequeue extends StructuredLinearAction {
  protected readonly sequence = DequeueAnimation
}
