import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { WriteOneBitAnimation } from './WriteOneBitAnimation.ts'
import './WriteOneBit.css'

export default class WriteOneBit extends ActionView<HardwareSnapshot> {
  protected readonly definition = new WriteOneBitAnimation()
}
