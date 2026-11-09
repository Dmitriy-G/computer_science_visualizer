import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { CpuModel } from '../CpuModel.ts'
import { SsdFtlAnimation } from './SsdFtlAnimation.ts'
import './SsdFtl.css'

export default class SsdFtl extends ActionView<CpuModel> {
  protected readonly definition = new SsdFtlAnimation()
}
