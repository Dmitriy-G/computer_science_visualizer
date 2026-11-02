import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { AddServerAnimation } from './AddServerAnimation.ts'
import './AddServer.css'

export default class AddServer extends StructuredLinearAction {
  protected readonly sequence = AddServerAnimation
}
