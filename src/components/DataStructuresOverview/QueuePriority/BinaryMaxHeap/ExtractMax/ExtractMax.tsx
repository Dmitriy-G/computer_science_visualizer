import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ExtractMaxAnimation } from './ExtractMaxAnimation.ts'
import './ExtractMax.css'

export default class ExtractMax extends StructuredLinearAction {
  protected readonly sequence = ExtractMaxAnimation
}
