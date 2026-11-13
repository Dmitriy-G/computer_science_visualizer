import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { DramRowAnimation } from './DramRowAnimation.ts'
import './DramRow.css'

export default class DramRow extends ActionView<HardwareSnapshot> {
  protected readonly definition = new DramRowAnimation()
}
