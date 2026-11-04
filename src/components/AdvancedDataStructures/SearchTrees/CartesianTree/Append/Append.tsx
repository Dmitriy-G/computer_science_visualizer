import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { AppendAnimation } from './AppendAnimation.ts'
import './Append.css'

export default class Append extends StructuredTreeAction {
  protected readonly sequence = AppendAnimation
}
