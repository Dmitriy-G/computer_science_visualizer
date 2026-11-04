import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { VerifyProofAnimation } from './VerifyProofAnimation.ts'
import './VerifyProof.css'

export default class VerifyProof extends StructuredTreeAction {
  protected readonly sequence = VerifyProofAnimation
}
