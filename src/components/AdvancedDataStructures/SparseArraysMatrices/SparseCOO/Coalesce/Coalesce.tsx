import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { CoalesceAnimation } from './CoalesceAnimation.ts'
import './Coalesce.css'

export default class Coalesce extends StructuredLinearAction {
  protected readonly sequence = CoalesceAnimation
}
