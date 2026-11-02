import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'

export class BurstsortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Burstsort', 'Encode integer keys as equal-width hexadecimal strings, burst overflowing prefix containers into a trie, and sort leaf suffixes.', size,
      ['O(nd)', 'O(nd)', 'O(nd)'],
      'This integer adaptation creates n order-preserving strings of d digits. Each record follows at most d prefix levels; containers burst after three records. Nonterminal leaves have at most three records, while full-key equal containers stop without comparison sorting. Key creation, trie distribution, and bounded suffix sorting take O(nd) for every distribution. Empty and singleton inputs take O(1).',
      'O(nd)', 'Encoded keys, trie nodes, container references, and output use O(nd) auxiliary storage. Trie nodes store one digit and parent link; full prefixes are only built for playback snapshots. Stable redistribution and suffix exchanges preserve ties. This is a teaching adaptation of string Burstsort; it does not promise the cache behavior of optimized implementations.',
      [{ symbol: 'd', meaning: 'Number of equal-width hexadecimal digits in max - min, at least one and at most 14 for safe integer keys.' }])
  }

  constructor(model: FixedArray) {
    super(model, 'Burstsort', { counterHint: 'Integer Burstsort adaptation: order-preserving hexadecimal keys and prefix containers.' })
    this.result.burstSort((event) => this.recordTrace(event))
    this.finish(true)
    this.fitScenes()
  }
}
