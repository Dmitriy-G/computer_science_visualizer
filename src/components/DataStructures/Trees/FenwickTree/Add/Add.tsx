import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { AddAnimation } from './AddAnimation.ts'
import './Add.css'

export default class Add extends StructuredTreeAction {
  protected readonly sequence = AddAnimation
}
