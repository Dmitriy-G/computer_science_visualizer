import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { CpuModel } from '../CpuModel.ts'
import { SramCellAnimation } from './SramCellAnimation.ts'
import './SramCell.css'

export default class SramCell extends ActionView<CpuModel> {
  protected readonly definition = new SramCellAnimation()
}
