import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { InspectStorageAnimation } from './InspectStorageAnimation.ts'
import './InspectStorage.css'

export default class InspectStorage extends StructuredLinearAction {
  protected readonly sequence = InspectStorageAnimation
}
