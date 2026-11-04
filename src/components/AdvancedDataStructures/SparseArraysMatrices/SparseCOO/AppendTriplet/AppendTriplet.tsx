import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { AppendTripletAnimation } from './AppendTripletAnimation.ts'
import './AppendTriplet.css'

export default class AppendTriplet extends StructuredLinearAction {
  protected readonly sequence = AppendTripletAnimation
}
