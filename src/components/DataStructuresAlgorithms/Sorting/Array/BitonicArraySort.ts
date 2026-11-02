import { ArrayNetworkSort } from './ArrayNetworkSort.ts'

// Arbitrary-length bitonic construction, following H. W. Lang's merge rule:
// https://www.hwlang.de/algorithmen/sortieren/bitonic/oddn.htm
export class BitonicArraySort extends ArrayNetworkSort {
  public sort(): void {
    this.sortRange(0, this.entries.length, true)
  }

  private sortRange(start: number, count: number, ascending: boolean): void {
    if (count < 2) return
    const half = Math.floor(count / 2)
    this.sortRange(start, half, !ascending)
    this.sortRange(start + half, count - half, ascending)
    this.emit('stage', 'Merge a bitonic range', `The two pieces run in opposite directions. Merge indices ${start} through ${start + count - 1} in ${ascending ? 'ascending' : 'descending'} order without padding the array.`, `bitonicMerge(${start}, ${count}, ${ascending ? 'ascending' : 'descending'})`, { roles: { [start]: ascending ? 'ASCENDING' : 'DESCENDING' } }, start)
    this.merge(start, count, ascending)
    this.emit('merge', 'Bitonic range ordered', `Indices ${start} through ${start + count - 1} now run ${ascending ? 'upward' : 'downward'} as required by this stage.`, 'finish this bitonic range', {}, start)
  }

  private merge(start: number, count: number, ascending: boolean): void {
    if (count < 2) return
    let distance = 1
    while (2 * distance < count) distance *= 2
    for (let index = start; index < start + count - distance; index += 1) this.compareExchange(index, index + distance, ascending)
    this.merge(start, distance, ascending)
    this.merge(start + distance, count - distance, ascending)
  }
}
