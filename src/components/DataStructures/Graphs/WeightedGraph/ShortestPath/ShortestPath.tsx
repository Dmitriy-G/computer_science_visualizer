import StructuredGraphAction from '../../../../ActionPlayback/StructuredGraphAction.tsx'
import { ShortestPathAnimation } from './ShortestPathAnimation.ts'
import './ShortestPath.css'

export default class ShortestPath extends StructuredGraphAction {
  protected readonly sequence = ShortestPathAnimation
}
