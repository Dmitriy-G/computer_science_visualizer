import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { StoreAnimation } from './StoreAnimation.ts'
import './Store.css'

export default class Store extends StructuredLinearAction {
  protected readonly sequence = StoreAnimation
}
