import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareModel } from '../HardwareModel.ts'
import { MoesiAnimation } from './MoesiAnimation.ts'
import './Moesi.css'

export default class Moesi extends ActionView<HardwareModel> {
  protected readonly definition = new MoesiAnimation()
}
