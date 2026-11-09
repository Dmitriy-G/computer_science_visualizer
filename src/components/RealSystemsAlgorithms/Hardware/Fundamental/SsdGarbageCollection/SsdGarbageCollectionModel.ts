import { FlashStorage } from '../FlashStorage.ts'
import { SsdGarbageCollectionLayout } from './SsdGarbageCollectionLayout.ts'

export class SsdGarbageCollectionModel extends FlashStorage {
  constructor() {
    super()
    this.write(0, 'A', 0)
    this.write(1, 'B', 1)
    this.write(2, 'C', 2)
    this.write(0, 'A2', 3)
    this.write(2, 'C2', 4)
    this.operation = 'after five host writes'
    this.flowFrom = null
    this.flowTo = null
    this.detail = 'GC chooses the block with most invalid pages, breaking ties by block number, then preserves each live page before erasing. This is an illustrative policy. Filesystem deletion alone does not invalidate these pages; deallocation must reach the device. GC reclaims space; it does not select blocks to balance wear.'
  }

  public chooseVictim(): number {
    let victim = -1
    let mostInvalid = 0
    for (let block = 0; block < 3; block += 1) {
      let invalid = 0
      for (let page = block * 3; page < block * 3 + 3; page += 1) if (this.pages[page].state === 'invalid') invalid += 1
      if (invalid > mostInvalid) { mostInvalid = invalid; victim = block }
    }
    if (victim === -1) throw new Error('No block with invalid pages')
    this.selectedBlock = victim
    this.operation = 'most invalid pages / victim'
    this.flowFrom = null
    this.flowTo = null
    return victim
  }

  public destination(victim: number): number {
    for (let page = 0; page < this.pages.length; page += 1) if (Math.floor(page / 3) !== victim && this.pages[page].state === 'free') return page
    throw new Error('Reserve destination space before reclaiming')
  }

  public snapshot() { return SsdGarbageCollectionLayout.create(this) }
}
