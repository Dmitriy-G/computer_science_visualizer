import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { ServerToNetworkAnimation } from './ServerToNetworkAnimation.ts'
import './ServerToNetwork.css'

export default class ServerToNetwork extends ActionView<HardwareSnapshot> {
  protected readonly definition = new ServerToNetworkAnimation()
}
