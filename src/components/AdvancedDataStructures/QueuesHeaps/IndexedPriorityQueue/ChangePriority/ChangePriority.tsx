import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ChangePriorityAnimation } from './ChangePriorityAnimation.ts'
import './ChangePriority.css'

export default class ChangePriority extends StructuredLinearAction {
  protected readonly sequence = ChangePriorityAnimation
}
