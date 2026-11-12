import { ArrayNetworkSort } from './ArrayNetworkSort.ts'

export class PairwiseNetworkArraySort extends ArrayNetworkSort {
  public sort(): void {
    if (this.entries.length < 2) return
    this.sortPairs(0, this.networkWidth(), 1)
  }

  private sortPairs(start: number, count: number, stride: number): void {
    if (count < 2 || start >= this.entries.length) return
    this.emit('stage', 'Order each pair internally', `Compare pair members ${stride} slots apart in this strided subnetwork. Lower values go to the first wire of each pair.`, `orderPairs(start = ${start}, stride = ${stride})`, {}, start)
    for (let pair = 0; pair < count / 2; pair += 1) {
      const first = start + 2 * pair * stride
      this.compareExchange(first, first + stride)
    }
    this.sortPairs(start, count / 2, 2 * stride)
    this.sortPairs(start + stride, count / 2, 2 * stride)
    for (let distance = count / 4; distance >= 1; distance /= 2) {
      this.emit('stage', 'Combine the ordered pairs', `Compare upper members with lower members ${distance} pairs ahead, then halve that pair distance. The schedule depends only on array length.`, `pairDistance = ${distance}; stride = ${stride}`, {}, start)
      for (let pair = 0; pair < count / 2 - distance; pair += 1) {
        this.compareExchange(start + (2 * pair + 1) * stride, start + 2 * (pair + distance) * stride)
      }
    }
    this.emit('merge', 'Pairwise subnetwork complete', 'This strided group is ordered. Return to the surrounding pairwise construction.', 'finish ordered-pair network', {}, start)
  }
}
