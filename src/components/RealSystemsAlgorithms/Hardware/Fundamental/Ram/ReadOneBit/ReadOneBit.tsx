import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { ReadOneBitAnimation } from './ReadOneBitAnimation.ts'
import './ReadOneBit.css'

export default class ReadOneBit extends ActionView<HardwareSnapshot> {
  protected readonly definition = new ReadOneBitAnimation()
}
