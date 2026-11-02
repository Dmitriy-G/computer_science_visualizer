import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'

export class SleepSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Sleep Sort', 'Schedule exact virtual wake-up deadlines in a heap and emit events in deadline order without real waiting.', size,
      ['O(n log n)', 'O(n log n)', 'O(n log n)'],
      'These are O(n log n) upper bounds for the actual event-queue simulation: heap insertion and extraction schedule n virtual wake-ups. They hold for every key distribution. Real Sleep Sort depends on the value range, timer precision, and scheduler behavior; launching n timers does not establish an O(n) correct sort. Virtual time jumps over delays, with no threads or real timers. Empty and singleton inputs take O(1).',
      'O(n)', 'The heap stores n event records and output stores n entry references, requiring O(n) auxiliary memory. BigInt deadlines normalize negatives and extreme safe integers exactly. Original input position breaks equal-deadline ties for stable simulated output.')
  }

  constructor(model: FixedArray) {
    super(model, 'Sleep Sort', { counterHint: 'Simulated Sleep Sort: exact virtual deadlines and an explicit heap; no real delays.' })
    this.result.sleepSort((event) => this.recordTrace(event))
    this.finish(true)
    this.fitScenes()
  }
}
