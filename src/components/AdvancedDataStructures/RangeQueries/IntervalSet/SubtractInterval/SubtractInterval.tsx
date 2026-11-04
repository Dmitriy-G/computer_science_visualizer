import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { SubtractIntervalAnimation } from './SubtractIntervalAnimation.ts'
import './SubtractInterval.css'

export default class SubtractInterval extends StructuredLinearAction {
  protected readonly sequence = SubtractIntervalAnimation
}
