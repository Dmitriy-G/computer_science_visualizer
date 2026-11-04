import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ReadAnimation } from './ReadAnimation.ts'
import './Read.css'

export default class Read extends StructuredLinearAction {
  protected readonly sequence = ReadAnimation
}
