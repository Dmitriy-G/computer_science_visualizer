import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareModel } from '../HardwareModel.ts'
import { ExclusiveLoopAnimation } from './ExclusiveLoopAnimation.ts'
import './ExclusiveLoop.css'

export default class ExclusiveLoop extends ActionView<HardwareModel> {
  protected readonly definition = new ExclusiveLoopAnimation()
}
