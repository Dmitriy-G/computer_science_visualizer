import type { StructureDefinition } from './StructureCatalog.ts'

export class AppliedStructureDefinitions {
  public static readonly structures: readonly StructureDefinition[] = [
    { kind: 'append-only-log', group: 'linear', name: 'Append-only Log', description: 'Retained records, monotone offsets, and segmented reads', symbol: '[]' },
    { kind: 'xarray', group: 'linear', name: 'XArray', description: 'Sparse integer-indexed radix branches and allocated leaf slots', symbol: '[]' },
    { kind: 'fanout-array', group: 'linear', name: 'Sorted Array / Fanout Table', description: 'Cumulative high-byte counters narrow binary searches', symbol: '[]' },
    { kind: 'flat-vector-array', group: 'linear', name: 'Flat Vector Array', description: 'Exact nearest-vector search over consecutive 2D records', symbol: '[]' },
    { kind: 'request-tag-array', group: 'linear', name: 'Request Tag Array', description: 'Direct request lookup with a sixteen-bit allocation map', symbol: '[]' },
    { kind: 'multi-queue', group: 'queue-priority', name: 'Multiqueue / Request Queues', description: 'Independent linked FIFOs with round-robin dispatch', symbol: 'Q' },
    { kind: 'lock-free-ring', group: 'queue-priority', name: 'Lock-free Ring Buffer (SPSC)', description: 'Sequence-number publication in a bounded producer/consumer ring', symbol: 'Q' },
    { kind: 'gist', group: 'trees', name: 'GiST (Generalized Search Tree)', description: 'Operator-class union, consistency, penalty, and page splits', symbol: 'T' },
    { kind: 'bkd-tree', group: 'trees', name: 'BKD Tree', description: 'Bulk-built block KD cells and exact box-query pruning', symbol: 'T' },
    { kind: 'ball-tree', group: 'trees', name: 'Ball Tree', description: 'Enclosing metric balls and exact nearest-point pruning', symbol: 'T' },
    { kind: 'maple-tree', group: 'trees', name: 'Maple Tree (Range Variant)', description: 'Nonoverlapping range storage, pivot routing, and gap search', symbol: 'T' },
    { kind: 'checksummed-block-tree', group: 'trees', name: 'Checksummed Block Pointer Hierarchy', description: 'Parent-stored checksums, copied update paths, and corruption checks', symbol: 'T' },
    { kind: 'inverted-index', group: 'string-text', name: 'GIN / Inverted Index', description: 'Sorted term postings and document-ID intersections', symbol: 'Aa' },
    { kind: 'lsh-index', group: 'hash-based', name: 'Locality-Sensitive Hashing (LSH)', description: 'Hyperplane sign codes and Hamming-similarity lookup', symbol: '#' },
    { kind: 'minimizer-index', group: 'hash-based', name: 'Minimizer Index', description: 'DNA window minima, hash postings, and verified seed matches', symbol: '#' },
    { kind: 'blocked-bloom-filter', group: 'probabilistic', name: 'Blocked Bloom Filter', description: 'One selected block contains all membership-test probes', symbol: '~' },
    { kind: 'hnsw-graph', group: 'graphs', name: 'HNSW Graph', description: 'Layered proximity links and bounded approximate neighbor search', symbol: 'G' },
    { kind: 'compacted-de-bruijn-graph', group: 'graphs', name: 'Compacted de Bruijn Graph', description: 'DNA k-mers compacted into nonbranching unitigs', symbol: 'G' },
    { kind: 'address-space-graph', group: 'graphs', name: 'OPC UA AddressSpace Graph', description: 'Typed information nodes and source/type/target references', symbol: 'G' },
  ]
}
