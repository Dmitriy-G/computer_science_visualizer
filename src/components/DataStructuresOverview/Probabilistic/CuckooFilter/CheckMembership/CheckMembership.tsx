import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { CheckMembershipAnimation } from './CheckMembershipAnimation.ts'
import './CheckMembership.css'

export default class CheckMembership extends StructuredLinearAction {
  protected readonly sequence = CheckMembershipAnimation
}
