import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { ReadOneSectorAnimation } from './ReadOneSectorAnimation.ts'
import './ReadOneSector.css'

export default class ReadOneSector extends ActionView<HardwareSnapshot> {
  protected readonly definition = new ReadOneSectorAnimation()
}
