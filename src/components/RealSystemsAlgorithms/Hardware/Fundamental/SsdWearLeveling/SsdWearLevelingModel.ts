import { FlashStorage } from '../FlashStorage.ts'
import { SsdWearLevelingLayout } from './SsdWearLevelingLayout.ts'

export class SsdWearLevelingModel extends FlashStorage {
  public readonly concentrated = [4, 4, 0]
  public readonly distributed = [4, 4, 0]

  constructor() {
    super()
    this.erases[0] = 0
    this.erases[1] = 4
    this.erases[2] = 6
    this.write(0, 'cold', 0)
    this.operation = 'cold data pins low-wear B0'
    this.flowFrom = null
    this.flowTo = null
  }

  public compareAllocations(): void {
    for (let cycle = 0; cycle < 6; cycle += 1) {
      this.concentrated[0] += 1
      let low = 0
      for (let block = 1; block < 3; block += 1) if (this.distributed[block] < this.distributed[low]) low = block
      this.distributed[low] += 1
    }
    this.output = `fixed ${this.concentrated.join('/')} vs spread ${this.distributed.join('/')}`
    this.operation = 'same six erase cycles / comparison'
  }

  public chooseLowWearFreeBlock(): number {
    let selected = -1
    for (let block = 0; block < 3; block += 1) if (this.freeBlock(block) && (selected === -1 || this.erases[block] < this.erases[selected])) selected = block
    if (selected === -1) throw new Error('No free block for dynamic wear leveling')
    this.selectedBlock = selected
    this.operation = 'dynamic / lowest-wear free block'
    this.flowFrom = 'controller'
    this.flowTo = `erase-${selected}`
    return selected
  }

  public coldDestination(): number {
    let destination = -1
    for (let block = 0; block < 3; block += 1) if (this.freeBlock(block) && (destination === -1 || this.erases[block] > this.erases[destination])) destination = block
    if (destination === -1) throw new Error('No erased block for cold data')
    return destination * 3
  }

  public snapshot() { return SsdWearLevelingLayout.create(this) }
}
