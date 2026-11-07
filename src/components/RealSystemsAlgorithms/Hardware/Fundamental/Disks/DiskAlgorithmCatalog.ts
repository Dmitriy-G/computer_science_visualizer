import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import type { DiskAlgorithmKind, DiskWorkload } from './DiskWorkload.ts'
import { MqDeadlineAnimation } from './MqDeadline/MqDeadlineAnimation.ts'
import { BFQAnimation } from './BFQ/BFQAnimation.ts'
import { KyberAnimation } from './Kyber/KyberAnimation.ts'

export interface DiskAlgorithmChoice {
  readonly kind: DiskAlgorithmKind
  readonly name: string
  readonly description: string
}

export class DiskAlgorithmCatalog {
  public static readonly choices: readonly DiskAlgorithmChoice[] = [
    { kind: 'bfq', name: 'BFQ', description: 'Share disk service using weighted process budgets.' },
    { kind: 'kyber', name: 'Kyber', description: 'Control outstanding requests using latency feedback.' },
    { kind: 'mq-deadline', name: 'mq-deadline', description: 'Combine sector batches, soft expiry, and read/write fairness.' },
  ]

  public static definition(kind: DiskAlgorithmKind): ActionDefinition<DiskWorkload> {
    switch (kind) {
      case 'mq-deadline': return new MqDeadlineAnimation()
      case 'bfq': return new BFQAnimation()
      case 'kyber': return new KyberAnimation()
    }
  }

  public static describe(kind: DiskAlgorithmKind): AlgorithmInformation {
    switch (kind) {
      case 'mq-deadline': return MqDeadlineAnimation.describe()
      case 'bfq': return BFQAnimation.describe()
      case 'kyber': return KyberAnimation.describe()
    }
  }
}
