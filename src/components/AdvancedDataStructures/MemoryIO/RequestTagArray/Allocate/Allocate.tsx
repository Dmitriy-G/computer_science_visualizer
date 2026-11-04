import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { AllocateAnimation } from './AllocateAnimation.ts'
import './Allocate.css'

export default class Allocate extends StructuredLinearAction {
  protected readonly sequence = AllocateAnimation
}
