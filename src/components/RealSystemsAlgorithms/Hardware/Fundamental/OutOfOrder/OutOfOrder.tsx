import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { OutOfOrderAnimation } from './OutOfOrderAnimation.ts'
import './OutOfOrder.css'

export default class OutOfOrder extends ActionView<HardwareSnapshot> {
  protected readonly definition = new OutOfOrderAnimation()
}
