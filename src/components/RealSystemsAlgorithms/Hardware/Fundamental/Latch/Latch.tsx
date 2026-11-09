import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { CpuModel } from '../CpuModel.ts'
import { LatchAnimation } from './LatchAnimation.ts'
import './Latch.css'

export default class Latch extends ActionView<CpuModel> {
  protected readonly definition = new LatchAnimation()
}
