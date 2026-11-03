import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { SetBitAnimation } from './SetBitAnimation.ts'
import './SetBit.css'

export default class SetBit extends StructuredLinearAction {
  protected readonly sequence = SetBitAnimation
}
