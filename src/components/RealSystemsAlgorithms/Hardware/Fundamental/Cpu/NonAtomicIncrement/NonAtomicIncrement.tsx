import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { NonAtomicIncrementAnimation } from './NonAtomicIncrementAnimation.ts'
import './NonAtomicIncrement.css'

export default class NonAtomicIncrement extends ActionView<HardwareSnapshot> {
  protected readonly definition = new NonAtomicIncrementAnimation()
}
