import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { BuildAnimation } from './BuildAnimation.ts'
import './Build.css'

export default class Build extends StructuredTreeAction {
  protected readonly sequence = BuildAnimation
}
