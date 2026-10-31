import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { FlushAnimation } from './FlushAnimation.ts'
import './Flush.css'

export default class Flush extends StructuredTreeAction {
  protected readonly sequence = FlushAnimation
}
