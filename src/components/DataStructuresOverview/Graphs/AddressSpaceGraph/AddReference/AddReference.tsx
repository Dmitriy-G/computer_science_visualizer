import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { AddReferenceAnimation } from './AddReferenceAnimation.ts'
import './AddReference.css'

export default class AddReference extends StructuredLinearAction {
  protected readonly sequence = AddReferenceAnimation
}
