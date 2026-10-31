import StructuredGraphAction from '../../../../ActionPlayback/StructuredGraphAction.tsx'
import { TopologicalSortAnimation } from './TopologicalSortAnimation.ts'
import './TopologicalSort.css'

export default class TopologicalSort extends StructuredGraphAction {
  protected readonly sequence = TopologicalSortAnimation
}
