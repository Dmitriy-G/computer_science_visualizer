import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ObserveAnimation } from './ObserveAnimation.ts'
import './Observe.css'

export default class Observe extends StructuredLinearAction {
  protected readonly sequence = ObserveAnimation
}
