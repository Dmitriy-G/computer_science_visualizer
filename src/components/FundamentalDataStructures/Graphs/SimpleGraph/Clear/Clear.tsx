import StructuredGraphAction from '../../../../ActionPlayback/StructuredGraphAction.tsx'
import { GraphClearAnimation } from './GraphClearAnimation.ts'
import './Clear.css'

export default class Clear extends StructuredGraphAction {
  protected readonly sequence = GraphClearAnimation
}
