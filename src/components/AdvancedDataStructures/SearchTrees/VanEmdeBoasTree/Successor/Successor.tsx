import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { SuccessorAnimation } from './SuccessorAnimation.ts'
import './Successor.css'

export default class Successor extends StructuredTreeAction {
  protected readonly sequence = SuccessorAnimation
}
