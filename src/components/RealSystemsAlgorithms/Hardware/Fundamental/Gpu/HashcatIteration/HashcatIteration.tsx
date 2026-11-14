import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { HashcatIterationAnimation } from './HashcatIterationAnimation.ts'
import './HashcatIteration.css'

export default class HashcatIteration extends ActionView<HardwareSnapshot> {
  protected readonly definition = new HashcatIterationAnimation()
}
