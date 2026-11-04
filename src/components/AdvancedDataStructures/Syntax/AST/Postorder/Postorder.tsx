import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { PostorderAnimation } from './PostorderAnimation.ts'
import './Postorder.css'

export default class Postorder extends StructuredTreeAction {
  protected readonly sequence = PostorderAnimation
}
