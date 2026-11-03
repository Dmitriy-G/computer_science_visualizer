import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

export default class Clear extends StructuredLinearAction {
  protected readonly sequence = ClearAnimation
}
