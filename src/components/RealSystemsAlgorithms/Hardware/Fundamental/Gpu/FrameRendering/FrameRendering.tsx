import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { FrameRenderingAnimation } from './FrameRenderingAnimation.ts'
import './FrameRendering.css'

export default class FrameRendering extends ActionView<HardwareSnapshot> {
  protected readonly definition = new FrameRenderingAnimation()
}
