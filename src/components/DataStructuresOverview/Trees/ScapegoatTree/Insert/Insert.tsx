import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { InsertAnimation } from './InsertAnimation.ts'
import './Insert.css'

export default class Insert extends StructuredTreeAction {
  protected readonly sequence = InsertAnimation
}
