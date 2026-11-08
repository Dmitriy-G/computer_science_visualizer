import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { StoreBufferingAnimation } from './StoreBufferingAnimation.ts'

export class StoreBufferingOverview {
  public static describe(): SystemOverviewInformation {
    const information = StoreBufferingAnimation.describe()
    return {
      name: information.name,
      summary: 'A per-core queue that holds pending stores while the processor continues with other work.',
      problem: 'Waiting for every store to become visible would stall the core. Store buffering hides that wait, but different cores can observe loads and stores in an order that requires explicit synchronization.',
      steps: [
        'Start two cores with separate store buffers and shared locations x and y set to zero.',
        'Each core issues a store to its own location; the write enters its local buffer.',
        'A same-address load can obtain its value from the local pending store.',
        'Each core loads the other location before its own buffered store has become visible.',
        'Both loads can therefore return zero in this example.',
        'Drain each buffer into coherent shared memory; this does not change values already loaded.',
        'Compare the permitted instruction and buffer-drain interleavings to see which register outcomes are possible.',
      ],
      realWorldUsage: information.realWorldUsage,
    }
  }
}
