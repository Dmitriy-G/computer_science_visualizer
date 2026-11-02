import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { CompactAnimation } from './CompactAnimation.ts'
import './Compact.css'

export default class Compact extends StructuredTreeAction {
  protected readonly sequence = CompactAnimation
}
