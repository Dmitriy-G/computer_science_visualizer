import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../../HardwareSnapshot.ts'
import { WriteOnePageAnimation } from './WriteOnePageAnimation.ts'
import './WriteOnePage.css'

export default class WriteOnePage extends ActionView<HardwareSnapshot> {
  protected readonly definition = new WriteOnePageAnimation()
}
