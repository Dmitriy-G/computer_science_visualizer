import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareModel } from '../HardwareModel.ts'
import { InstructionSyncAnimation } from './InstructionSyncAnimation.ts'
import './InstructionSync.css'

export default class InstructionSync extends ActionView<HardwareModel> {
  protected readonly definition = new InstructionSyncAnimation()
}
