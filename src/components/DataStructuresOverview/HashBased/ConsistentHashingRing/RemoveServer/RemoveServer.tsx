import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { RemoveServerAnimation } from './RemoveServerAnimation.ts'
import './RemoveServer.css'

export default class RemoveServer extends StructuredLinearAction {
  protected readonly sequence = RemoveServerAnimation
}
