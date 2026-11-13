import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { SramCellAnimation } from './SramCellAnimation.ts'
import './SramCell.css'

export default class SramCell extends ActionView<HardwareSnapshot> {
  protected readonly definition = new SramCellAnimation()
}
