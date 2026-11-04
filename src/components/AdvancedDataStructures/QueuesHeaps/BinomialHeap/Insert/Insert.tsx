import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { InsertAnimation } from './InsertAnimation.ts'
import './Insert.css'

export default class Insert extends StructuredLinearAction {
  protected readonly sequence = InsertAnimation
}
