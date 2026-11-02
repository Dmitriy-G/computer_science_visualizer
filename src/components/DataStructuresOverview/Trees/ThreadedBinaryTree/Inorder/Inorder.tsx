import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { InorderAnimation } from './InorderAnimation.ts'
import './Inorder.css'

export default class Inorder extends StructuredTreeAction {
  protected readonly sequence = InorderAnimation
}
