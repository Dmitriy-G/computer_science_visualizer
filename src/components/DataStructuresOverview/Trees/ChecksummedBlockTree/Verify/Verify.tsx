import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { VerifyAnimation } from './VerifyAnimation.ts'
import './Verify.css'

export default class Verify extends StructuredLinearAction {
  protected readonly sequence = VerifyAnimation
}
