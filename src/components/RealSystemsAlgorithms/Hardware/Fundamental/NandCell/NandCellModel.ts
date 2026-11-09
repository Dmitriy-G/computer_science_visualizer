import type { Bit } from '../Latch/LatchModel.ts'
import { NandCellLayout } from './NandCellLayout.ts'

export class NandCellModel {
  public readonly pages: Bit[][] = [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]]
  public readonly programmed = [false, false, false]
  public buffer: Bit[] = [1, 0, 1, 0]
  public selectedPage = 0
  public output: Bit[] | null = null
  public erases = 0
  public operation = 'erased'

  public program(page: number): boolean {
    if (!this.pages[page]) throw new RangeError('Unknown page')
    if (this.programmed[page]) { this.operation = 'overwrite rejected'; return false }
    this.pages[page] = [...this.buffer]
    this.programmed[page] = true
    this.selectedPage = page
    this.operation = 'program'
    return true
  }

  public read(page: number): void {
    if (!this.pages[page]) throw new RangeError('Unknown page')
    this.selectedPage = page
    this.output = [...this.pages[page]]
    this.operation = 'sense'
  }

  public eraseBlock(): void {
    for (let page = 0; page < this.pages.length; page += 1) {
      this.pages[page] = [1, 1, 1, 1]
      this.programmed[page] = false
    }
    this.erases += 1
    this.operation = 'block erase'
  }

  public snapshot() { return NandCellLayout.create(this) }
}
