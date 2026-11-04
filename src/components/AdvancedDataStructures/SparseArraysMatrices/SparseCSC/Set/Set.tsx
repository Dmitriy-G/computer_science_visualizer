import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { SetAnimation } from './SetAnimation.ts'
import './Set.css'

export default class Set extends StructuredLinearAction {
  protected readonly sequence = SetAnimation
}
