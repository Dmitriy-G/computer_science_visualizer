import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { SsdWearLevelingAnimation } from './SsdWearLevelingAnimation.ts'
import './SsdWearLeveling.css'

export default class SsdWearLeveling extends ActionView<HardwareSnapshot> {
  protected readonly definition = new SsdWearLevelingAnimation()
}
