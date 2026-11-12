import { ArraySortOperations } from './ArraySortOperations.ts'
import type { ArrayEntry } from '../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import type { ArraySortEvent, ArraySortFrame } from './ArraySortTrace.ts'

export class SampleArraySort extends ArraySortOperations {
  private readonly samples: ArrayEntry[] = []
  private readonly splitters: ArrayEntry[] = []
  private readonly buckets: ArrayEntry[][] = []
  private output: (ArrayEntry | null)[] | undefined

  public sort(): void {
    const length = this.entries.length
    if (length < 2) return
    const bucketCount = Math.min(4, Math.max(2, Math.floor(Math.sqrt(length))))
    const sampleCount = Math.min(length, 2 * bucketCount - 1)
    for (let index = 0; index < sampleCount; index += 1) {
      const source = Math.floor((index + 1) * length / (sampleCount + 1))
      this.samples.push(this.entries[source])
      this.step('select', 'Select a regular sample', `Copy key ${this.entries[source].value} from index ${source} into the sample. Positions are evenly spaced, so playback is deterministic.`, `sample.push(array[${source}])`, { activeIndices: [source], activeSampleIndices: [index] }, source)
    }
    this.mergeSort(this.samples, -1)
    for (let index = 1; index < bucketCount; index += 1) {
      const rank = Math.floor(index * sampleCount / bucketCount)
      this.splitters.push(this.samples[rank])
      this.step('select', 'Choose a sample quantile as a splitter', `Sample index ${rank}, key ${this.samples[rank].value}, separates two bucket ranges. Equal splitter values are allowed.`, `splitter[${index - 1}] = sample[${rank}]`, { activeSampleIndices: [rank], activeSplitter: index - 1 }, rank)
    }
    for (let bucket = 0; bucket < bucketCount; bucket += 1) this.buckets.push([])
    for (let index = 0; index < length; index += 1) {
      let low = 0
      let high = this.splitters.length
      while (low < high) {
        const middle = low + Math.floor((high - low) / 2)
        this.step('compare', 'Compare a key with a splitter', `Compare key ${this.entries[index].value} with splitter ${this.splitters[middle].value}. Equal keys go to the bucket on the right.`, 'bucket = upperBound(splitters, key)', { activeIndices: [index], activeSplitter: middle }, index, middle)
        if (this.entries[index].value < this.splitters[middle].value) high = middle
        else low = middle + 1
      }
      this.buckets[low].push(this.entries[index])
      this.step('distribute', 'Distribute into the selected bucket', `Append key ${this.entries[index].value} to bucket ${low}, preserving arrival order within the bucket.`, `buckets[${low}].push(array[${index}])`, { activeIndices: [index], activeBucket: low, activeBucketIndices: [this.buckets[low].length - 1], bucketStatus: 'APPEND' }, index, low)
    }
    for (let bucket = 0; bucket < bucketCount; bucket += 1) {
      this.step('bucket-sort', 'Sort one sample bucket', `Stably merge-sort bucket ${bucket}, containing ${this.buckets[bucket].length} entries. Even a severely unbalanced distribution terminates without repartitioning.`, `mergeSort(bucket[${bucket}])`, {}, bucket)
      this.mergeSort(this.buckets[bucket], bucket)
    }
    this.output = new Array<ArrayEntry | null>(length).fill(null)
    let destination = 0
    for (let bucket = 0; bucket < bucketCount; bucket += 1) {
      for (let index = 0; index < this.buckets[bucket].length; index += 1) {
        this.output[destination] = this.buckets[bucket][index]
        this.step('write', 'Concatenate the ordered buckets', `Copy key ${this.output[destination]!.value} from bucket ${bucket} to output index ${destination}. Splitter order guarantees that earlier buckets precede later ones.`, `output[${destination}] = bucket[${bucket}][${index}]`, { activeBucket: bucket, activeBucketIndices: [index], bucketStatus: 'READ' }, destination)
        destination += 1
      }
    }
    for (let index = 0; index < length; index += 1) this.entries[index] = this.output[index]!
    this.emit('gather', 'Copy the sample-sort output back', 'The buckets have been concatenated in ascending order. Copy output into the existing fixed allocation, preserving equal-key order and entry IDs.', 'array[:] = output[:]', { sortedPrefix: length })
  }

  private mergeSort(values: ArrayEntry[], bucket: number): void {
    const work = new Array<ArrayEntry>(values.length)
    for (let width = 1; width < values.length; width *= 2) {
      for (let start = 0; start + width < values.length; start += 2 * width) {
        const middle = start + width
        const end = Math.min(values.length, start + 2 * width)
        let first = start
        let second = middle
        for (let destination = start; destination < end; destination += 1) {
          if (first < middle && second < end) {
            this.step('compare', bucket < 0 ? 'Compare sample merge heads' : 'Compare bucket merge heads', `Compare keys ${values[first].value} and ${values[second].value}. Take the left head on equality to retain stable order.`, 'take left if left <= right', bucket < 0 ? { activeSampleIndices: [first, second] } : { activeBucket: bucket, activeBucketIndices: [first, second] }, first, second)
          }
          const source = second === end || first < middle && values[first].value <= values[second].value ? first++ : second++
          work[destination] = values[source]
        }
        for (let index = start; index < end; index += 1) values[index] = work[index]
        this.step('merge', bucket < 0 ? 'Sample pieces merged' : 'Bucket pieces merged', `The local range [${start}, ${end}) is merged stably through a temporary buffer.`, `copy merged range [${start}, ${end}) back`, {}, start)
      }
    }
  }

  private step(kind: ArraySortEvent['kind'], label: string, detail: string, code: string, frame: ArraySortFrame, index: number, other?: number): void {
    if (!this.observer) return
    const buckets: ArrayEntry[][] = []
    for (const bucket of this.buckets) buckets.push([...bucket])
    this.emit(kind, label, detail, code, { samples: [...this.samples], splitters: [...this.splitters], buckets, output: this.output ? [...this.output] : undefined, ...frame }, index, other)
  }
}
