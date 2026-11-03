import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { DispatchAnimation } from './DispatchAnimation.ts'
import './Dispatch.css'

export default class Dispatch extends StructuredLinearAction {
  protected readonly sequence = DispatchAnimation
}
