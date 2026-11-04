import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ConnectedAnimation } from './ConnectedAnimation.ts'
import './Connected.css'

export default class Connected extends StructuredLinearAction {
  protected readonly sequence = ConnectedAnimation
}
