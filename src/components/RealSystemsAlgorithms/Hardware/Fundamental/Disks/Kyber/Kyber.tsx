import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { DiskWorkload } from '../DiskWorkload.ts'
import { KyberAnimation } from './KyberAnimation.ts'
import './Kyber.css'

export default class Kyber extends ActionView<DiskWorkload> {
  protected readonly definition = new KyberAnimation()
}
