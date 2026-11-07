import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { CpuModel } from '../CpuModel.ts'
import { OutOfOrderAnimation } from './OutOfOrderAnimation.ts'
import './OutOfOrder.css'

export default class OutOfOrder extends ActionView<CpuModel> {
  protected readonly definition = new OutOfOrderAnimation()
}
