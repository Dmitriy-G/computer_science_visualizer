import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { InspectOwnershipAnimation } from './InspectOwnershipAnimation.ts'
import './InspectOwnership.css'

export default class InspectOwnership extends StructuredLinearAction {
  protected readonly sequence = InspectOwnershipAnimation
}
