import StructuredGraphAction from '../../../../ActionPlayback/StructuredGraphAction.tsx'
import { UpdateWeightAnimation } from './UpdateWeightAnimation.ts'
import './UpdateWeight.css'

export default class UpdateWeight extends StructuredGraphAction {
  protected readonly sequence = UpdateWeightAnimation
}
