import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { UpdateCapacityAnimation } from './UpdateCapacityAnimation.ts'
import './UpdateCapacity.css'

export default class UpdateCapacity extends StructuredLinearAction {
  protected readonly sequence = UpdateCapacityAnimation
}
