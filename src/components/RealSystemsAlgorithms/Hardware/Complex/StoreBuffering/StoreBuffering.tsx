import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareModel } from '../HardwareModel.ts'
import { StoreBufferingAnimation } from './StoreBufferingAnimation.ts'
import './StoreBuffering.css'

export default class StoreBuffering extends ActionView<HardwareModel> {
  protected readonly definition = new StoreBufferingAnimation()
}
