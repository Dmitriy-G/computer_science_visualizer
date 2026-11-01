import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../FixedArray.ts'

export class CountingSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Counting Sort', `Count integer keys relative to their minimum, compute starting offsets, and distribute entries stably into output. Accept at most ${FixedArray.maximumCountingRange} distinct possible key values in the inclusive range.`, size,
      ['O(n + k)', 'O(n + k)', 'O(n + k)'],
      'For accepted inputs, all orders require scanning n entries, initializing and prefix-scanning k count cells, and writing n output entries. No distribution assumption is needed. An overly wide range is rejected before allocation in O(n) time with O(1) extra storage. Empty and singleton inputs finish in O(1).',
      'O(n + k)', 'Counts and starting positions for k possible keys plus an output array of n entries. Negative values are supported by subtracting the minimum with exact integer arithmetic.',
      [{ symbol: 'k', meaning: `Inclusive key range max - min + 1, limited to ${FixedArray.maximumCountingRange} count cells for this visualizer.` }])
  }

  constructor(model: FixedArray) {
    super(model, 'Counting Sort', { distribution: true })
    let rejection = ''
    const accepted = this.result.countingSort((event) => {
      if (event.kind === 'reject') {
        rejection = event.detail!
        this.record(event, 2, 'Range too wide', rejection, `if max - min + 1 > ${FixedArray.maximumCountingRange}: reject`)
      } else if (event.kind === 'count') this.record(event, 2, 'Count a key', `Key ${event.label} now has frequency ${event.amount}. The count row shows observed keys only.`, `count[${event.label} - min] += 1`)
      else if (event.kind === 'prefix') this.record(event, 3, 'Compute its starting output position', `Entries with key ${event.label} begin at output index ${event.amount}. Prefix totals include unshown zero-frequency keys.`, `next[${event.label} - min] = ${event.amount}`)
      else if (event.kind === 'distribute') this.record(event, 3, 'Place an entry in stable output', `Copy key ${event.label} from index ${event.index} to output index ${event.other}, then advance that key’s next position.`, `output[${event.other}] = array[${event.index}]\nnext[key - min] += 1`)
      else this.record(event, 4, 'Copy the output back', 'The complete output is sorted. Copy entries back into the existing fixed allocation without changing its length.', 'array[:] = output[:]')
    })
    if (accepted) this.finish(true)
    else this.add(5, 'Array unchanged', rejection, 'return array // unchanged', this.layout.create(this.result.getEntries(), this.baseFrame))
  }
}
