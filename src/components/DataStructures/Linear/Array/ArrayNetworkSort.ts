import { ArraySortOperations } from './ArraySortOperations.ts'

// Comparator execution only; callers own stage generation and termination.
export class ArrayNetworkSort extends ArraySortOperations {
  protected compareExchange(first: number, second: number, ascending = true): boolean {
    // Ascending networks may omit conceptual trailing +infinity wires. No
    // sentinel value, spare slot, or input-sized comparator list is allocated.
    if (second >= this.entries.length) return false
    const frame = { comparator: { first, second, ascending }, roles: { [first]: ascending ? 'LOW' : 'HIGH', [second]: ascending ? 'HIGH' : 'LOW' } }
    const order = this.compare(first, second, frame)
    if (ascending ? order <= 0 : order >= 0) return false
    this.swap(first, second, frame)
    return true
  }

  protected networkWidth(): number {
    let width = 1
    while (width < this.entries.length) width *= 2
    return width
  }
}
