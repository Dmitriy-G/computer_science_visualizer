import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { PreorderAnimation } from './PreorderAnimation.ts'
import './Preorder.css'

export default class Preorder extends StructuredTreeAction {
  protected readonly sequence = PreorderAnimation
}
