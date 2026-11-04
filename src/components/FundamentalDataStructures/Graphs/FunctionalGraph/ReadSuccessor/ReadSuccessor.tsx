import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ReadSuccessorAnimation } from './ReadSuccessorAnimation.ts'
import './ReadSuccessor.css'

export default class ReadSuccessor extends StructuredLinearAction {
  protected readonly sequence = ReadSuccessorAnimation
}
