import type { StructureDefinition } from './StructureCatalog.ts'

export class ProbabilisticStructureDefinitions {
  public static readonly structures: readonly StructureDefinition[] = [
    { kind: 'counting-bloom-filter', group: 'probabilistic', name: 'Counting Bloom Filter', description: 'Four-bit counters with guarded deletion and approximate membership', symbol: 'C+' },
    { kind: 'cuckoo-filter', group: 'probabilistic', name: 'Cuckoo Filter', description: 'Fingerprint buckets with alternate locations and transactional relocation', symbol: 'CF' },
    { kind: 'quotient-filter', group: 'probabilistic', name: 'Quotient Filter', description: 'Packed remainder runs with occupied, continuation, and shifted bits', symbol: 'QF' },
    { kind: 'count-min-sketch', group: 'probabilistic', name: 'Count-Min Sketch', description: 'Positive weighted frequency updates and minimum-of-rows estimates', symbol: 'CMS' },
    { kind: 'hyperloglog', group: 'probabilistic', name: 'HyperLogLog', description: 'Register maxima and harmonic estimates of distinct count', symbol: 'HLL' },
    { kind: 'reservoir-sampling-buffer', group: 'probabilistic', name: 'Reservoir Sampling Buffer', description: 'A reproducible Algorithm R sample of stream occurrences', symbol: 'R' },
  ]
}
