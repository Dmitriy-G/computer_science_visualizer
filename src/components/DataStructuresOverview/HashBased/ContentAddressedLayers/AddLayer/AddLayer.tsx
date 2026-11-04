import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { AddLayerAnimation } from './AddLayerAnimation.ts'
import './AddLayer.css'

export default class AddLayer extends StructuredLinearAction {
  protected readonly sequence = AddLayerAnimation
}
