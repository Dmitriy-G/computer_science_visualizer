import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { LocateOwnerAnimation } from './LocateOwnerAnimation.ts'
import './LocateOwner.css'

export default class LocateOwner extends StructuredLinearAction {
  protected readonly sequence = LocateOwnerAnimation
}
