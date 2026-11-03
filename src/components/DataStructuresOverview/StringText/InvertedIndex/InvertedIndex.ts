import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram, DiagramItem } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class InvertedIndex extends AppliedModel {
  public readonly kind = 'inverted-index'
  public readonly representation = 'A term dictionary maps lowercase words to sorted unique document-ID postings. AND queries intersect postings with two pointers. This text GIN teaching subset stores whole documents and postings in memory, without PostgreSQL pages, pending lists, stemming, or phrase positions.'
  public readonly countLabel = 'documents'
  private documents = new Map<number, string>()
  private postings = new Map<string, number[]>()
  public get length(): number { return this.documents.size }
  public static words(text: unknown): string[] {
    if (typeof text !== 'string' || !/^[a-z]+(?: [a-z]+)*$/.test(text) || text.length > 128) throw new TypeError('Enter 1 to 128 lowercase letters and single spaces between words')
    return [...new Set(text.split(' '))]
  }
  public static createDefault(): InvertedIndex {
    const model = new InvertedIndex()
    const texts = ['red tree', 'blue graph', 'red graph', 'green tree', 'blue array', 'red array tree', 'green graph', 'blue tree', 'array graph', 'red green']
    for (let index = 0; index < texts.length; index += 1) model.execute('insert', { index: index + 1, text: texts[index] })
    return model
  }
  public clone(): InvertedIndex {
    const copy = new InvertedIndex()
    copy.documents = new Map(this.documents)
    for (const [term, ids] of this.postings) copy.postings.set(term, [...ids])
    return copy
  }
  public getDiagram(): AppliedDiagram {
    const terms: DiagramItem[] = []
    const rows: DiagramItem[][] = [terms]
    for (const term of [...this.postings.keys()].sort()) {
      const ids = this.postings.get(term)!
      terms.push({ id: `gin-term-${term}`, text: term, label: `${ids.length} document IDs`, children: ids.map((id) => `gin-post-${term}-${id}`) })
      rows.push(ids.map((id) => ({ id: `gin-post-${term}-${id}`, text: String(id), label: `${term} / document ${id}` })))
    }
    rows.push([...this.documents].sort((a, b) => a[0] - b[0]).map(([id, text]) => ({ id: `gin-doc-${id}`, text, label: `document ${id}` })))
    return { rows }
  }
  private remove(id: number): void {
    const previous = this.documents.get(id)
    if (previous === undefined) return
    for (const term of InvertedIndex.words(previous)) {
      const postings = this.postings.get(term)!.filter((candidate) => candidate !== id)
      if (postings.length) this.postings.set(term, postings)
      else this.postings.delete(term)
    }
    this.documents.delete(id)
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      this.documents.clear()
      this.postings.clear()
      return { description: 'Released documents, terms, and postings.' }
    }
    if (action === 'search-text') {
      const terms = InvertedIndex.words(input.text)
      let candidates: number[] | null = null
      for (const term of terms) {
        const postings = this.postings.get(term)
        if (!postings) return { description: `No documents match: term ${term} is absent.`, value: [], status: 'ABSENT' }
        LinearModel.emit(observer, `gin-term-${term}`, `Read the sorted postings for ${term}.`, 'lookup term dictionary')
        if (candidates === null) candidates = [...postings]
        else {
          const intersection: number[] = []
          let first = 0
          let second = 0
          while (first < candidates.length && second < postings.length) {
            LinearModel.emit(observer, `gin-post-${term}-${postings[second]}`, `Compare document IDs ${candidates[first]} and ${postings[second]}.`, 'advance smaller ID; emit equal IDs')
            if (candidates[first] === postings[second]) {
              intersection.push(candidates[first])
              first += 1
              second += 1
            } else if (candidates[first] < postings[second]) first += 1
            else second += 1
          }
          candidates = intersection
        }
      }
      return { description: `Documents containing every query term: [${candidates?.join(', ') ?? ''}].`, value: candidates ?? [], status: candidates?.length ? 'FOUND' : 'ABSENT' }
    }
    const id = AppliedModel.bounded(input, 'index', 0, 4095)
    if (action === 'delete-value') {
      if (this.documents.has(id)) LinearModel.emit(observer, `gin-doc-${id}`, `Remove document ${id} from each of its term postings.`, 'remove document ID; drop empty term lists')
      this.remove(id)
      return { description: `Document ${id} and its postings are absent.` }
    }
    if (action !== 'insert') throw new RangeError('Unsupported inverted-index action')
    const terms = InvertedIndex.words(input.text)
    if (!this.documents.has(id) && this.length === 32) return this.reject('At most 32 documents are supported.')
    const vocabulary = new Set<string>()
    for (const [term, ids] of this.postings) {
      if (ids.some((candidate) => candidate !== id)) vocabulary.add(term)
    }
    for (const term of terms) vocabulary.add(term)
    if (vocabulary.size > 64) return this.reject('At most 64 distinct terms are supported; the old document is unchanged.')
    this.remove(id)
    this.documents.set(id, String(input.text))
    for (const term of terms) {
      const postings = [...(this.postings.get(term) ?? []), id].sort((a, b) => a - b)
      this.postings.set(term, postings)
      LinearModel.emit(observer, `gin-post-${term}-${id}`, `Index document ${id} under term ${term}.`, 'insert document ID into sorted unique postings', 'NEW')
    }
    return { description: `Stored document ${id} with ${terms.length} distinct terms.`, activeId: `gin-doc-${id}` }
  }
}
