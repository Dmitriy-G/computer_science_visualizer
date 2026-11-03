import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { CountAnimation } from './CountAnimation.ts'
import './Count.css'

export default class Count extends StructuredLinearAction {
  protected readonly sequence = CountAnimation
}
