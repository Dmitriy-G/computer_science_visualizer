import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { CpuModel } from '../CpuModel.ts'
import { RegisterRenamingAnimation } from './RegisterRenamingAnimation.ts'
import './RegisterRenaming.css'

export default class RegisterRenaming extends ActionView<CpuModel> {
  protected readonly definition = new RegisterRenamingAnimation()
}
