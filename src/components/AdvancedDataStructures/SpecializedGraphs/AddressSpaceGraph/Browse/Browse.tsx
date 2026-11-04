import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { BrowseAnimation } from './BrowseAnimation.ts'
import './Browse.css'

export default class Browse extends StructuredLinearAction {
  protected readonly sequence = BrowseAnimation
}
