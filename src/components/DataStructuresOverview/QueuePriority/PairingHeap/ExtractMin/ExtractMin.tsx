import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ExtractMinAnimation } from './ExtractMinAnimation.ts'
import './ExtractMin.css'

export default class ExtractMin extends StructuredLinearAction {
  protected readonly sequence = ExtractMinAnimation
}
