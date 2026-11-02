import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { StartsWithAnimation } from './StartsWithAnimation.ts'
import './StartsWith.css'

export default class StartsWith extends StructuredTreeAction {
  protected readonly sequence = StartsWithAnimation
}
