import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareModel } from '../HardwareModel.ts'
import { LseAtomicsAnimation } from './LseAtomicsAnimation.ts'
import './LseAtomics.css'

export default class LseAtomics extends ActionView<HardwareModel> {
  protected readonly definition = new LseAtomicsAnimation()
}
