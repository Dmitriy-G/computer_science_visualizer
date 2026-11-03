import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { AddIntervalAnimation } from './AddIntervalAnimation.ts'
import './AddInterval.css'

export default class AddInterval extends StructuredLinearAction {
  protected readonly sequence = AddIntervalAnimation
}
