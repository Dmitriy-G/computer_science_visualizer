import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { SelectAnimation } from './SelectAnimation.ts'
import './Select.css'

export default class Select extends StructuredTreeAction {
  protected readonly sequence = SelectAnimation
}
