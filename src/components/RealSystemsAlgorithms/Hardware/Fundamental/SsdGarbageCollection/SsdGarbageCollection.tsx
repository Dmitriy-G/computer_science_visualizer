import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { SsdGarbageCollectionAnimation } from './SsdGarbageCollectionAnimation.ts'
import './SsdGarbageCollection.css'

export default class SsdGarbageCollection extends ActionView<HardwareSnapshot> {
  protected readonly definition = new SsdGarbageCollectionAnimation()
}
