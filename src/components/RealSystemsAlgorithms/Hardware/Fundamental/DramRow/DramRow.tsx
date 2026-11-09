import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { CpuModel } from '../CpuModel.ts'
import { DramRowAnimation } from './DramRowAnimation.ts'
import './DramRow.css'

export default class DramRow extends ActionView<CpuModel> {
  protected readonly definition = new DramRowAnimation()
}
