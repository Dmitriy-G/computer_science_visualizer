import { ArraySortOperations } from './ArraySortOperations.ts'

export class ArrayNetworkSort extends ArraySortOperations {
  protected compareExchange(first: number, second: number, ascending = true): boolean {
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
