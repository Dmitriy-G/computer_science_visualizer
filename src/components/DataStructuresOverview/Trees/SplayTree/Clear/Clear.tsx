import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

export default class Clear extends StructuredTreeAction {
  protected readonly sequence = ClearAnimation
}
