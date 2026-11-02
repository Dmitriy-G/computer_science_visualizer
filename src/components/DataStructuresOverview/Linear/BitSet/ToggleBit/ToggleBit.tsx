import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ToggleBitAnimation } from './ToggleBitAnimation.ts'
import './ToggleBit.css'

export default class ToggleBit extends StructuredLinearAction {
  protected readonly sequence = ToggleBitAnimation
}
