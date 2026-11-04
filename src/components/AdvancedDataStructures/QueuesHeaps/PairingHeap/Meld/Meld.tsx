import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { MeldAnimation } from './MeldAnimation.ts'
import './Meld.css'

export default class Meld extends StructuredLinearAction {
  protected readonly sequence = MeldAnimation
}
