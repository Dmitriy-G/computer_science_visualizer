import { ArrayNetworkSort } from './ArrayNetworkSort.ts'

export class OddEvenArraySort extends ArrayNetworkSort {
  public sort(): void {
    if (this.entries.length < 2) return
    let swapped = true
    while (swapped) {
      swapped = false
      for (let parity = 0; parity < 2; parity += 1) {
        this.emit('stage', parity === 0 ? 'Compare even-start pairs' : 'Compare odd-start pairs', `Compare disjoint neighbors starting at indices ${parity}, ${parity + 2}, and so on. Equal values remain in order.`, `for i = ${parity}; i + 1 < n; i += 2`)
        for (let index = parity; index + 1 < this.entries.length; index += 2) {
          if (this.compareExchange(index, index + 1)) swapped = true
        }
      }
      this.emit('pass', swapped ? 'Begin another odd-even round' : 'Both parities are ordered', swapped ? 'At least one adjacent pair changed, so check both parities again.' : 'Neither phase exchanged a pair. Every neighboring pair is ordered.', 'repeat until both phases make no swaps', swapped ? {} : { sortedPrefix: this.entries.length })
    }
  }
}
