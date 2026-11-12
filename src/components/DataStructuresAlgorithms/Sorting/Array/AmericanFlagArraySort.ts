import { IntegerDistributionSort } from './IntegerDistributionSort.ts'

export class AmericanFlagArraySort extends IntegerDistributionSort {
  public sort(): void {
    if (this.entries.length < 2) return
    const { minimum, maximum } = this.bounds()
    if (minimum === maximum) {
      this.step('pass', 'All keys are equal', 'The bounds scan found one key; no radix partition is needed.', 'if min == max: return')
      return
    }
    let place = 1n
    while ((maximum - minimum) / place >= 16n) place *= 16n
    this.sortRange(0, this.entries.length, minimum, place)
  }

  private sortRange(start: number, end: number, minimum: bigint, place: bigint): void {
    if (end - start < 2 || place === 0n) return
    this.cells = []
    this.cellStatus = 'COUNT'
    this.step('digit', 'Select the next most significant digit', `Partition [${start}, ${end}) by hexadecimal place ${place}; process less significant digits only inside each completed bin.`, 'digit = ((key - min) / place) % 16', {}, start, end - 1)
    const boundaries = this.distribute(start, end, 16, (entry) => Number(((BigInt(entry.value) - minimum) / place) % 16n))
    for (let bin = 0; bin < 16; bin += 1) this.sortRange(boundaries[bin], boundaries[bin + 1], minimum, place / 16n)
  }
}
