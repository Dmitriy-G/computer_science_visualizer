import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { EvaluateAnimation } from './EvaluateAnimation.ts'
import './Evaluate.css'

export default class Evaluate extends StructuredTreeAction {
  protected readonly sequence = EvaluateAnimation
}
