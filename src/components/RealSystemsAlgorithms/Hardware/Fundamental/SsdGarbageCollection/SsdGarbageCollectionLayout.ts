import { FlashLayout } from '../FlashLayout.ts'
import type { SsdGarbageCollectionModel } from './SsdGarbageCollectionModel.ts'

export class SsdGarbageCollectionLayout {
  public static create(model: SsdGarbageCollectionModel) {
    return FlashLayout.create(model, 'Garbage collection / preserve then erase')
  }
}
