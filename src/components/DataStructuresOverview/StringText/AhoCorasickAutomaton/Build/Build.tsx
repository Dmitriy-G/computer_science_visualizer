import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { BuildAnimation } from './BuildAnimation.ts'
import './Build.css'

export default class Build extends StructuredLinearAction {
  protected readonly sequence = BuildAnimation
}
