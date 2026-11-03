import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { RemoveOneAnimation } from './RemoveOneAnimation.ts'
import './RemoveOne.css'

export default class RemoveOne extends StructuredLinearAction {
  protected readonly sequence = RemoveOneAnimation
}
