import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareModel } from '../HardwareModel.ts'
import { AcquireReleaseAnimation } from './AcquireReleaseAnimation.ts'
import './AcquireRelease.css'

export default class AcquireRelease extends ActionView<HardwareModel> {
  protected readonly definition = new AcquireReleaseAnimation()
}
