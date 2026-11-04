import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { MakeSetAnimation } from './MakeSetAnimation.ts'
import './MakeSet.css'

export default class MakeSet extends StructuredLinearAction {
  protected readonly sequence = MakeSetAnimation
}
