import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { UnionAnimation } from './UnionAnimation.ts'
import './Union.css'

export default class Union extends StructuredLinearAction {
  protected readonly sequence = UnionAnimation
}
