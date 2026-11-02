import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { DecreaseKeyAnimation } from './DecreaseKeyAnimation.ts'
import './DecreaseKey.css'

export default class DecreaseKey extends StructuredLinearAction {
  protected readonly sequence = DecreaseKeyAnimation
}
