import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ReadChainAnimation } from './ReadChainAnimation.ts'
import './ReadChain.css'

export default class ReadChain extends StructuredLinearAction {
  protected readonly sequence = ReadChainAnimation
}
