import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ReshapeAnimation } from './ReshapeAnimation.ts'
import './Reshape.css'

export default class Reshape extends StructuredLinearAction {
  protected readonly sequence = ReshapeAnimation
}
