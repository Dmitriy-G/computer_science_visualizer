import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { ExtractMinAnimation } from './ExtractMinAnimation.ts'
import './ExtractMin.css'

export default class ExtractMin extends StructuredTreeAction {
  protected readonly sequence = ExtractMinAnimation
}
