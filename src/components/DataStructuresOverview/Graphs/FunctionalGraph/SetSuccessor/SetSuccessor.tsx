import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { SetSuccessorAnimation } from './SetSuccessorAnimation.ts'
import './SetSuccessor.css'

export default class SetSuccessor extends StructuredLinearAction {
  protected readonly sequence = SetSuccessorAnimation
}
