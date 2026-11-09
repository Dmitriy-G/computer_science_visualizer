import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { CpuModel } from '../CpuModel.ts'
import { SsdGarbageCollectionAnimation } from './SsdGarbageCollectionAnimation.ts'
import './SsdGarbageCollection.css'

export default class SsdGarbageCollection extends ActionView<CpuModel> {
  protected readonly definition = new SsdGarbageCollectionAnimation()
}
