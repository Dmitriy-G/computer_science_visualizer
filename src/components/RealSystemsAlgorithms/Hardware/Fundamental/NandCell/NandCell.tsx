import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { NandCellAnimation } from './NandCellAnimation.ts'
import './NandCell.css'

export default class NandCell extends ActionView<HardwareSnapshot> {
  protected readonly definition = new NandCellAnimation()
}
