import type { ActionChoice } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'

export class ProbabilisticActionCatalog {
  public static getActions(kind: StructureKind): readonly ActionChoice[] | null {
    switch (kind) {
      case 'counting-bloom-filter': return [
        { kind: 'insert', title: 'Add a value', description: 'Increment three hashed counters; reject overflow before any counter changes.' },
        { kind: 'search-value', title: 'Check membership', description: 'A zero counter proves absence; all positive counters mean possibly present.' },
        { kind: 'delete-value', title: 'Remove a recorded value', description: 'Use the insertion ledger to guard deletion, then decrement all hash contributions.' },
        { kind: 'clear', title: 'Clear', description: 'Reset counters and the exact deletion guard.' },
      ]
      case 'cuckoo-filter': return [
        { kind: 'insert', title: 'Add a value', description: 'Find a path to an empty fingerprint slot, then relocate residents backward along it.' },
        { kind: 'search-value', title: 'Check membership', description: 'Compare the fingerprint in its two candidate buckets.' },
        { kind: 'delete-value', title: 'Remove a recorded value', description: 'Validate a recorded insertion before removing one matching fingerprint.' },
        { kind: 'clear', title: 'Clear', description: 'Empty all fingerprint slots and the deletion guard.' },
      ]
      case 'quotient-filter': return [
        { kind: 'insert', title: 'Add a value', description: 'Rebuild sorted packed fingerprint runs and publish their O/C/S metadata atomically.' },
        { kind: 'search-value', title: 'Check membership', description: 'Walk cluster metadata to the quotient run and compare sorted remainders.' },
        { kind: 'clear', title: 'Clear', description: 'Discard all remainders and metadata.' },
      ]
      case 'count-min-sketch': return [
        { kind: 'insert', title: 'Add weighted occurrence', description: 'Increment one seeded counter per row by a positive weight.' },
        { kind: 'search-value', title: 'Estimate frequency', description: 'Read one counter in each row and return their minimum.' },
        { kind: 'clear', title: 'Clear', description: 'Reset every sketch counter and the total weight.' },
      ]
      case 'hyperloglog': return [
        { kind: 'insert', title: 'Add a value', description: 'Hash a value, compute its leading-zero rank, and retain the register maximum.' },
        { kind: 'estimate-cardinality', title: 'Estimate distinct count', description: 'Combine register maxima with small-range linear counting when applicable.' },
        { kind: 'clear', title: 'Clear', description: 'Reset register maxima and the add-operation counter.' },
      ]
      case 'reservoir-sampling-buffer': return [
        { kind: 'insert', title: 'Observe a stream value', description: 'Fill five slots, then replace a sampled slot or skip the incoming occurrence.' },
        { kind: 'inspect-storage', title: 'Inspect sample', description: 'Visit retained occurrences and show their original arrival positions.' },
        { kind: 'clear', title: 'Clear', description: 'Empty the reservoir and restart the seeded experiment.' },
      ]
      default: return null
    }
  }
}
