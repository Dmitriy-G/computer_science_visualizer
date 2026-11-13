import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { SsdFtlAnimation } from './SsdFtlAnimation.ts'
import './SsdFtl.css'

export default class SsdFtl extends ActionView<HardwareSnapshot> {
  protected readonly definition = new SsdFtlAnimation()
}
