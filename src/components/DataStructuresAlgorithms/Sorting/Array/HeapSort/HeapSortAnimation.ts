import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class HeapSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Heap Sort', 'Build a max-heap in the array, swap its maximum into the sorted suffix, and iteratively sift the replacement root down. Equal entries may change order.', size,
      ['O(n)', 'O(n log n)', 'O(n log n)'],
      'Best: all-equal values stop each sift immediately, giving linear work even at the same input size. Average assumes uniformly random distinct values; average and worst extraction work is O(n log n). Bottom-up heap construction is O(n). Empty and singleton arrays take O(1) time.',
      'O(1)', 'Iterative sifting uses only parent/child indices and one swap entry. No recursion or auxiliary heap allocation is used.')
  }

  constructor(model: FixedArray) {
    super(model, 'Heap Sort')
    this.result.heapSort((event) => {
      if (event.kind === 'heap') this.record(event, 2, 'Build the max-heap', `Sift index ${event.index} within the ${event.amount}-entry heap. Children of i are 2i + 1 and 2i + 2.`, `siftDown(${event.index}, heapSize = ${event.amount})`)
      else if (event.kind === 'compare') this.record(event, 2, 'Compare heap entries', `Compare ${this.result.getAt(event.index).value} at ${event.index} with ${this.result.getAt(event.other!).value} at ${event.other}. The parent must be at least as large as either child.`, `compare(array[${event.index}], array[${event.other}])`)
      else if (event.kind === 'swap') this.record(event, 3, 'Repair heap order', `Swap indices ${event.index} and ${event.other}; continue sifting at the lower position.`, `swap(array[${event.index}], array[${event.other}])`)
      else if (event.kind === 'extract') this.record(event, 4, 'Move the maximum into the sorted suffix', `Index ${event.index} now holds its final value ${this.result.getAt(event.index).value}. Repair the remaining ${event.amount}-entry heap.`, `swap(root, array[${event.index}])\nheapSize = ${event.amount}`)
      else this.record(event, 2, 'Max-heap ready', 'Every parent dominates its children. The maximum is at index zero; repeatedly move it to the end of the remaining heap.', 'while heapSize > 1: extract maximum')
    })
    this.finish(false)
  }
}
