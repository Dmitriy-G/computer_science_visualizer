import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { MultiplyVectorAnimation } from './MultiplyVectorAnimation.ts'
import './MultiplyVector.css'

export default class MultiplyVector extends StructuredLinearAction {
  protected readonly sequence = MultiplyVectorAnimation
}
