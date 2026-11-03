import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { IntersectionAnimation } from './IntersectionAnimation.ts'
import './Intersection.css'

export default class Intersection extends StructuredLinearAction {
  protected readonly sequence = IntersectionAnimation
}
