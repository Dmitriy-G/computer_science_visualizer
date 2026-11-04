import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { PeekMaximumAnimation } from './PeekMaximumAnimation.ts'
import './PeekMaximum.css'

export default class PeekMaximum extends StructuredLinearAction {
  protected readonly sequence = PeekMaximumAnimation
}
