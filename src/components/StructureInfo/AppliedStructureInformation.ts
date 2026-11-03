import type { StructureOverview } from './StructureInformation.ts'
import type { AppliedStructureKind } from '../../visualization/AppliedStructureKinds.ts'

export class AppliedStructureInformation {
  public static readonly overviews: Record<AppliedStructureKind, StructureOverview> = {
    'append-only-log': {
      summary: 'An append-only log retains ordered offset/value records for repeatable reads. This in-memory example groups offsets into four-record segments, allows 64 retained records, and keeps offset allocation across clear.',
      useCases: [
        { area: 'Event history', description: 'Retain records so independent readers can revisit prior offsets.' },
        { area: 'Stream offsets', description: 'Identify a record by its monotone position rather than consuming it.' },
        { area: 'Segment organization', description: 'Group consecutive records into bounded logical storage segments.' },
        { area: 'Replay', description: 'Read retained events again without changing the stored history.' },
      ],
      technologies: [{ name: 'Apache Kafka logs', url: 'https://kafka.apache.org/26/implementation/log/', usage: 'Kafka stores offset-addressed records in log segments. This lesson excludes files, replication, retention policies, and consumer groups.' }],
    },
    'xarray': {
      summary: 'XArray provides integer-indexed entries without allocating every possible slot. This sequential teaching subset uses two radix-64 levels over indices 0..4095 and up to 64 occupied values, without kernel pointers, marks, or RCU.',
      useCases: [
        { area: 'Page lookup', description: 'Associate an integer page index with a stored object.' },
        { area: 'Sparse indexed storage', description: 'Allocate leaf arrays only for index groups that contain values.' },
        { area: 'Indexed updates', description: 'Replace one occupied slot without shifting other indices.' },
        { area: 'Branch reclamation', description: 'Release an empty leaf array after its last value is erased.' },
      ],
      technologies: [{ name: 'Linux XArray', url: 'https://docs.kernel.org/core-api/xarray.html', usage: 'Linux uses XArray for indexed pointer storage, prominently in the page cache. The app uses numeric values and fixed two-level radix geometry.' }],
    },
    'fanout-array': {
      summary: 'A sorted array can be paired with cumulative high-byte counters to narrow key lookup. This numeric Git-index variant stores unique 16-bit keys, an actual 256-entry fanout array, and at most 64 keys.',
      useCases: [
        { area: 'Object lookup', description: 'Narrow a sorted key range by the leading byte.' },
        { area: 'Compact indexes', description: 'Keep key storage in consecutive ordered slots.' },
        { area: 'Binary search', description: 'Find a key within the fanout-selected half-open interval.' },
        { area: 'Index maintenance', description: 'Rebuild cumulative counters after insertion or deletion.' },
      ],
      technologies: [{ name: 'Git pack indexes', url: 'https://git-scm.com/docs/pack-format', usage: 'Git pack indexes combine sorted object-ID arrays with a 256-entry fanout table. The app uses numeric two-byte keys instead of object hashes.' }],
    },
    'flat-vector-array': {
      summary: 'A flat vector index stores vector records in indexed slots and compares them exhaustively for exact nearest-neighbor queries. This 2D example supports 64 vectors and stable IDs, with integer coordinates in -1024..1024.',
      useCases: [
        { area: 'Exact similarity', description: 'Compare every candidate without approximate graph pruning.' },
        { area: 'Vector storage', description: 'Keep fixed-size coordinate records in consecutive logical slots.' },
        { area: 'Search baseline', description: 'Provide an exact reference for approximate-index results.' },
        { area: 'Stable identity', description: 'Keep vector IDs separate from storage positions.' },
      ],
      technologies: [{ name: 'FAISS flat indexes', url: 'https://github.com/facebookresearch/faiss/wiki/Faiss-indexes#flat-indexes', usage: 'FAISS flat indexes store fixed-size vector codes in arrays and compare them during searches. This lesson uses two uncompressed coordinates.' }],
    },
    'request-tag-array': {
      summary: 'Request tags combine direct array indexing with a bitmap of occupied slots. This bounded sequential example allocates the lowest free tag, releases completed requests, and rejects double release or exhaustion.',
      useCases: [
        { area: 'Completion lookup', description: 'Locate a request directly from its returned integer tag.' },
        { area: 'Slot allocation', description: 'Find a free tag through occupancy bits.' },
        { area: 'Tag reuse', description: 'Reuse a slot only after its current request completes.' },
        { area: 'Bounded request pools', description: 'Reject requests when all sixteen slots are occupied.' },
      ],
      technologies: [{ name: 'Linux blk-mq tags', url: 'https://github.com/torvalds/linux/blob/master/include/linux/blk-mq.h', usage: 'blk-mq stores request-pointer arrays alongside scalable allocation bitmaps. This example omits pointers, concurrency, reserved pools, and wait queues.' }],
    },
    'multi-queue': {
      summary: 'A multiqueue keeps several independent staging queues and selects work across them. This example uses three linked FIFOs, cached endpoints, and deterministic round-robin dispatch, with at most 64 total requests.',
      useCases: [
        { area: 'I/O staging', description: 'Group pending requests by their software queue.' },
        { area: 'Dispatch policy', description: 'Rotate the next-queue cursor after removing one head.' },
        { area: 'Independent order', description: 'Preserve FIFO order inside each staging queue.' },
        { area: 'Empty-queue skipping', description: 'Continue dispatch from another queue when one is empty.' },
      ],
      technologies: [{ name: 'Linux blk-mq', url: 'https://docs.kernel.org/block/blk-mq.html', usage: 'Linux stages I/O through software and hardware queues. This sequential lesson uses round robin and excludes actual kernel merging, schedulers, and hardware dispatch.' }],
    },
    'lock-free-ring': {
      summary: 'A sequence-number ring coordinates slot publication and reuse between a producer and a consumer. This sixteen-slot SPSC protocol is simulated sequentially: it shows acquire/release rules without starting threads or providing a concurrent queue API.',
      useCases: [
        { area: 'Bounded FIFO transfer', description: 'Move values in insertion order through a fixed ring.' },
        { area: 'Publication protocol', description: 'Publish a slot only after its payload has been written.' },
        { area: 'Slot reuse', description: 'Advance a slot sequence after the consumer releases it.' },
        { area: 'Backpressure', description: 'Reject a full ring rather than overwrite unread values.' },
      ],
      technologies: [{ name: 'DPDK ring library', url: 'https://doc.dpdk.org/guides/prog_guide/ring_lib.html', usage: 'DPDK provides bounded lockless FIFO rings with several synchronization modes. This example teaches a smaller per-slot SPSC sequence protocol, not DPDK internals or its MPMC algorithms.' }],
    },
    'gist': {
      summary: 'GiST separates balanced-page indexing from an operator class. This capacity-four engine implements interval union bounds, overlap consistency, enlargement penalties, and median splits; it is a teaching subset of the generalized framework.',
      useCases: [
        { area: 'Extensible indexing', description: 'Separate key semantics from page-management logic.' },
        { area: 'Range candidates', description: 'Prune pages whose interval union cannot overlap a query.' },
        { area: 'Balanced growth', description: 'Split full pages and create a new root when necessary.' },
        { area: 'Leaf rechecks', description: 'Evaluate exact stored intervals after internal pruning.' },
      ],
      technologies: [{ name: 'PostgreSQL GiST', url: 'https://www.postgresql.org/docs/current/gist.html', usage: 'PostgreSQL exposes extensible GiST operator classes. This sequential interval lesson omits database pages, WAL, concurrency, and other data-type strategies.' }],
    },
    'bkd-tree': {
      summary: 'A block KD-tree partitions points into bounded leaf blocks. This 2D median-built variant uses widest-axis splits, three-point leaves, and inclusive box queries, without Lucene storage codecs or radix construction.',
      useCases: [
        { area: 'Point indexing', description: 'Organize bounded coordinate records into a search hierarchy.' },
        { area: 'Spatial pruning', description: 'Skip regions whose bounds cannot improve or satisfy a query.' },
        { area: 'Leaf blocks', description: 'Scan a small block of points after reaching a leaf.' },
        { area: 'Bulk construction', description: 'Partition the complete point set before publishing the index.' },
      ],
      technologies: [{ name: 'Apache Lucene BKD', url: 'https://lucene.apache.org/core/10_3_1/core/org/apache/lucene/util/bkd/package-summary.html', usage: 'Lucene groups multidimensional point values in recursively subdivided BKD cells. Its production leaf blocks and construction methods differ from this small in-memory example.' }],
    },
    'ball-tree': {
      summary: 'A Ball Tree groups points inside enclosing metric balls. This Euclidean 2D example uses centroid centers, enclosing radii, median partitions, and three-point leaves; nearest search prunes by the triangle inequality.',
      useCases: [
        { area: 'Point indexing', description: 'Organize bounded coordinate records into a search hierarchy.' },
        { area: 'Spatial pruning', description: 'Skip regions whose bounds cannot improve or satisfy a query.' },
        { area: 'Leaf blocks', description: 'Scan a small block of points after reaching a leaf.' },
        { area: 'Bulk construction', description: 'Partition the complete point set before publishing the index.' },
      ],
      technologies: [{ name: 'scikit-learn BallTree', url: 'https://scikit-learn.org/stable/modules/neighbors.html', usage: 'scikit-learn uses BallTree for metric-aware neighbor queries. This lesson fixes Euclidean distance and uses its own simple bulk construction.' }],
    },
    'maple-tree': {
      summary: 'Maple Tree is a range-oriented B-tree family. This sequential fanout-four teaching variant implements range replacement, erasure/splitting, pivot lookup, and gap search over 0..4095; edits bulk-rebuild pages and omit native Linux node encodings and RCU.',
      useCases: [
        { area: 'Address ranges', description: 'Associate nonoverlapping index intervals with values.' },
        { area: 'Range replacement', description: 'Overwrite an interval while retaining outside fragments.' },
        { area: 'Gap lookup', description: 'Find the first unused interval of a requested size.' },
        { area: 'Pivot routing', description: 'Descend by inclusive upper bounds to locate a value.' },
      ],
      technologies: [{ name: 'Linux Maple Tree', url: 'https://docs.kernel.org/core-api/maple_tree.html', usage: 'Linux uses Maple Tree for nonoverlapping ranges, particularly virtual memory areas. Production balancing, node layouts, and synchronization are outside this rebuilt-page lesson.' }],
    },
    'checksummed-block-tree': {
      summary: 'A block-pointer hierarchy stores each child checksum and byte length in its parent pointer. This fanout-four SHA-256 lesson keeps ten data blocks, copies paths on update, and can inject corruption for verification. It does not implement ZFS allocation, disk format, redundancy, or repair.',
      useCases: [
        { area: 'Integrity checking', description: 'Compare actual block bytes with checksums stored outside the block.' },
        { area: 'Indirect blocks', description: 'Group child pointers under a hierarchy of metadata blocks.' },
        { area: 'Copy-on-write paths', description: 'Replace a modified leaf and its ancestors while sharing unchanged subtrees.' },
        { area: 'Corruption diagnosis', description: 'Detect payload changes that bypass expected pointer updates.' },
      ],
      technologies: [{ name: 'OpenZFS block-pointer checksums', url: 'https://openzfs.github.io/openzfs-docs/Basic%20Concepts/Data%20Storage/Checksums.html', usage: 'ZFS stores checksum metadata in block pointers and supports SHA-256 among its algorithms. This JSON-byte teaching format is different from ZFS on-disk blocks and recovery behavior.' }],
    },
    'inverted-index': {
      summary: 'An inverted index maps terms to documents containing them. This text GIN subset stores sorted unique postings, supports document replacement/removal and AND queries, and omits PostgreSQL page organization, pending lists, stemming, and phrase positions.',
      useCases: [
        { area: 'Document retrieval', description: 'Find document IDs associated with query words.' },
        { area: 'AND search', description: 'Intersect sorted postings for all query terms.' },
        { area: 'Index maintenance', description: 'Remove old term memberships before replacing a document.' },
        { area: 'Vocabulary management', description: 'Drop dictionary entries when their postings become empty.' },
      ],
      technologies: [{ name: 'PostgreSQL GIN', url: 'https://www.postgresql.org/docs/current/gin.html', usage: 'GIN maps extracted keys to row-ID postings for composite-value searches. This example uses text documents and in-memory sorted lists rather than a complete PostgreSQL index.' }],
    },
    'lsh-index': {
      summary: 'A binary-code LSH index uses hyperplane signs to encode vector direction. This reproducible 2D example compares eight-bit codes by exhaustive Hamming distance; it approximates angular similarity and does not promise exact Euclidean neighbors.',
      useCases: [
        { area: 'Similarity encoding', description: 'Map vectors to compact codes based on projection signs.' },
        { area: 'Hamming comparison', description: 'Compare binary signatures by counting differing bits.' },
        { area: 'Approximate matching', description: 'Select code-similar vectors without claiming exact geometric distance.' },
        { area: 'Deterministic experiments', description: 'Reuse fixed plane coefficients to compare repeated queries.' },
      ],
      technologies: [{ name: 'FAISS IndexLSH', url: 'https://github.com/facebookresearch/faiss/wiki/Faiss-indexes', usage: 'FAISS documents a flat binary-code LSH index using Hamming comparisons. The lesson uses eight fixed integer hyperplanes instead of trained rotations or optimized binary scans.' }],
    },
    'minimizer-index': {
      summary: 'A minimizer index samples representative k-mers from DNA windows and maps them to reference positions. This forward-only exact-match lesson uses k=3, windows of three k-mers, two-bit codes, and rightmost tie breaking; it does not perform full minimap2 alignment.',
      useCases: [
        { area: 'Seed sampling', description: 'Select a representative k-mer from each sliding window.' },
        { area: 'Reference indexing', description: 'Map selected codes to their source positions.' },
        { area: 'Candidate generation', description: 'Translate query/reference seed pairs into possible match starts.' },
        { area: 'Exact verification', description: 'Check complete query text after locating candidate anchors.' },
      ],
      technologies: [{ name: 'minimap2 minimizer index', url: 'https://github.com/lh3/minimap2/blob/master/README.md#algorithm-overview', usage: 'minimap2 indexes reference minimizers in a hash table before chaining and alignment. This lesson omits reverse complements, chaining, minimap2 hashes, and approximate alignment.' }],
    },
    'blocked-bloom-filter': {
      summary: 'A blocked Bloom filter confines each key\'s probes to one small block for locality. This example has eight 32-bit blocks, three within-block probes, no exact-key registry or deletion, and at most 64 add operations between clears.',
      useCases: [
        { area: 'Local membership probes', description: 'Keep a key\'s bit checks in one selected block.' },
        { area: 'Negative filtering', description: 'Reject definitely absent values before an exact lookup.' },
        { area: 'Compact storage', description: 'Represent membership candidates with a bounded bit array.' },
        { area: 'False-positive studies', description: 'Observe that set bits establish only possible membership.' },
      ],
      technologies: [{ name: 'Bifrost blocked Bloom filters', url: 'https://github.com/pmelsted/bifrost', usage: 'Bifrost uses blocked Bloom filters during compacted de Bruijn graph construction. This lesson uses numeric inputs and small fixed blocks, not its genomic pipeline or production hash design.' }],
    },
    'hnsw-graph': {
      summary: 'HNSW incrementally builds nested proximity graphs for approximate vector search. This deterministic 2D variant caps levels at three, uses M=4, efConstruction=16 and efSearch=16, and selects nearest-M links instead of the diversity heuristic.',
      useCases: [
        { area: 'Reachability', description: 'Follow stored outgoing links from a chosen start.' },
        { area: 'Representation inspection', description: 'Inspect the actual typed, layered, or compacted graph storage.' },
        { area: 'Stable identity', description: 'Keep vertex handles separate from labels and positions.' },
        { area: 'Query explanation', description: 'Show visited vertices and return the query result without editing topology.' },
      ],
      technologies: [{ name: 'FAISS HNSW', url: 'https://github.com/facebookresearch/faiss/wiki/Faiss-indexes#indexhnsw-variants', usage: 'FAISS uses HNSW over indexed vectors with configurable construction/search effort. The lesson uses sorted-array beams, capped levels, and a simpler link selector.' }],
    },
    'compacted-de-bruijn-graph': {
      summary: 'A compacted de Bruijn graph replaces maximal nonbranching k-mer paths with unitigs. This forward-only k=3 model builds all induced suffix/prefix overlaps, retains cycle-closing edges, and accepts graph-walk queries rather than claiming source-substring occurrence.',
      useCases: [
        { area: 'Reachability', description: 'Follow stored outgoing links from a chosen start.' },
        { area: 'Representation inspection', description: 'Inspect the actual typed, layered, or compacted graph storage.' },
        { area: 'Stable identity', description: 'Keep vertex handles separate from labels and positions.' },
        { area: 'Query explanation', description: 'Show visited vertices and return the query result without editing topology.' },
      ],
      technologies: [{ name: 'Bifrost compacted graphs', url: 'https://github.com/pmelsted/bifrost', usage: 'Bifrost constructs colored compacted de Bruijn graphs for genomics. The lesson omits colors, reverse complements, Bloom-assisted construction, and parallelism.' }],
    },
    'address-space-graph': {
      summary: 'An AddressSpace graph links typed information nodes through named references. This local teaching subset has Object, Variable, and Method nodes plus Organizes and HasComponent edges; it does not implement an OPC UA server or normative type-model validation.',
      useCases: [
        { area: 'Reachability', description: 'Follow stored outgoing links from a chosen start.' },
        { area: 'Representation inspection', description: 'Inspect the actual typed, layered, or compacted graph storage.' },
        { area: 'Stable identity', description: 'Keep vertex handles separate from labels and positions.' },
        { area: 'Query explanation', description: 'Show visited vertices and return the query result without editing topology.' },
      ],
      technologies: [{ name: 'OPC Foundation AddressSpace model', url: 'https://reference.opcfoundation.org/specs/OPC-10000-3/4', usage: 'OPC UA connects information Nodes through typed source-to-target References. The lesson restricts node classes and reference types and excludes namespaces, remote targets, and protocol services.' }],
    },
  }
}
