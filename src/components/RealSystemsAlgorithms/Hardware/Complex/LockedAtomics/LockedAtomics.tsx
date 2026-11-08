import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareModel } from '../HardwareModel.ts'
import { LockedAtomicsAnimation } from './LockedAtomicsAnimation.ts'
import './LockedAtomics.css'

export default class LockedAtomics extends ActionView<HardwareModel> {
  protected readonly definition = new LockedAtomicsAnimation()
}
