import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { RegisterRenamingAnimation } from './RegisterRenamingAnimation.ts'
import './RegisterRenaming.css'

export default class RegisterRenaming extends ActionView<HardwareSnapshot> {
  protected readonly definition = new RegisterRenamingAnimation()
}
