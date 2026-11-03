import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ReleaseAnimation } from './ReleaseAnimation.ts'
import './Release.css'

export default class Release extends StructuredLinearAction {
  protected readonly sequence = ReleaseAnimation
}
