import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { AtomicLoadAnimation } from './AtomicLoadAnimation.ts'
import './AtomicLoad.css'

export default class AtomicLoad extends ActionView<HardwareSnapshot> {
  protected readonly definition = new AtomicLoadAnimation()
}
