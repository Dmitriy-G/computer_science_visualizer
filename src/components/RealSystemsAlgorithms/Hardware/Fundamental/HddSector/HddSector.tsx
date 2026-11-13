import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { HddSectorAnimation } from './HddSectorAnimation.ts'
import './HddSector.css'

export default class HddSector extends ActionView<HardwareSnapshot> {
  protected readonly definition = new HddSectorAnimation()
}
