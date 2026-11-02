import { StringTextModel } from '../StringTextModel.ts'
import { SuffixOrder } from '../SuffixOrder.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export class SuffixArray extends StringTextModel {
  public readonly kind = 'suffix-array' as const
  private text = ''
  private suffixes: number[] = []
  private lcp: number[] = []

  public get length(): number { return this.text.length }
  public get source(): string { return this.text }
  public getSuffixes(): readonly number[] { return [...this.suffixes] }
  public getLCP(): readonly number[] { return [...this.lcp] }
  public get indexedText(): string { return this.text ? this.text + '$' : '' }

  public static createDefault(): SuffixArray {
    const model = new SuffixArray()
    model.execute('build-text', { text: this.defaultText })
    return model
  }

  public clone(): SuffixArray {
    const copy = new SuffixArray()
    copy.text = this.text
    copy.suffixes = [...this.suffixes]
    copy.lcp = [...this.lcp]
    return copy
  }

  private comparePattern(start: number, pattern: string): number {
    for (let offset = 0; offset < pattern.length; offset += 1) {
      const character = start + offset === this.text.length ? '$' : this.text[start + offset]
      if (character === undefined) return -1
      if (character !== pattern[offset]) return character < pattern[offset] ? -1 : 1
    }
    return 0
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      this.text = ''
      this.suffixes = []
      this.lcp = []
      SuffixArray.emit(observer, null, 'Release source text, suffix positions, and LCP values.', 'text = empty; SA = []; LCP = []')
      return { description: 'The suffix array is empty.' }
    }
    if (action === 'build-text') {
      const text = SuffixArray.letters(input, 'text')
      const indexed = text + '$'
      this.text = text
      this.suffixes = []
      this.lcp = []
      SuffixArray.emit(observer, 'sa-source', 'Prepare the replacement source and its unique terminator before ordering suffix positions.', 'source = text + $; begin a fresh suffix-order workspace')
      const order = SuffixOrder.create(indexed, (left, right, comparison) => {
        SuffixArray.emit(observer, null, `Compare suffixes at ${left} and ${right}: ${comparison < 0 ? 'left first' : 'right first'}.`, 'merge sorted runs by comparing source suffix ranges')
      })
      this.suffixes = order
      this.lcp = new Array<number>(order.length).fill(0)
      SuffixArray.emit(observer, 'sa-0', 'Publish the sorted suffix positions; compute adjacent longest common prefixes.', 'SA = mergeSort(suffix starts); LCP[0] = 0')
      for (let rank = 1; rank < order.length; rank += 1) {
        let common = 0
        while (indexed[order[rank - 1] + common] !== undefined && indexed[order[rank - 1] + common] === indexed[order[rank] + common]) common += 1
        this.lcp[rank] = common
        SuffixArray.emit(observer, `sa-${rank}`, `Rank ${rank} stores suffix ${order[rank]} with adjacent LCP ${common}.`, 'LCP[rank] = commonPrefix(SA[rank - 1], SA[rank])', 'NEW')
      }
      return { description: `Indexed ${text.length} source characters plus a unique $ terminator. Construction uses comparison merge sort and direct adjacent LCP scans.` }
    }
    if (action !== 'search-value') throw new RangeError('Unsupported suffix-array operation')
    const pattern = SuffixArray.letters(input, 'pattern')
    const bound = (upper: boolean): number => {
      let low = 0
      let high = this.suffixes.length
      while (low < high) {
        const middle = Math.floor((low + high) / 2)
        const comparison = this.comparePattern(this.suffixes[middle], pattern)
        SuffixArray.emit(observer, `sa-${middle}`, `${upper ? 'Upper' : 'Lower'} bound: compare ${pattern} at rank ${middle}, suffix ${this.suffixes[middle]}.`, 'if suffix < pattern (or equal for upper bound): low = mid + 1; else high = mid')
        if (comparison < 0 || upper && comparison === 0) low = middle + 1
        else high = middle
      }
      return low
    }
    const first = bound(false)
    const last = bound(true)
    const positions = this.suffixes.slice(first, last)
    for (let rank = first; rank < last; rank += 1) SuffixArray.emit(observer, `sa-${rank}`, `Match starts at source index ${this.suffixes[rank]}.`, 'report SA[rank]', 'MATCH')
    return { description: `${positions.length} occurrence(s) of ${pattern}; zero-based positions in suffix order: ${positions.join(', ') || 'none'}.`, value: positions }
  }
}
