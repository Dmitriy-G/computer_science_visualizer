import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { ReadOnePageAnimation } from './ReadOnePageAnimation.ts'
import './ReadOnePage.css'

export default class ReadOnePage extends ActionView<HardwareSnapshot> {
  protected readonly definition = new ReadOnePageAnimation()
}
