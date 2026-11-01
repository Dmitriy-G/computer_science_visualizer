import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../FixedArray.ts'

export class BucketSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Bucket Sort', 'Distribute safe integers into n equal-width buckets, stably insertion-sort each bucket, then concatenate buckets in key order.', size,
      ['O(n + b)', 'O(n + b)', 'O(n² + b)'],
      'Best: bucket contents need little insertion work. Average assumes independent uniformly distributed keys across b buckets with b = n. Worst: a reverse-ordered cluster falls into one bucket and needs quadratic insertion work. Empty and singleton arrays take O(1) time.',
      'O(n + b)', 'b bucket arrays store n entry references. Buckets are sorted by stable adjacent exchanges, then copied back. BigInt scaling handles negative values and the full safe-integer span exactly.',
      [{ symbol: 'b', meaning: 'Number of equal-width buckets: b = n for a nontrivial array.' }])
  }

  constructor(model: FixedArray) {
    super(model, 'Bucket Sort', { distribution: true })
    this.result.bucketSort((event) => {
      if (event.kind === 'bounds') this.record(event, 2, 'Create equal-width buckets', event.detail!, `bucket = floor((value - min) * ${event.amount} / (max - min + 1))`)
      else if (event.kind === 'distribute') this.record(event, 2, 'Distribute into a bucket', `Append ${this.result.getAt(event.index).value} from index ${event.index} to bucket ${event.other}. Buckets preserve arrival order.`, `bucket[${event.other}].append(array[${event.index}])`)
      else if (event.kind === 'bucket-sort') this.record(event, 3, 'Sort one bucket', `Insertion-sort bucket ${event.index}. Empty and singleton buckets need no comparisons.`, `insertionSort(bucket[${event.index}])`)
      else if (event.kind === 'compare') this.record(event, 3, 'Compare within the bucket', `Compare ${event.label} in bucket ${event.amount}. Swap only if the left value is larger.`, `if bucket[${event.amount}][${event.index}] > bucket[${event.amount}][${event.other}]: swap`)
      else if (event.kind === 'swap') this.record(event, 3, 'Exchange adjacent bucket entries', `Swap positions ${event.index} and ${event.other} inside bucket ${event.amount}. Equal entries are never swapped.`, `swap(bucket[${event.amount}][${event.index}], bucket[${event.amount}][${event.other}])`)
      else this.record(event, 4, 'Concatenate the sorted buckets', 'Read buckets from lowest to highest and copy their entries into the original fixed allocation. The result is globally sorted.', 'array[:] = concatenate(buckets)')
    })
    this.finish(true)
  }
}
