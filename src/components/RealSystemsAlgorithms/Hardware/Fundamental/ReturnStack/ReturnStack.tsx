import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { ReturnStackAnimation } from './ReturnStackAnimation.ts'
import './ReturnStack.css'

export default class ReturnStack extends ActionView<HardwareSnapshot> {
  protected readonly definition = new ReturnStackAnimation()
}
