import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { NetworkToServerAnimation } from './NetworkToServerAnimation.ts'
import './NetworkToServer.css'

export default class NetworkToServer extends ActionView<HardwareSnapshot> {
  protected readonly definition = new NetworkToServerAnimation()
}
