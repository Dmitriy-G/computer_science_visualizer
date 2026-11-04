import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { NearestNeighborAnimation } from './NearestNeighborAnimation.ts'
import './NearestNeighbor.css'

export default class NearestNeighbor extends StructuredLinearAction {
  protected readonly sequence = NearestNeighborAnimation
}
