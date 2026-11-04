import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { EraseAnimation } from './EraseAnimation.ts'
import './Erase.css'

export default class Erase extends StructuredLinearAction {
  protected readonly sequence = EraseAnimation
}
