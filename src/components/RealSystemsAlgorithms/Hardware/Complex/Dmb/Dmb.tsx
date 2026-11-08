import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareModel } from '../HardwareModel.ts'
import { DmbAnimation } from './DmbAnimation.ts'
import './Dmb.css'

export default class Dmb extends ActionView<HardwareModel> {
  protected readonly definition = new DmbAnimation()
}
