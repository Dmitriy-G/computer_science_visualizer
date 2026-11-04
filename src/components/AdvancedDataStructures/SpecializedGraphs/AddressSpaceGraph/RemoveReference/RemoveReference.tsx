import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { RemoveReferenceAnimation } from './RemoveReferenceAnimation.ts'
import './RemoveReference.css'

export default class RemoveReference extends StructuredLinearAction {
  protected readonly sequence = RemoveReferenceAnimation
}
