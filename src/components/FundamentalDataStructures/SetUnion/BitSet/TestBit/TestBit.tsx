import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { TestBitAnimation } from './TestBitAnimation.ts'
import './TestBit.css'

export default class TestBit extends StructuredLinearAction {
  protected readonly sequence = TestBitAnimation
}
