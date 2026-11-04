import StructuredLinearAction from '../../../../ActionPlayback/StructuredLinearAction.tsx'
import { ScanAnimation } from './ScanAnimation.ts'
import './Scan.css'

export default class Scan extends StructuredLinearAction {
  protected readonly sequence = ScanAnimation
}
