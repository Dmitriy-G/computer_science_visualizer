import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { RemoveAnimation } from './RemoveAnimation.ts'
import './Remove.css'

export default class Remove extends StructuredLinearAction {
  protected readonly sequence = RemoveAnimation
}
