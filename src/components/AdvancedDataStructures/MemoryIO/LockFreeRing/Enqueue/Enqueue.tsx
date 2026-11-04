import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { EnqueueAnimation } from './EnqueueAnimation.ts'
import './Enqueue.css'

export default class Enqueue extends StructuredLinearAction {
  protected readonly sequence = EnqueueAnimation
}
