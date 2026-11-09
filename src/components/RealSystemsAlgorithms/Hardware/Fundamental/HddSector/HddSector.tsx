import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { CpuModel } from '../CpuModel.ts'
import { HddSectorAnimation } from './HddSectorAnimation.ts'
import './HddSector.css'

export default class HddSector extends ActionView<CpuModel> {
  protected readonly definition = new HddSectorAnimation()
}
