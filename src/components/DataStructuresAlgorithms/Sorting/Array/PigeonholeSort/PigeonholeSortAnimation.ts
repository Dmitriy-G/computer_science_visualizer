import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'

export class PigeonholeSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Pigeonhole Sort', 'Put whole entries in one hole per possible integer key, then gather holes in key order with stable ties.', size,
      ['O(n + k)', 'O(n + k)', 'O(n + k)'],
      'Accepted inputs require n entries and k = max - min + 1 holes, so all input orders take O(n + k). No distribution assumption is needed. Ranges wider than 4,096 possible keys are rejected unchanged after an O(n) scan, before hole allocation. Empty and singleton inputs take O(1).',
      'O(n + k)', 'The hole array uses O(k) list headers; lists retain n whole entries and stable output uses n references. Total auxiliary storage is O(n + k). Negative and extreme safe values use exact offset arithmetic. Unlike Counting Sort, this variant groups complete entries without count-prefix placement.',
      [{ symbol: 'k', meaning: `Inclusive key range max - min + 1, limited to ${FixedArray.maximumPigeonholeRange} holes.` }])
  }

  constructor(model: FixedArray) {
    super(model, 'Pigeonhole Sort', { counterHint: 'One pigeonhole per integer key; full records preserve IDs and stable ties.' })
    let rejection = ''
    const accepted = this.result.pigeonholeSort((event) => {
      if (event.kind === 'reject') rejection = event.detail!
      this.recordTrace(event)
    })
    if (accepted) this.finish(true)
    else this.add(5, 'Array unchanged', rejection, 'return array // unchanged', this.layout.create(this.result.getEntries(), this.baseFrame))
    this.fitScenes()
  }
}
