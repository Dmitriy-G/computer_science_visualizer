import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { AppendAnimation } from './AppendAnimation.ts'
import './Append.css'

export default class Append extends StructuredLinearAction {
  protected readonly sequence = AppendAnimation
}
