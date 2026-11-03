import type { StructureOverview } from './StructureInformation.ts'

export class LinearStructureInformation {
  public static readonly overviews = {
    'skip-list': {
      summary: 'A Skip List keeps sorted keys in a linked base level with higher express levels. This reproducible example uses seeded geometric towers, a head sentinel, unique safe-integer keys, and at most six levels for 64 keys.',
      useCases: [
        { area: 'Ordered indexes', description: 'Search and update an ordered collection by moving right and down through linked levels.' },
        { area: 'Leaderboards', description: 'Maintain ordered scores while allowing incremental insertion and removal.' },
        { area: 'Range iteration', description: 'Find a boundary key through express links, then scan the base level in order.' },
        { area: 'In-memory storage', description: 'Use linked ordered records as an alternative to a balanced search tree.' },
      ],
      technologies: [
        { name: 'Redis sorted sets', url: 'https://redis.io/docs/latest/develop/data-types/sorted-sets/', usage: 'Redis documents a skip list paired with a hash table for sorted sets. Its score/member records and indexing are richer than this unique-integer teaching model.' },
        { name: 'RocksDB (skip-list memtable)', url: 'https://github.com/meta/rocksdb/wiki/RocksDB-Overview#pluggable-memtables', usage: 'Uses a skip list as the default ordered memtable so writes can be interleaved with range scans before flushing to SST files. Other memtable implementations are configurable.' },
        { name: 'Apache Lucene 9.10 (postings skip lists)', url: 'https://lucene.apache.org/core/9_10_0/core/org/apache/lucene/codecs/lucene99/package-summary.html', usage: 'Stores multiple skip levels to advance through blocks of postings without visiting every document ID. This serialized block-postings variant differs from mutable randomized key towers.' },
      ],
    },
    'unrolled-linked-list': {
      summary: 'An Unrolled Linked List stores several values in each linked block, spreading link overhead across those values. This example uses four-value blocks, splits full blocks, and merges a following block after deletion when it fits.',
      useCases: [
        { area: 'Sequential storage', description: 'Traverse several adjacent values before following another block link.' },
        { area: 'Mutable sequences', description: 'Limit shifts during insertion to a small block rather than an entire sequence.' },
        { area: 'Compact linked records', description: 'Share one link across multiple values instead of allocating a link per value.' },
        { area: 'Chunked lists', description: 'Grow a sequence by attaching blocks while preserving its logical order.' },
      ],
      technologies: [{ name: 'Redis quicklist (packed-node variant)', url: 'https://github.com/redis/redis/blob/unstable/src/quicklist.h', usage: 'Quicklist links nodes that can contain packed groups of list entries. It uses doubly linked nodes, configurable packing, and optional compression rather than this four-integer singly linked layout.' }],
    },
    'xor-linked-list': {
      summary: 'An XOR Linked List encodes previous and next addresses in one XOR field and carries a neighboring address during traversal. This JavaScript simulation uses BigInt XOR and a Map of numeric IDs, does not expose real pointers, and makes no memory-saving claim. No concrete production use of this exact structure has been verified here.',
      useCases: [
        { area: 'Pointer encoding lessons', description: 'Explore how a known neighbor and an XOR field recover the other neighbor.' },
        { area: 'Bidirectional traversal lessons', description: 'Compare traversing from either endpoint while carrying the previous address.' },
        { area: 'Link repair lessons', description: 'See how removing an address updates both adjacent XOR fields.' },
        { area: 'Memory representation studies', description: 'Compare native pointer accounting with the extra address-table cost of a managed-language simulation.' },
      ],
      technologies: [],
    },
    'gap-buffer': {
      summary: 'A Gap Buffer stores text around a movable range of unused cells. This ASCII teaching model moves characters across the gap, grows backing storage when needed, and preserves character IDs during movement.',
      useCases: [
        { area: 'Text editing', description: 'Insert characters locally by consuming existing gap space at the cursor.' },
        { area: 'Local deletion', description: 'Extend the gap across deleted characters without shifting the remaining suffix.' },
        { area: 'Cursor locality', description: 'Group nearby edits so moving the gap is needed less often.' },
        { area: 'Buffer management', description: 'Study the tradeoff between spare space and copying when a gap must grow.' },
      ],
      technologies: [{ name: 'GNU Emacs', url: 'https://www.gnu.org/software/emacs/manual/html_node/elisp/Buffer-Gap.html', usage: 'Emacs maintains a gap in buffer text and moves it for editing. Its multilingual text and editor metadata extend beyond this ASCII example.' }],
    },
    'rope': {
      summary: 'A Rope represents text as a tree of chunks with subtree lengths. This example uses immutable AVL nodes, leaves of at most four ASCII characters, split/join editing, and cached left weights for indexed reads.',
      useCases: [
        { area: 'Large text sequences', description: 'Store text in chunks and locate characters through subtree lengths.' },
        { area: 'Concatenation', description: 'Join chunk trees while sharing unchanged text storage.' },
        { area: 'Persistent editing', description: 'Retain older versions by sharing immutable subtrees across edits.' },
        { area: 'Substring editing', description: 'Split around an edit span and join the surviving and inserted pieces.' },
      ],
      technologies: [{ name: 'Abseil Cord (tree-of-buffers variant)', url: 'https://github.com/abseil/abseil-cpp/blob/master/absl/strings/cord.h', usage: 'Cord provides chunked, shared tree storage for character sequences. Its optimized buffer-tree implementation differs from the small AVL rope shown here.' }],
    },
    'bit-set': {
      summary: 'A Bit Array / BitSet packs boolean flags into machine words. This fixed-length example stores bits in Uint32Array words and provides indexed set, clear, toggle, and test operations without changing its logical size.',
      useCases: [
        { area: 'Boolean flags', description: 'Store many indexed on/off states in packed words.' },
        { area: 'Membership tables', description: 'Use an integer position to record whether an item is present.' },
        { area: 'Visited markers', description: 'Track visited integer IDs during graph or search processing.' },
        { area: 'Compact state masks', description: 'Read and change individual flags with bitwise masks.' },
      ],
      technologies: [
        { name: 'Java BitSet (growable variant)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/BitSet.html', usage: 'The standard library exposes indexed boolean bits and logical operations. Java BitSet can grow, whereas this example fixes the bit count.' },
        { name: 'Redis (string-backed bitmaps)', url: 'https://redis.io/docs/latest/develop/data-types/strings/bitmaps/', usage: 'Treats binary strings as bit vectors with indexed SETBIT/GETBIT operations for activity flags, permissions, and compact membership. Redis strings can grow; this example fixes the logical bit count.' },
        { name: 'Linux blk-mq (request-tag bitmaps)', url: 'https://github.com/torvalds/linux/blob/master/include/linux/blk-mq.h', usage: 'Keeps scalable bitmap queues for ordinary and reserved request tags alongside request-pointer arrays. This lesson shows packed flags without concurrent tag allocation or wait queues.' },
      ],
    },
    'sparse-array': {
      summary: 'A Sparse Array stores explicit index/value entries while omitted positions have an implicit default. This Map-backed example has 64 logical slots, initially ten stored values, and implicit zero for holes; explicitly stored zero remains an entry.',
      useCases: [
        { area: 'Sparse numeric vectors', description: 'Store selected indexed values while treating unstored positions as zero.' },
        { area: 'Large logical ranges', description: 'Keep widely separated indices without allocating a cell for every intervening hole.' },
        { area: 'Feature vectors', description: 'Represent only selected dimensions of an indexed numeric record.' },
        { area: 'Default-valued grids', description: 'Store deviations from a default rather than every logical cell.' },
      ],
      technologies: [
        { name: 'Eigen SparseVector (compressed-index variant)', url: 'https://eigen.tuxfamily.org/dox/group__TutorialSparse.html', usage: 'Eigen supplies sparse vectors for numeric linear algebra, using compressed index/value storage rather than this JavaScript Map.' },
        { name: 'Linux XArray (indexed-pointer variant)', url: 'https://docs.kernel.org/core-api/xarray.html', usage: 'Maps integer indices to pointers, notably page-cache entries, with ordered iteration and RCU lookups. Its kernel representation and concurrency differ from this fixed-range Map-backed sparse numeric array.' },
      ],
    },
    'free-list': {
      summary: 'A Free List links reusable slots in an allocation pool. This simulated pool has ten slots, initially three allocated; allocation pops the free head and release pushes a slot onto it, rejecting exhaustion and double release.',
      useCases: [
        { area: 'Object pools', description: 'Reuse available slots without growing the pool on every request.' },
        { area: 'Allocator bookkeeping', description: 'Track which blocks can satisfy a later allocation.' },
        { area: 'Page reuse', description: 'Record unused storage pages so future writes can reuse them.' },
        { area: 'Fixed resource budgets', description: 'Represent exhaustion explicitly when every preallocated slot is occupied.' },
      ],
      technologies: [{ name: 'SQLite freelist (database-page variant)', url: 'https://www.sqlite.org/fileformat.html#the_freelist', usage: 'SQLite records reusable database pages through freelist trunk and leaf pages. This persistent page format differs from the single-slot chain in the simulated pool.' }],
    },
  } satisfies Record<'skip-list' | 'unrolled-linked-list' | 'xor-linked-list' | 'gap-buffer' | 'rope' | 'bit-set' | 'sparse-array' | 'free-list', StructureOverview>
}
