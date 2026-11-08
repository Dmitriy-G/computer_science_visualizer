import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareModel } from '../HardwareModel.ts'
import { TranslationAnimation } from './TranslationAnimation.ts'
import './Translation.css'

export default class Translation extends ActionView<HardwareModel> {
  protected readonly definition = new TranslationAnimation()
}
