import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { CorruptAnimation } from './CorruptAnimation.ts'
import './Corrupt.css'

export default class Corrupt extends StructuredLinearAction {
  protected readonly sequence = CorruptAnimation
}
