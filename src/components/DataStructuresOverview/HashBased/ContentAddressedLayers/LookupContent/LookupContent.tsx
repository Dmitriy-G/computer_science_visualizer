import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { LookupContentAnimation } from './LookupContentAnimation.ts'
import './LookupContent.css'

export default class LookupContent extends StructuredLinearAction {
  protected readonly sequence = LookupContentAnimation
}
