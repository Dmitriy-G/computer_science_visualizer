import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { FindRepresentativeAnimation } from './FindRepresentativeAnimation.ts'
import './FindRepresentative.css'

export default class FindRepresentative extends StructuredLinearAction {
  protected readonly sequence = FindRepresentativeAnimation
}
