import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../FixedArray.ts'

export class RadixSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Radix Sort', 'Use stable least-significant-digit decimal passes on exact nonnegative keys value - min. Gather the ten digit buckets in order after every pass.', size,
      ['O(d(n + b))', 'O(d(n + b))', 'O(d(n + b))'],
      'Every order performs d stable distribution and collection passes over n entries and b buckets. No distribution assumption is needed. Here b = 10 and d is at most 17 for safe-integer input; an all-equal nontrivial array still has one pass. Empty and singleton arrays finish in O(1).',
      'O(n + b)', 'Ten bucket arrays hold n entry references in total. Exact BigInt normalization supports negative values and the full safe-integer span without precision loss.',
      [{ symbol: 'd', meaning: 'Number of decimal digit passes of max - min, at least one for a nontrivial array.' }, { symbol: 'b', meaning: 'Radix: ten buckets for decimal digits 0 through 9.' }])
  }

  constructor(model: FixedArray) {
    super(model, 'Radix Sort', { distribution: true })
    this.result.radixSort((event) => {
      if (event.kind === 'digit') this.record(event, 2, 'Choose a digit place', event.detail!, `place = ${event.label}\ndigit = ((value - min) / place) % 10`)
      else if (event.kind === 'distribute') this.record(event, 3, 'Append to the digit bucket', `Read ${this.result.getAt(event.index).value} at index ${event.index} and append it to digit bucket ${event.other} for place ${event.label}. Arrival order is preserved.`, `bucket[${event.other}].append(array[${event.index}])`)
      else this.record(event, 4, 'Gather digit buckets', `Gather buckets zero through nine for place ${event.label}. Lower processed digits stay ordered; continue with the next higher place if needed.`, 'copy buckets 0..9 back into array\nplace *= 10')
    })
    this.finish(true)
  }
}
