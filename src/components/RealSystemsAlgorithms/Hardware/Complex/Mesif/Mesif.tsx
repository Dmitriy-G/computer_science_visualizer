import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareModel } from '../HardwareModel.ts'
import { MesifAnimation } from './MesifAnimation.ts'
import './Mesif.css'

export default class Mesif extends ActionView<HardwareModel> {
  protected readonly definition = new MesifAnimation()
}
