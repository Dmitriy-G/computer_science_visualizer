import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { DiskWorkload } from '../DiskWorkload.ts'
import { MqDeadlineAnimation } from './MqDeadlineAnimation.ts'
import './MqDeadline.css'

export default class MqDeadline extends ActionView<DiskWorkload> {
  protected readonly definition = new MqDeadlineAnimation()
}
