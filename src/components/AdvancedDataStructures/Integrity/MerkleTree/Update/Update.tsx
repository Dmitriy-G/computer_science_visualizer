import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { UpdateAnimation } from './UpdateAnimation.ts'
import './Update.css'

export default class Update extends StructuredTreeAction {
  protected readonly sequence = UpdateAnimation
}
