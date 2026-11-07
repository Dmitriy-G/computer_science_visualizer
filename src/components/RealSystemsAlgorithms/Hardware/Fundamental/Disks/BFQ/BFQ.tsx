import ActionView from '../../../../../ActionPlayback/ActionView.tsx'
import type { DiskWorkload } from '../DiskWorkload.ts'
import { BFQAnimation } from './BFQAnimation.ts'
import './BFQ.css'

export default class BFQ extends ActionView<DiskWorkload> {
  protected readonly definition = new BFQAnimation()
}
