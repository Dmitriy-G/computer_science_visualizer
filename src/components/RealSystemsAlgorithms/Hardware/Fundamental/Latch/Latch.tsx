import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { LatchAnimation } from './LatchAnimation.ts'
import './Latch.css'

export default class Latch extends ActionView<HardwareSnapshot> {
  protected readonly definition = new LatchAnimation()
}
