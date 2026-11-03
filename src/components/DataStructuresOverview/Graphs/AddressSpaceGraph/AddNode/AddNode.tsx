import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { AddNodeAnimation } from './AddNodeAnimation.ts'
import './AddNode.css'

export default class AddNode extends StructuredLinearAction {
  protected readonly sequence = AddNodeAnimation
}
