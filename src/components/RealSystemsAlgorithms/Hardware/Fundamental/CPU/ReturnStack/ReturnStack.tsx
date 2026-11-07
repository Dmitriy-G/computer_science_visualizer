import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { CpuModel } from '../CpuModel.ts'
import { ReturnStackAnimation } from './ReturnStackAnimation.ts'
import './ReturnStack.css'

export default class ReturnStack extends ActionView<CpuModel> {
  protected readonly definition = new ReturnStackAnimation()
}
