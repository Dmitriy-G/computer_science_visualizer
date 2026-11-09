import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { CpuModel } from '../CpuModel.ts'
import { NandCellAnimation } from './NandCellAnimation.ts'
import './NandCell.css'

export default class NandCell extends ActionView<CpuModel> {
  protected readonly definition = new NandCellAnimation()
}
