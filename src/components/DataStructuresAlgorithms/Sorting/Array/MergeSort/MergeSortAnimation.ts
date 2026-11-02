import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'

export class MergeSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Merge Sort', 'Recursively split the range, copy two sorted halves into a shared buffer, and merge them back. Choose the left half on equal values to remain stable.', size,
      ['O(n log n)', 'O(n log n)', 'O(n log n)'],
      'Every nontrivial range is split and merged, with linear copying at each logarithmic level; this variant does not skip already ordered merges. Average assumes uniformly random distinct permutations, but the bound holds for every order. Empty and singleton arrays take O(1) time.',
      'O(n)', 'One shared buffer of n entries plus O(log n) recursive call frames. The original fixed allocation keeps its length; buffer copies are temporary algorithm storage.',
      [{ symbol: 'O(log n)', meaning: 'Logarithmic recursion depth, proportional to the number of times the range can be halved.' }])
  }

  constructor(model: FixedArray) {
    super(model, 'Merge Sort')
    this.result.mergeSort((event) => {
      if (event.kind === 'split') this.record(event, 2, 'Split the range', `Split indices ${event.left}–${event.right} into ${event.left}–${event.middle} and ${event.middle! + 1}–${event.right}. Sort both halves before merging.`, `sort(${event.left}, ${event.middle})\nsort(${event.middle! + 1}, ${event.right})`)
      else if (event.kind === 'buffer') this.record(event, 3, 'Copy the sorted halves to the buffer', `Copy indices ${event.left}–${event.right} to the auxiliary row. Merge them back into the empty output slots above.`, `buffer[${event.left}..${event.right}] = array[${event.left}..${event.right}]`)
      else if (event.kind === 'compare') {
        const entries = event.frame.buffer!
        const first = entries[event.index - event.left!].value
        const second = entries[event.other! - event.left!].value
        this.record(event, 3, 'Compare the two merge heads', `Compare buffered ${first} and ${second}. Take the smaller value; on equality take the left half first.`, `if buffer[${event.index}] <= buffer[${event.other}]: take left\nelse: take right`)
      } else if (event.kind === 'write') this.record(event, 3, 'Write the next merged entry', `Copy ${this.result.getAt(event.index).value} from buffer index ${event.other} to array index ${event.index}. The buffer preserves unread source entries.`, `array[${event.index}] = buffer[${event.other}]`)
      else this.record(event, 4, 'Finish this merge', `Indices ${event.left}–${event.right} now form one sorted run. Release its buffer view before merging the enclosing range.`, `merged range = [${event.left}, ${event.right}]`)
    })
    this.finish(true)
  }
}
