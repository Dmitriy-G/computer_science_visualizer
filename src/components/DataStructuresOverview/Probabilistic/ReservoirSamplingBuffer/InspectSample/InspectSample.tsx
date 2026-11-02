import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { InspectSampleAnimation } from './InspectSampleAnimation.ts'
import './InspectSample.css'

export default class InspectSample extends StructuredLinearAction {
  protected readonly sequence = InspectSampleAnimation
}
