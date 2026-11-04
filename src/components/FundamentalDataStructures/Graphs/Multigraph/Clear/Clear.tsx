import StructuredGraphAction from '../../../../ActionPlayback/StructuredGraphAction.tsx'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

export default class Clear extends StructuredGraphAction {
  protected readonly sequence = ClearAnimation
}
