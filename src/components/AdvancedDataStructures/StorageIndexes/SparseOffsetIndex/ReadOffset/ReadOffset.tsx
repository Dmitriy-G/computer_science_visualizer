import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ReadOffsetAnimation } from './ReadOffsetAnimation.ts'
import './ReadOffset.css'

export default class ReadOffset extends StructuredLinearAction {
  protected readonly sequence = ReadOffsetAnimation
}
