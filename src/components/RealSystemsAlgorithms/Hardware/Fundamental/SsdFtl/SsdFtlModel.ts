import { FlashStorage } from '../FlashStorage.ts'
import { SsdFtlLayout } from './SsdFtlLayout.ts'

export class SsdFtlModel extends FlashStorage {
  constructor() {
    super()
    this.write(0, 'A', 0)
    this.write(1, 'B', 1)
    this.operation = 'initial mapping'
    this.flowFrom = null
    this.flowTo = null
  }

  public allocate(): number {
    for (let page = 0; page < this.pages.length; page += 1) if (this.pages[page].state === 'free') {
      this.operation = 'allocate erased page'
      this.flowFrom = 'controller'
      this.flowTo = `page-${page}`
      return page
    }
    throw new Error('No erased page available')
  }

  public snapshot() { return SsdFtlLayout.create(this) }
}
