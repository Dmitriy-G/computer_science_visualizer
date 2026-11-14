import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { NetworkByteToSsdAnimation } from './NetworkByteToSsdAnimation.ts'
import './NetworkByteToSsd.css'

export default class NetworkByteToSsd extends ActionView<HardwareSnapshot> {
  protected readonly definition = new NetworkByteToSsdAnimation()
}
