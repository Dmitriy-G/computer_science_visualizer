import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { UpdateAnimation } from './UpdateAnimation.ts'
import './Update.css'

export default class Update extends StructuredLinearAction {
  protected readonly sequence = UpdateAnimation
}
