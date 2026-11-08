import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareModel } from '../HardwareModel.ts'
import { DsbAnimation } from './DsbAnimation.ts'
import './Dsb.css'

export default class Dsb extends ActionView<HardwareModel> {
  protected readonly definition = new DsbAnimation()
}
