import type { StructureOverview } from './StructureInformation.ts'

export class ProbabilisticStructureInformation {
  public static readonly overviews = {
    'counting-bloom-filter': {
      summary: 'A Counting Bloom Filter replaces bits with counters so recorded insertions can be removed. This lesson uses 32 four-bit counters and three hashes, rejects overflow, and keeps an extra exact-key ledger solely to guard deletion; membership remains approximate.',
      useCases: [
        { area: 'Mutable membership screens', description: 'Avoid unnecessary exact lookups while allowing known inserted occurrences to be removed.' },
        { area: 'Cache admission checks', description: 'Test possible membership before consulting a more expensive backing index.' },
        { area: 'Expiring sets', description: 'Remove known expired occurrences while retaining shared hash contributions.' },
        { area: 'Collision lessons', description: 'Observe why positive counters are not proof of membership or exact frequency.' },
      ],
      technologies: [
        { name: 'Apache Hadoop bloom utilities', url: 'https://hadoop.apache.org/docs/r2.6.0/api/src-html/org/apache/hadoop/util/bloom/CountingBloomFilter.html', usage: 'The documented Hadoop 2.6 implementation exposes a CountingBloomFilter with four-bit counters and add, membership test, and delete operations. This lesson additionally retains a deletion guard and rejects overflow rather than relying on caller discipline.' },
      ],
    },
    'cuckoo-filter': {
      summary: 'A Cuckoo Filter stores short fingerprints in one of two related buckets and answers approximate membership queries. This fixed-size variant uses deterministic BFS relocation and an extra exact-key deletion guard; its buckets contain no full keys.',
      useCases: [
        { area: 'Mutable membership', description: 'Screen queries with compact fingerprints and support removal of known inserted values.' },
        { area: 'Storage lookups', description: 'Reject definite misses before consulting an exact store.' },
        { area: 'Fingerprint relocation', description: 'Keep a resident reachable after moving it to its alternate bucket.' },
        { area: 'Capacity planning', description: 'Explore insertion failure when no relocation path reaches a free slot.' },
      ],
      technologies: [
        { name: 'Redis Cuckoo filters', url: 'https://redis.io/docs/latest/develop/data-types/probabilistic/cuckoo-filter/', usage: 'Redis provides CF.ADD, CF.EXISTS, and CF.DEL for approximate membership with deletion. Its configurable, expandable implementation differs from this fixed eight-bucket BFS lesson and does not supply this exact-key safety ledger.' },
      ],
    },
    'quotient-filter': {
      summary: 'A Quotient Filter stores hash remainders in sorted circular runs and reconstructs their quotient association using occupied, continuation, and shifted metadata. This lesson rebuilds packed runs on insertion and offers approximate membership without retaining full keys; no production example is verified for this entry.',
      useCases: [
        { area: 'Approximate membership', description: 'Recognize definite misses using a compact quotient/remainder fingerprint.' },
        { area: 'Locality-sensitive storage', description: 'Keep collided fingerprint runs in neighboring physical slots.' },
        { area: 'Compact metadata', description: 'Decode canonical quotients from three metadata bits per slot.' },
        { area: 'Packed index design', description: 'Study circular clusters, sorted runs, and the cost of high occupancy.' },
      ],
      technologies: [],
    },
    'count-min-sketch': {
      summary: 'A Count-Min Sketch uses multiple hashed counter rows to estimate item frequencies without storing the items. This three-row, eight-column version accepts positive weighted updates and uses BigInt counters, so collisions can overestimate but cannot cause underestimation.',
      useCases: [
        { area: 'Event frequencies', description: 'Estimate how often an event occurs using a fixed number of counters.' },
        { area: 'Traffic measurement', description: 'Track approximate per-key packet or request counts.' },
        { area: 'Popularity monitoring', description: 'Estimate the frequency of a supplied candidate without maintaining an exact key dictionary.' },
        { area: 'Weighted streams', description: 'Accumulate positive occurrence weights in bounded counter-array dimensions.' },
      ],
      technologies: [
        { name: 'Redis Count-Min Sketch', url: 'https://redis.io/docs/latest/develop/data-types/probabilistic/count-min-sketch/', usage: 'Redis exposes CMS.INCRBY and CMS.QUERY to estimate stream frequencies. This lesson fixes the dimensions, uses positive weights only, and uses arbitrary-precision counters instead of a production storage format.' },
      ],
    },
    'hyperloglog': {
      summary: 'HyperLogLog estimates distinct cardinality using maxima of hash leading-zero ranks. This classic 16-register lesson combines a harmonic estimator with small-range linear counting; it stores neither the original values nor an exact distinct set.',
      useCases: [
        { area: 'Distinct visitors', description: 'Estimate the number of unique identifiers in an event stream.' },
        { area: 'Analytics cardinalities', description: 'Estimate distinct values while retaining only register maxima.' },
        { area: 'Duplicate-heavy streams', description: 'Observe that repeating a value leaves its register contribution unchanged.' },
        { area: 'Memory/error tradeoffs', description: 'Compare register count with typical estimation error under suitable hashing.' },
      ],
      technologies: [
        { name: 'Redis HyperLogLog', url: 'https://redis.io/docs/latest/develop/data-types/probabilistic/hyperloglogs/', usage: 'Redis provides PFADD and PFCOUNT for approximate distinct counting and PFMERGE for unions. Its production precision and encoding differ from this small classic-HLL lesson; merging is not offered here.' },
      ],
    },
    'reservoir-sampling-buffer': {
      summary: 'A Reservoir Sampling Buffer retains a fixed-size sample of stream occurrences without knowing the stream length in advance. This Algorithm R lesson keeps five occurrences and uses a fixed seeded generator with rejection sampling to make every decision reproducible.',
      useCases: [
        { area: 'Stream inspection', description: 'Retain a small sample while processing arrivals in one pass.' },
        { area: 'Data diagnostics', description: 'Inspect representative occurrences without retaining the complete history.' },
        { area: 'Sampling statistics', description: 'Use equal inclusion probabilities under the ideal uniform-draw assumption.' },
        { area: 'Repeated values', description: 'Sample positions in a stream; equal numeric values remain separate occurrences.' },
      ],
      technologies: [
        { name: 'Apache Spark sampling utilities', url: 'https://github.com/apache/spark/blob/master/core/src/main/scala/org/apache/spark/util/random/SamplingUtils.scala', usage: 'Spark implements reservoirSampleAndCount over iterators, retaining a reservoir while counting inputs. Its XORShift generator and floating-point replacement-index calculation differ from this seeded integer-rejection lesson.' },
      ],
    },
  } satisfies Record<string, StructureOverview>
}
