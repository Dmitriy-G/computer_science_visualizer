import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { WriteOneSectorAnimation } from './WriteOneSectorAnimation.ts'
import './WriteOneSector.css'

export default class WriteOneSector extends ActionView<HardwareSnapshot> {
  protected readonly definition = new WriteOneSectorAnimation()
}
