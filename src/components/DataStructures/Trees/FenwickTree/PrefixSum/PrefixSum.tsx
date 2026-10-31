import StructuredTreeAction from '../../../../ActionPlayback/StructuredTreeAction.tsx'
import { PrefixSumAnimation } from './PrefixSumAnimation.ts'
import './PrefixSum.css'

export default class PrefixSum extends StructuredTreeAction {
  protected readonly sequence = PrefixSumAnimation
}
