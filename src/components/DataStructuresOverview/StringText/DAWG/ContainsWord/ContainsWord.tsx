import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ContainsWordAnimation } from './ContainsWordAnimation.ts'
import './ContainsWord.css'

export default class ContainsWord extends StructuredLinearAction {
  protected readonly sequence = ContainsWordAnimation
}
