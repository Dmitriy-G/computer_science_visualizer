import type { StructureOverview } from './StructureInformation.ts'

export class HashStructureInformation {
  public static readonly overviews = {
    'open-addressing-hash-table': {
      summary: 'Linear probing, reusable tombstones, and load-triggered rehashing. Records occupy a linear-probed slot array; deletion leaves a tombstone and live load above 0.75 triggers growth.',
      useCases: [
        { area: 'In-memory dictionaries', description: 'Store keys and values directly in a slot array.' },
        { area: 'Compact lookup tables', description: 'Avoid allocating a separate linked node for every collision.' },
        { area: 'Cache-aware storage', description: 'Probe neighboring physical slots when home positions collide.' },
        { area: 'Mutable indexes', description: 'Retain tombstones so deletion preserves later probe reachability.' },
      ],
      technologies: [
        { name: 'MicroPython dictionaries', url: 'https://docs.micropython.org/en/latest/develop/maps.html', usage: 'MicroPython documents open addressing with linear probing for dictionaries and maps; runtime allocation details differ from this bounded numeric lesson.' },
      ],
    },
    'separate-chaining-hash-table': {
      summary: 'Linked collision chains stored behind bucket heads. Every bucket owns a linked collision chain; this entry reuses the existing Hash Map storage rather than duplicating it.',
      useCases: [
        { area: 'General dictionaries', description: 'Associate keys with values in independently linked collision buckets.' },
        { area: 'Collision handling', description: 'Allow multiple colliding records to share a bucket without displacing other buckets.' },
        { area: 'Mutable symbol tables', description: 'Unlink individual records while preserving the surrounding chain.' },
        { area: 'Resizing maps', description: 'Redistribute linked nodes when load exceeds a threshold.' },
      ],
      technologies: [
        { name: 'OpenJDK HashMap', url: 'https://github.com/openjdk/jdk13/blob/master/src/java.base/share/classes/java/util/HashMap.java', usage: 'HashMap uses linked bucket bins and may replace long bins with tree bins; this lesson keeps only singly linked chains.' },
      ],
    },
    'robin-hood-hash-table': {
      summary: 'Probe-distance stealing and backward-shift deletion. A farther-traveled incoming key displaces a nearer resident, and deletion shifts subsequent displaced records backward.',
      useCases: [
        { area: 'Flat dictionaries', description: 'Keep records inside contiguous probed storage.' },
        { area: 'Probe balancing', description: 'Reduce uneven probe distances by displacing less-traveled residents.' },
        { area: 'Early negative lookup', description: 'Stop once the resident distance proves the requested key cannot occur later.' },
        { area: 'Deletion without tombstones', description: 'Shift displaced followers toward home after a removal.' },
      ],
      technologies: [
        { name: 'Rust 1.35 standard HashMap (historical)', url: 'https://github.com/rust-lang/rust/blob/1.35.0/src/libstd/collections/hash/map.rs', usage: 'This historical standard-library implementation used linear probing and Robin Hood bucket stealing. It is explicitly a historical example, not a claim about current Rust maps.' },
      ],
    },
    'cuckoo-hash-table': {
      summary: 'Two candidate locations, alternating evictions, and bounded rehashing. Each key has two legal locations; this sequential seeded variant bounds evictions and retries larger tables at most eight times.',
      useCases: [
        { area: 'Bounded-choice lookup', description: 'Check a fixed number of candidate locations for a key.' },
        { area: 'Packet classification', description: 'Use cuckoo variants for fast matching of network-flow records.' },
        { area: 'Read-heavy maps', description: 'Trade displacement and rebuild work for short lookup paths.' },
        { area: 'Collision relocation', description: 'Move an evicted record to its alternate candidate instead of extending a chain.' },
      ],
      technologies: [
        { name: 'DPDK Hash Library', url: 'https://doc.dpdk.org/guides/prog_guide/hash_lib.html', usage: 'DPDK uses bucketized cuckoo hashing for fast key lookup, including packet-flow classification; its buckets and concurrency options differ from this two-array sequential lesson.' },
      ],
    },
    'hopscotch-hashing': {
      summary: 'Four-slot neighborhoods, hop bitmaps, and legal hole relocation. Home-owned bitmaps constrain each key to four consecutive wrapped slots; failed relocation retries growth up to 256 slots, then rejects unchanged.',
      useCases: [
        { area: 'Neighborhood lookup', description: 'Inspect only bitmap-named cells near a home slot.' },
        { area: 'Integer maps', description: 'Store integer-to-record associations with bounded lookup neighborhoods.' },
        { area: 'Local relocation', description: 'Move existing records legally to bring a free slot closer.' },
        { area: 'Bitmap metadata', description: 'Separate each home index’s occupancy map from the record physically stored there.' },
      ],
      technologies: [
        { name: 'Linux VDO integer map', url: 'https://kernel.googlesource.com/pub/scm/linux/kernel/git/nathan/linux/+/f1d26d72f01556c787b1291729aa7a2ce37656a8/drivers/md/dm-vdo/int-map.c', usage: 'The VDO driver implements an integer-to-pointer map using hopscotch hashing. Its production neighborhood size and allocation policy differ from the four-slot teaching variant.' },
      ],
    },
    'extendible-hashing': {
      summary: 'Aliased directory pointers, local depths, and targeted bucket splits. Three-record buckets split through shared directory references and local depths; global depth is capped at eight, and deletion does not coalesce buckets.',
      useCases: [
        { area: 'Growing hash indexes', description: 'Split one crowded bucket rather than rehashing all records into one table.' },
        { area: 'Directory routing', description: 'Choose a bucket through a growing prefix or suffix of hash bits.' },
        { area: 'Bucket sharing', description: 'Let several directory entries refer to one bucket until local splitting is needed.' },
        { area: 'Storage-page organization', description: 'Adapt fixed-size bucket pages to nonuniform key distributions.' },
      ],
      technologies: [
        { name: 'Go maps with Swiss Tables', url: 'https://go.dev/blog/swisstable', usage: 'The Go runtime uses an extendible-hashing directory over multiple Swiss Tables. This lesson instead splits small record buckets and routes on low hash bits.' },
      ],
    },
    'linear-hashing': {
      summary: 'Overflow pages and one-bucket-at-a-time split rounds. Three-record primary pages use linked overflow pages; growth splits the next pointed bucket, advances a split round, and stores no directory.',
      useCases: [
        { area: 'Incremental index growth', description: 'Add one primary bucket per split instead of doubling a full directory.' },
        { area: 'Paged hash storage', description: 'Keep overflow records in linked pages behind primary buckets.' },
        { area: 'Predictable split order', description: 'Advance a pointer independently of the most recent overflow location.' },
        { area: 'Directory-free routing', description: 'Choose between the current and next modulus using the split pointer.' },
      ],
      technologies: [
        { name: 'PostgreSQL hash indexes', url: 'https://github.com/postgres/postgres/blob/master/src/backend/access/hash/README', usage: 'Persistent hash indexes grow through incremental bucket splitting and overflow pages; PostgreSQL also manages disk allocation, recovery, masks, and concurrency.' },
      ],
    },
    'perfect-hash-table': {
      summary: 'Static two-level FKS hashing with collision-free secondary tables. This static FKS set uses squared-size secondary tables and bounded deterministic seed trials; it is perfect for its built keys, rather than minimal or dynamically editable.',
      useCases: [
        { area: 'Static keyword sets', description: 'Build exact membership tables when all keys are known in advance.' },
        { area: 'Generated lookup code', description: 'Produce collision-free functions for fixed language or protocol names.' },
        { area: 'Read-only dictionaries', description: 'Spend construction work to obtain fixed-choice exact lookup.' },
        { area: 'Compact static indexing', description: 'Bound secondary storage by choosing a primary partition with a small squared-size sum.' },
      ],
      technologies: [
        { name: 'GCC generated gperf tables', url: 'https://gcc.gnu.org/install/prerequisites.html', usage: 'GCC documents using gperf inputs to regenerate lookup headers. GNU gperf generates a different static perfect-hash variant from this two-level FKS construction.' },
      ],
    },
    'consistent-hashing-ring': {
      summary: 'Clockwise token ownership with three virtual nodes per server. Keys route to the first clockwise virtual token; each of up to sixteen physical servers receives three tokens, with no replication or actual networking.',
      useCases: [
        { area: 'Distributed partitioning', description: 'Assign each hashed key to its clockwise token owner.' },
        { area: 'Membership changes', description: 'Transfer only intervals affected by a joining or departing server.' },
        { area: 'Virtual nodes', description: 'Give one physical server multiple token intervals to improve placement flexibility.' },
        { area: 'Cache sharding', description: 'Choose an owner for a cache key without storing a routing entry for every key.' },
      ],
      technologies: [
        { name: 'Apache Cassandra token rings', url: 'https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html', usage: 'Cassandra partitions keys through consistent hashing with virtual tokens. Production token width, replication, placement, and membership protocols differ from this 32-bit routing lesson.' },
      ],
    },
  } satisfies Record<string, StructureOverview>
}
