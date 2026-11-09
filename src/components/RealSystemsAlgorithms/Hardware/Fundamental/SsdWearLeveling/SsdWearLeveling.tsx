import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { CpuModel } from '../CpuModel.ts'
import { SsdWearLevelingAnimation } from './SsdWearLevelingAnimation.ts'
import './SsdWearLeveling.css'

export default class SsdWearLeveling extends ActionView<CpuModel> {
  protected readonly definition = new SsdWearLevelingAnimation()
}
