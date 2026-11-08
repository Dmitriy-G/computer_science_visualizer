import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareModel } from '../HardwareModel.ts'
import { MemoryFencesAnimation } from './MemoryFencesAnimation.ts'
import './MemoryFences.css'

export default class MemoryFences extends ActionView<HardwareModel> {
  protected readonly definition = new MemoryFencesAnimation()
}
