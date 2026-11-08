import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { ExclusiveLoopAnimation } from './ExclusiveLoopAnimation.ts'

export class ExclusiveLoopOverview {
  public static describe(): SystemOverviewInformation {
    const information = ExclusiveLoopAnimation.describe()
    return {
      name: information.name,
      summary: 'An Arm read-modify-write sequence that uses exclusive monitors to detect interference and retry an update.',
      problem: 'Separate loads and stores can lose concurrent updates. An exclusive store succeeds only when its exclusive condition permits the write, so a failed attempt can retry using a fresh value.',
      steps: [
        'Use LDXR to load the current counter and establish an exclusive-monitor condition.',
        'Compute the replacement value locally.',
        'Attempt STXR with the new value.',
        'If another write invalidated the condition, STXR returns failure without changing memory; exclusive stores can also fail for other reasons.',
        'On failure, reload with LDXR, recompute from the fresh value, and retry.',
        'On success, accept the update; use the required ordered variants or barriers when also synchronizing other data.',
      ],
      realWorldUsage: information.realWorldUsage,
    }
  }
}
