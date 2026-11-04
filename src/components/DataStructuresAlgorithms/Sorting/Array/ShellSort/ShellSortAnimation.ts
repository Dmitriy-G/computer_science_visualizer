import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class ShellSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Shell Sort', 'Perform insertion by exchanges on gap-separated subsequences using Knuth gaps 1, 4, 13, ... in decreasing order, ending at gap one. This variant is unstable.', size,
      ['O(n log n)', 'O(n^(3/2))', 'O(n^(3/2))'],
      'Best: sorted input needs a linear scan per gap across a logarithmic number of Knuth gaps. Average: O(n^(3/2)) is a conservative upper bound for any input distribution, inherited from the proven worst-case bound for Knuth gaps. A tight expected growth rate remains unknown; this is not a claim that the average equals the worst case. Worst-case comparisons and exchanges are O(n^(3/2)). Empty and singleton inputs finish in O(1).',
      'O(1)', 'Only the current gap, indices, and one swap entry. Gapped subsequences share the original fixed allocation.')
  }

  constructor(model: FixedArray) {
    super(model, 'Shell Sort')
    this.result.shellSort((event) => {
      if (event.kind === 'gap') this.record(event, 2, 'Choose the next gap', `Use gap ${event.amount}. Compare and exchange entries that far apart to sort each interleaved subsequence.`, `gap = ${event.amount}`)
      else if (event.kind === 'compare') this.record(event, 2, 'Compare gap-separated entries', `Compare ${this.result.getAt(event.index).value} at ${event.index} with ${this.result.getAt(event.other!).value} at ${event.other}, separated by ${event.amount} slots.`, `if array[${event.index}] > array[${event.other}]: swap`)
      else if (event.kind === 'swap') this.record(event, 3, 'Exchange within the subsequence', `Swap indices ${event.index} and ${event.other}, then continue backward by gap ${event.amount}.`, `swap(array[${event.index}], array[${event.other}])`)
      else this.record(event, 4, 'Finish the gap pass', event.amount === 1 ? 'The gap-one insertion pass leaves the complete array sorted.' : `All gap-${event.amount} subsequences are sorted. Reduce the gap to ${Math.floor(event.amount! / 3)}.`, `gap = floor(${event.amount} / 3)`)
    })
    this.finish(false)
  }
}
