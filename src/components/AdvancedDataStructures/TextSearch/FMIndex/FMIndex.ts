import { StringTextModel } from '../StringTextModel.ts'
import { SuffixOrder } from '../SuffixOrder.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export class FMIndex extends StringTextModel {
  public readonly kind = 'fm-index' as const
  private sourceLength = 0
  private bwt = ''
  private cumulative = new Map<string, number>()
  private occurrences = new Map<string, number[]>()
  private samples = new Map<number, number>()
  private constructionText = ''

  public get length(): number { return this.sourceLength }
  public get transform(): string { return this.bwt }
  public get constructionSource(): string { return this.constructionText }
  public getCumulative(): ReadonlyMap<string, number> { return new Map(this.cumulative) }
  public getOccurrences(): ReadonlyMap<string, readonly number[]> {
    const copy = new Map<string, readonly number[]>()
    for (const [character, counts] of this.occurrences) copy.set(character, [...counts])
    return copy
  }
  public getSamples(): ReadonlyMap<number, number> { return new Map(this.samples) }

  public static createDefault(): FMIndex {
    const model = new FMIndex()
    model.execute('build-text', { text: this.defaultText })
    return model
  }

  public clone(): FMIndex {
    const copy = new FMIndex()
    copy.sourceLength = this.sourceLength
    copy.bwt = this.bwt
    copy.cumulative = new Map(this.cumulative)
    copy.samples = new Map(this.samples)
    copy.constructionText = this.constructionText
    for (const [character, counts] of this.occurrences) copy.occurrences.set(character, [...counts])
    return copy
  }

  public lf(row: number): number {
    if (!Number.isInteger(row) || row < 0 || row >= this.bwt.length) throw new RangeError('BWT row is outside the index')
    const character = this.bwt[row]
    return this.cumulative.get(character)! + this.occurrences.get(character)![row]
  }

  private locate(row: number, observer?: LinearObserver): number {
    let position = row
    let steps = 0
    while (!this.samples.has(position)) {
      const next = this.lf(position)
      FMIndex.emit(observer, `bwt-${position}`, `LF maps row ${position} to ${next}; move one character backward in the source.`, 'row = C[BWT[row]] + Occ(BWT[row], row); steps += 1')
      position = next
      steps += 1
    }
    const result = (this.samples.get(position)! + steps) % this.bwt.length
    FMIndex.emit(observer, `bwt-${position}`, `Sample SA = ${this.samples.get(position)} plus ${steps} LF step(s) gives source position ${result}.`, 'position = (sample[row] + steps) mod indexLength', 'MATCH')
    return result
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      this.bwt = ''
      this.sourceLength = 0
      this.cumulative.clear()
      this.occurrences.clear()
      this.samples.clear()
      this.constructionText = ''
      FMIndex.emit(observer, null, 'Release BWT, cumulative counts, occurrence columns, and sampled positions.', 'clear BWT, C, Occ, sampledSA')
      return { description: 'The FM-Index is empty.' }
    }
    if (action === 'build-text') {
      const source = FMIndex.letters(input, 'text')
      const text = source + '$'
      this.bwt = ''
      this.sourceLength = 0
      this.cumulative.clear()
      this.occurrences.clear()
      this.samples.clear()
      this.constructionText = text
      FMIndex.emit(observer, 'fm-source', 'Prepare temporary source text and suffix ordering; the previous index is being replaced on the playback clone.', 'temporary source = text + $')
      const order = SuffixOrder.create(text, (left, right) => FMIndex.emit(observer, null, `Compare suffix starts ${left} and ${right} for temporary suffix ordering.`, 'mergeSort suffix starts (temporary construction storage)'))
      const lastColumn: string[] = []
      const frequencies = new Map<string, number>()
      const samples = new Map<number, number>()
      for (let row = 0; row < order.length; row += 1) {
        const character = text[(order[row] + text.length - 1) % text.length]
        lastColumn.push(character)
        frequencies.set(character, (frequencies.get(character) ?? 0) + 1)
        if (order[row] % 4 === 0) samples.set(row, order[row])
      }
      const bwt = lastColumn.join('')
      const cumulative = new Map<string, number>()
      const occurrences = new Map<string, number[]>()
      let total = 0
      for (const character of [...frequencies.keys()].sort()) {
        cumulative.set(character, total)
        total += frequencies.get(character)!
        const counts = [0]
        for (let row = 0; row < bwt.length; row += 1) counts.push(counts[row] + (bwt[row] === character ? 1 : 0))
        occurrences.set(character, counts)
      }
      this.sourceLength = source.length
      this.bwt = bwt
      this.cumulative = cumulative
      this.occurrences = occurrences
      this.samples = samples
      this.constructionText = ''
      for (let row = 0; row < bwt.length; row += 1) FMIndex.emit(observer, `bwt-${row}`, `BWT[${row}] = ${bwt[row]}${samples.has(row) ? `; sample SA = ${samples.get(row)}` : '; suffix position is not stored'}.`, 'BWT[row] = text[(SA[row] - 1) mod N]; sample when SA[row] mod 4 == 0', 'NEW')
      return { description: `Built BWT, C, dense prefix Occ, and ${samples.size} sampled suffix positions. The source and full suffix array are temporary and are not retained; dense Occ is an educational, uncompressed rank table.` }
    }
    if (action !== 'search-value') throw new RangeError('Unsupported FM-Index operation')
    const pattern = FMIndex.letters(input, 'pattern')
    let first = 0
    let last = this.bwt.length
    for (let index = pattern.length - 1; index >= 0 && first < last; index -= 1) {
      const character = pattern[index]
      const cumulative = this.cumulative.get(character)
      if (cumulative === undefined) { first = 0; last = 0; break }
      const counts = this.occurrences.get(character)!
      first = cumulative + counts[first]
      last = cumulative + counts[last]
      FMIndex.emit(observer, first < last ? `bwt-${first}` : null, `Prepend ${character}: matching suffix rows are [${first}, ${last}).`, 'l = C[c] + Occ(c, l); r = C[c] + Occ(c, r)')
    }
    const positions: number[] = []
    for (let row = first; row < last; row += 1) positions.push(this.locate(row, observer))
    return { description: `${positions.length} occurrence(s) of ${pattern}; zero-based positions in suffix order: ${positions.join(', ') || 'none'}.`, value: positions }
  }
}
