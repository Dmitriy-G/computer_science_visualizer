import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ClearBitAnimation } from './ClearBitAnimation.ts'
import './ClearBit.css'

export default class ClearBit extends StructuredLinearAction {
  protected readonly sequence = ClearBitAnimation
}
