import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ConcatenateAnimation } from './ConcatenateAnimation.ts'
import './Concatenate.css'

export default class Concatenate extends StructuredLinearAction {
  protected readonly sequence = ConcatenateAnimation
}
