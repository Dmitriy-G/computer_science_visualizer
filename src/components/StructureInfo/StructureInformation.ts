import { HashStructureInformation } from './HashStructureInformation.ts'
import { ExtendedTreeStructureInformation } from './ExtendedTreeStructureInformation.ts'
import type { StructureKind } from '../../visualization/Scene.ts'
import { LinearStructureInformation } from './LinearStructureInformation.ts'
import { PriorityStructureInformation } from './PriorityStructureInformation.ts'
import { ExtendedGraphStructureInformation } from './ExtendedGraphStructureInformation.ts'

export interface StructureUseCase {
  readonly area: string
  readonly description: string
}

export interface StructureTechnology {
  readonly name: string
  readonly url: string
  readonly usage: string
}

export interface StructureOverview {
  readonly summary: string
  readonly useCases: readonly StructureUseCase[]
  readonly technologies: readonly StructureTechnology[]
}

export class StructureInformation {
  private static readonly overviews: Record<StructureKind, StructureOverview> = {
    ...HashStructureInformation.overviews,
    ...ExtendedTreeStructureInformation.overviews,
    ...LinearStructureInformation.overviews,
    ...PriorityStructureInformation.overviews,
    ...ExtendedGraphStructureInformation.overviews,
    'ast': {
      summary: 'An Abstract Syntax Tree represents the structure of source code with nodes for meaningful constructs rather than every punctuation mark. This arithmetic subset stores integer literals, unary signs, and binary operators; parentheses guide grouping, and the default expression has ten syntax nodes.',
      useCases: [
        { area: 'Compilers', description: 'Represent parsed source constructs so later stages can check types and generate executable code.' },
        { area: 'Interpreters', description: 'Evaluate expression nodes by first computing their operands and then applying each operator.' },
        { area: 'Code analysis', description: 'Traverse structured syntax to identify suspicious patterns or enforce coding rules.' },
        { area: 'Source transformations', description: 'Rewrite selected constructs while preserving their syntactic relationships, supporting transpilation and automated refactoring.' },
      ],
      technologies: [
        {
          name: 'Python (ast module)',
          url: 'https://docs.python.org/3/library/ast.html',
          usage: 'Exposes parsed Python syntax so tools can inspect and transform programs.',
        },
        {
          name: 'Babel (@babel/parser)',
          url: 'https://babeljs.io/docs/babel-parser',
          usage: 'Parses JavaScript, JSX, and TypeScript syntax into trees used by the Babel tooling pipeline.',
        },
        {
          name: 'TypeScript (Compiler API)',
          url: 'https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API',
          usage: 'Exposes syntax nodes and visitors for compiler tooling and source analysis.',
        },
        {
          name: 'Clang (C/C++ AST)',
          url: 'https://clang.llvm.org/docs/IntroductionToTheClangAST.html',
          usage: 'Represents C and C++ source constructs for compilation, analysis, and refactoring tools.',
        },
        {
          name: 'ESLint (AST visitors for custom rules)',
          url: 'https://eslint.org/docs/latest/extend/custom-rules',
          usage: 'Visits JavaScript syntax nodes to detect code patterns and report rule violations.',
        },
      ],
    },
    'trie': {
      summary: 'A Trie shares character paths among words and uses word-end markers to distinguish a stored word from a prefix. This example stores lowercase a-z words up to 32 letters and prunes only unused suffix nodes.',
      useCases: [
        { area: 'Autocomplete', description: 'Find the branch of words sharing a typed prefix.' },
        { area: 'Dictionary lookup', description: 'Check character transitions and the word-end marker for exact membership.' },
        { area: 'Prefix routing', description: 'Trie variants select address or path rules by matching prefixes.' },
        { area: 'Lexical analysis', description: 'Recognize keywords through shared character transitions.' },
      ],
      technologies: [
        {
          name: 'Linux (LC-trie routing tables)',
          url: 'https://docs.kernel.org/networking/fib_trie.html',
          usage: 'Uses a compressed prefix trie to find matching IPv4 routes, including longest-prefix matches.',
        },
        {
          name: 'Redis Streams (radix-tree variant)',
          url: 'https://redis.io/docs/latest/develop/data-types/streams/',
          usage: 'Indexes stream entries by their IDs to support efficient entry lookup and range access.',
        },
        {
          name: 'DuckDB (Adaptive Radix Tree indexes)',
          url: 'https://duckdb.org/why_duckdb',
          usage: 'Uses the ART trie variant for secondary indexes that locate database rows by key.',
        },
      ],
    },
    'heap': {
      summary: 'A binary min-heap is a complete binary tree in which every parent is no greater than its children, so the root holds a minimum. This array-backed example allows duplicates and restores order with sift-up and sift-down.',
      useCases: [
        { area: 'Priority scheduling', description: 'Retrieve the smallest pending priority without sorting all queued work.' },
        { area: 'Shortest paths', description: 'Keep candidate distances in a priority queue for Dijkstra-style algorithms.' },
        { area: 'Event simulation', description: 'Remove the earliest event and insert newly scheduled events.' },
        { area: 'Merging sorted streams', description: 'Keep one candidate per stream and repeatedly extract the smallest.' },
      ],
      technologies: [
        {
          name: 'Python (heapq min-heap)',
          url: 'https://docs.python.org/3/library/heapq.html',
          usage: 'Maintains a minimum-priority queue for selecting the next item and merging sorted input streams.',
        },
        {
          name: 'Java (PriorityQueue)',
          url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/PriorityQueue.html',
          usage: 'Removes the least-priority element according to the configured ordering without sorting the entire queue.',
        },
        {
          name: 'Rust (BinaryHeap, max-heap by default)',
          url: 'https://doc.rust-lang.org/std/collections/struct.BinaryHeap.html',
          usage: 'Provides a binary priority heap; it is a max-heap by default and supports min-heap ordering through Reverse.',
        },
        {
          name: '.NET (PriorityQueue, quaternary min-heap variant)',
          url: 'https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.priorityqueue-2',
          usage: 'Stores prioritized work in an array-backed four-child min-heap.',
        },
        {
          name: 'Boost.Heap (multiple variants)',
          url: 'https://www.boost.org/doc/libs/latest/doc/html/heap.html',
          usage: 'Provides priority queues with variants supporting operations such as changing priorities and merging queues.',
        },
      ],
    },
    'segment-tree': {
      summary: 'A Segment Tree caches aggregates over recursively divided array intervals; DuckDB uses this approach for SQL window aggregation. This example uses exact integer sums, point assignment, and inclusive range queries; clear resets values to zero while preserving indices.',
      useCases: [
        { area: 'Range totals', description: 'Combine cached interval sums after individual values change.' },
        { area: 'Range extremes', description: 'Variants using minimum or maximum answer interval-extreme queries after updates.' },
        { area: 'Online analytics', description: 'Maintain aggregates as measurements change while serving interval queries.' },
        { area: 'Geometric sweeps', description: 'Specialized variants track coverage counts across changing coordinate intervals.' },
      ],
      technologies: [
        {
          name: 'DuckDB (segment-tree window aggregation)',
          url: 'https://duckdb.org/2025/02/14/window-flying',
          usage: 'Combines cached aggregate states over SQL window frames so overlapping windows do not require repeated full scans.',
        },
      ],
    },
    'fenwick-tree': {
      summary: 'A Fenwick Tree (BIT) stores prefix blocks for cumulative sums and additive updates, with documented uses in SciPy rank correlation and Maple range-sum operations. This example uses zero-based input indices, one-based BIT cells, and exact integer sums.',
      useCases: [
        { area: 'Running totals', description: 'Update counters and query the total through a chosen position.' },
        { area: 'Frequency tables', description: 'Count observations at ranked values and query cumulative frequencies.' },
        { area: 'Rank correlation', description: 'Count discordant observation pairs efficiently when calculating Kendall rank correlation, as in SciPy.' },
        { area: 'Weighted selection', description: 'BIT variants search cumulative totals as individual weights change.' },
      ],
      technologies: [
        {
          name: 'SciPy (scipy.stats.kendalltau)',
          url: 'https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.kendalltau.html',
          usage: 'Counts discordant pairs with a Fenwick tree to compute Kendall rank correlation in O(n log n) time.',
        },
        {
          name: 'Maple (FenwickTree object)',
          url: 'https://www.maplesoft.com/support/help/Maple/view.aspx?path=FenwickTree',
          usage: 'Provides mutable cumulative sums, range-sum queries, and cumulative-value lower-bound lookup in the mathematical computing system.',
        },
      ],
    },
    'r-tree': {
      summary: 'An R-Tree groups spatial records inside covering rectangles so overlap queries can skip disjoint branches. This order-4 example uses quadratic splitting, at least two entries per non-root page, and condensation with record reinsertion after deletion.',
      useCases: [
        { area: 'Map searches', description: 'Retrieve object bounds intersecting a map viewport or selection.' },
        { area: 'Collision detection', description: 'Find potentially colliding bounds before detailed geometric tests.' },
        { area: 'Spatial databases', description: 'Reduce candidate records for intersection queries over geometric objects.' },
        { area: 'Drawing tools', description: 'Locate shapes in a selected region without scanning the whole drawing.' },
      ],
      technologies: [
        {
          name: 'SQLite (R*Tree spatial index)',
          url: 'https://www.sqlite.org/rtree.html',
          usage: 'Filters geometric records by their bounding boxes for overlap and containment queries.',
        },
        {
          name: 'MySQL InnoDB (R-tree spatial indexes)',
          url: 'https://dev.mysql.com/doc/refman/8.4/en/creating-spatial-indexes.html',
          usage: 'Uses SPATIAL indexes to find candidate geometries through their bounding rectangles.',
        },
        {
          name: 'PostGIS (R-tree indexes implemented with GiST)',
          url: 'https://postgis.net/workshops/postgis-intro/indexing.html',
          usage: 'Narrows spatial joins and geometry searches to overlapping bounds before exact geometry checks.',
        },
        {
          name: 'OpenLayers (vector-feature R-tree index)',
          url: 'https://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html',
          usage: 'Indexes map features by extent to accelerate spatial feature lookup and nearest-feature queries.',
        },
      ],
    },
    'lsm-tree': {
      summary: 'An LSM Tree buffers writes and merges immutable sorted runs, with tombstones hiding deleted values. This in-memory teaching model uses a sorted-array memtable of four distinct keys, automatic flushes, and manual full compaction, without disk I/O or a write-ahead log.',
      useCases: [
        { area: 'Write-heavy storage', description: 'Buffer changing keys and flush sorted tables to favor sequential storage writes.' },
        { area: 'Version reconciliation', description: 'Keep newer values ahead of older runs and discard superseded versions in compaction.' },
        { area: 'Persistent deletion', description: 'Keep a tombstone visible while older stored values still exist.' },
        { area: 'Storage maintenance', description: 'Merge sorted runs to reduce lookup work and reclaim obsolete versions.' },
      ],
      technologies: [
        {
          name: 'RocksDB (LSM storage engine)',
          url: 'https://github.com/meta/rocksdb/wiki/RocksDB-Overview',
          usage: 'Buffers writes in memtables and flushes sorted SST files, using compaction to reconcile versions.',
        },
        {
          name: 'LevelDB (sorted tables and compaction)',
          url: 'https://github.com/google/leveldb/blob/main/doc/impl.md',
          usage: 'Stores recent changes in memory and merges sorted table files to maintain a persistent key-value store.',
        },
        {
          name: 'Apache Cassandra (SSTables and compaction)',
          url: 'https://cassandra.apache.org/doc/latest/cassandra/managing/operating/compaction/overview.html',
          usage: 'Writes immutable SSTables and compacts them to reconcile updates and deletion markers.',
        },
        {
          name: 'Apache HBase (memstores and StoreFiles)',
          url: 'https://hbase.apache.org/book.html#architecture',
          usage: 'Buffers region writes in MemStores, flushes StoreFiles, and compacts stored data.',
        },
        {
          name: 'Pebble (Go LSM storage engine)',
          url: 'https://github.com/cockroachdb/pebble',
          usage: 'Provides the LSM storage engine used by CockroachDB for persistent key-value data.',
        },
      ],
    },
    'hash-map': {
      summary: 'A hash table or hash map associates unique keys with values by hashing each key to a storage bucket. This visualizer resolves collisions with linked chains and doubles the bucket count before a new entry would exceed a 0.75 load factor.',
      useCases: [
        { area: 'Caches', description: 'Map a resource key to its cached result so repeated requests can retrieve it without scanning the entire cache.' },
        { area: 'Compiler symbol tables', description: 'Associate an identifier with its type or declaration so a compiler can resolve names during analysis.' },
        { area: 'Database hash joins', description: 'Build a table of rows by join key, then probe it with rows from the other input to find equality matches.' },
        { area: 'Frequency counting', description: 'Map each observed value to a running count so a program can summarize a stream in one pass.' },
      ],
      technologies: [
        {
          name: 'Java (HashMap)',
          url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html',
          usage: 'Associates application keys with values for efficient dictionary lookup and updates.',
        },
        {
          name: '.NET (Dictionary<TKey, TValue>)',
          url: 'https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2',
          usage: 'Provides a hash-based generic key-value dictionary for .NET applications.',
        },
        {
          name: 'CPython (dict)',
          url: 'https://docs.python.org/3/faq/design.html#how-are-dictionaries-implemented-in-cpython',
          usage: 'Implements Python dictionaries with hash tables for key-to-value lookup.',
        },
        {
          name: 'Rust (HashMap)',
          url: 'https://doc.rust-lang.org/std/collections/struct.HashMap.html',
          usage: 'Provides a hash-based key-value map in the Rust standard library.',
        },
        {
          name: 'GLib (GHashTable)',
          url: 'https://docs.gtk.org/glib/struct.HashTable.html',
          usage: 'Provides hash-based lookup of keys and associated values to GLib applications.',
        },
      ],
    },
    'hash-set': {
      summary: 'A hash set stores unique values in hash buckets and checks membership without keeping a separate associated value. This visualizer uses collision chains and automatic rehashing; adding a duplicate leaves the set unchanged.',
      useCases: [
        { area: 'Deduplication', description: 'Record previously seen values so duplicate records or events can be skipped while processing an input stream.' },
        { area: 'Graph traversal', description: 'Keep visited vertices in a set so a search avoids following cycles and repeatedly exploring the same vertex.' },
        { area: 'Access checks', description: 'Store allowed identifiers so a service can quickly check whether a requested resource belongs to the permitted collection.' },
        { area: 'Set comparison', description: 'Check values against another set to find shared or missing members without comparing every pair of elements.' },
      ],
      technologies: [
        {
          name: 'Java (HashSet)',
          url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashSet.html',
          usage: 'Uses a backing HashMap to store unique values and test membership.',
        },
        {
          name: '.NET (HashSet<T>)',
          url: 'https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.hashset-1',
          usage: 'Provides hash-based membership and deduplication for generic .NET values.',
        },
        {
          name: 'CPython (set)',
          url: 'https://docs.python.org/3/c-api/set.html',
          usage: 'Stores unique hashable Python objects for membership tests and set operations.',
        },
        {
          name: 'Rust (HashSet)',
          url: 'https://doc.rust-lang.org/std/collections/struct.HashSet.html',
          usage: 'Provides unique-value membership through a hash map in the Rust standard library.',
        },
        {
          name: 'GLib (GHashTable used as a set)',
          url: 'https://docs.gtk.org/glib/type_func.HashTable.add.html',
          usage: 'Stores keys as their own values so a GHashTable can represent a set without separate payloads.',
        },
      ],
    },
    'bloom-filter': {
      summary: 'A Bloom filter uses several hashes and a bit array to report either definitely absent or possibly present, allowing false positives but no false negatives for added values until cleared. This standard filter uses 32 bits and three hashes, cannot safely delete individual items, and counts add operations rather than distinct members.',
      useCases: [
        { area: 'Storage read filtering', description: 'Check a filter before reading a disk table; a definite absence avoids an unnecessary read, while a positive result requires a real lookup.' },
        { area: 'Cache miss filtering', description: 'Track keys that may exist in backing storage so requests for definitely absent keys can avoid expensive database calls.' },
        { area: 'Large-scale deduplication', description: 'Use a compact first check for previously seen items, then confirm positive results in exact storage when duplicates must be identified reliably.' },
        { area: 'Distributed query processing', description: 'Send a compact filter of join keys to another worker so it can discard definitely unmatched rows before transferring data.' },
      ],
      technologies: [
        {
          name: 'Redis (Bloom filter commands)',
          url: 'https://redis.io/docs/latest/develop/data-types/probabilistic/bloom-filter/',
          usage: 'Provides probabilistic membership commands for compact checks that can avoid more expensive lookups.',
        },
        {
          name: 'RocksDB (SST filter blocks)',
          url: 'https://github.com/meta/rocksdb/wiki/RocksDB-Bloom-Filter',
          usage: 'Rejects absent keys before reading SST data blocks; positives still require a real lookup.',
        },
        {
          name: 'Apache Cassandra (SSTable Bloom filters)',
          url: 'https://cassandra.apache.org/doc/3.11/cassandra/operating/bloom_filters.html',
          usage: 'Checks whether an SSTable may contain a partition key to avoid unnecessary file reads.',
        },
        {
          name: 'Apache HBase (row and column Bloom filters)',
          url: 'https://hbase.apache.org/docs/performance/',
          usage: 'Filters StoreFiles during Get requests so disk reads focus on files likely to contain the requested row or column.',
        },
        {
          name: 'LevelDB (BloomFilterPolicy)',
          url: 'https://github.com/google/leveldb/blob/main/util/bloom.cc',
          usage: 'Builds compact table filters that can rule out missing keys before searching stored data.',
        },
      ],
    },
    'array': {
      summary: 'An array stores elements in consecutive slots, each accessed by a numeric index. This visualizer uses fixed-size arrays, so insertion creates a separate array with one extra slot and preserves the original.',
      technologies: [
        {
          name: 'NumPy (ndarray)',
          url: 'https://numpy.org/doc/stable/reference/arrays.ndarray.html',
          usage: 'Stores numerical data in shaped, typed arrays with support for strided views and numerical operations.',
        },
        {
          name: 'JavaScript (typed arrays)',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray',
          usage: 'Provides typed views over binary buffers for processing numeric and binary data.',
        },
        {
          name: 'Java (native arrays)',
          url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html',
          usage: 'Provides fixed-length indexed storage for primitive values and object references.',
        },
        {
          name: 'Rust (fixed-size arrays)',
          url: 'https://doc.rust-lang.org/std/primitive.array.html',
          usage: 'Stores a fixed number of elements of one type, with the length included in the type.',
        },
        {
          name: '.NET (System.Array)',
          url: 'https://learn.microsoft.com/en-us/dotnet/api/system.array',
          usage: 'Provides indexed, fixed-length array storage for .NET applications.',
        },
      ],
      useCases: [
        {
          area: 'Images and graphics',
          description: 'Store pixel values in indexed slots so a program can read or update a particular image location directly.',
        },
        {
          area: 'Scientific computing',
          description: 'Store vectors and matrix rows in contiguous memory so numerical calculations can scan values efficiently.',
        },
        {
          area: 'Lookup tables',
          description: 'Use a numeric code as an index into precomputed results, avoiding repeated calculations for a known set of inputs.',
        },
        {
          area: 'Game boards',
          description: 'Represent a fixed grid of cells by their coordinates so rules can inspect and update board positions directly.',
        },
      ],
    },
    'linked-list': {
      summary: 'A singly linked list stores elements in nodes, each pointing to the next node. It grows without requiring consecutive memory, but reaching an element means following links from the head.',
      technologies: [
        {
          name: 'GLib (GSList)',
          url: 'https://docs.gtk.org/glib/struct.SList.html',
          usage: 'Stores sequences as singly linked nodes with insertion and removal through next links.',
        },
        {
          name: 'Java (ConcurrentLinkedQueue)',
          url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ConcurrentLinkedQueue.html',
          usage: 'Implements a concurrent FIFO queue using linked nodes and nonblocking operations.',
        },
        {
          name: 'Boost.Intrusive (slist)',
          url: 'https://www.boost.org/doc/libs/latest/doc/html/intrusive/presenting_containers.html',
          usage: 'Stores singly linked sequences with links embedded in the application objects.',
        },
        {
          name: 'Linux kernel (llist)',
          url: 'https://github.com/torvalds/linux/blob/master/include/linux/llist.h',
          usage: 'Provides lockless singly linked lists for concurrent kernel producers and consumers.',
        },
        {
          name: 'Microsoft C++ STL (std::forward_list)',
          url: 'https://github.com/microsoft/STL/blob/main/stl/inc/forward_list',
          usage: 'Implements the C++ singly linked sequence container with insertion and erasure after a known position.',
        },
      ],
      useCases: [
        {
          area: 'Hash table chaining',
          description: 'Keep entries that share a hash bucket in a linked chain so collisions can be handled without relocating other buckets.',
        },
        {
          area: 'Memory pools',
          description: 'Link available blocks into a free list so an allocator can take or return a block at the head without shifting other entries.',
        },
        {
          area: 'Graph adjacency lists',
          description: 'Keep a linked list of neighbors for each vertex so edges can be added without reserving space for every possible connection.',
        },
        {
          area: 'Sequential work lists',
          description: 'Chain pending items and insert new work after a known node, allowing the sequence to change without copying the remaining items.',
        },
      ],
    },
    'stack': {
      summary: 'A stack stores elements in last-in, first-out order: the most recently added item is removed first. Push, pop, and peek operate at the top; this visualizer implements the stack with linked nodes.',
      technologies: [
        {
          name: 'Java Virtual Machine (call frames and operand stacks)',
          url: 'https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-2.html',
          usage: 'Stores active method frames and per-frame operand stacks while executing Java bytecode.',
        },
        {
          name: 'LLVM compilers (alloca stack memory)',
          url: 'https://llvm.org/docs/LangRef.html#alloca-instruction',
          usage: 'Represents function-local stack allocations with alloca, reclaimed when the function returns.',
        },
        {
          name: 'Python (list used as a stack)',
          url: 'https://docs.python.org/3/tutorial/datastructures.html#using-lists-as-stacks',
          usage: 'Supports LIFO processing with list append and pop; its backing storage is an array rather than linked nodes.',
        },
        {
          name: '.NET (Stack<T>)',
          url: 'https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.stack-1',
          usage: 'Provides a LIFO collection backed by a growable array.',
        },
        {
          name: 'Java (ArrayDeque used as a stack)',
          url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ArrayDeque.html',
          usage: 'Provides stack push and pop operations through an array-backed deque.',
        },
      ],
      useCases: [
        {
          area: 'Function calls',
          description: 'Keep active call frames in a stack so returning from a function resumes the most recent unfinished caller.',
        },
        {
          area: 'Stack memory',
          description: 'Store local variables and temporary data in stack frames during function execution. Reclaim each frame when its function returns, providing fast memory allocation and cleanup for short-lived data.',
        },
        {
          area: 'Expression parsing',
          description: 'Track opening brackets or pending operators so a parser can match nested syntax and evaluate expressions in the correct order.',
        },
        {
          area: 'Backtracking',
          description: 'Store recent choices or unexplored nodes so a search can return to the latest decision when a path reaches a dead end.',
        },
      ],
    },
    'queue': {
      summary: 'A queue stores elements in first-in, first-out order: the earliest added item is removed first. Items enter at the rear and leave from the front, with linked nodes connecting them in this visualizer.',
      technologies: [
        {
          name: 'RabbitMQ (message queues)',
          url: 'https://www.rabbitmq.com/docs/queues',
          usage: 'Buffers messages between publishers and consumers; priority, redelivery, and consumer configuration can affect observed ordering.',
        },
        {
          name: 'Apache ActiveMQ (message queues)',
          url: 'https://activemq.apache.org/components/classic/documentation/how-do-i-preserve-order-of-messages',
          usage: 'Preserves producer ordering for a queue with a single consumer and supports asynchronous message delivery.',
        },
        {
          name: 'TCP (queued send data)',
          url: 'https://www.rfc-editor.org/rfc/rfc9293.html#section-3.9.1.7',
          usage: 'Queues application data for ordered byte-stream transmission; the protocol specifies behavior rather than one linked-node implementation.',
        },
        {
          name: 'Python (queue.Queue)',
          url: 'https://docs.python.org/3/library/queue.html',
          usage: 'Provides a synchronized FIFO queue for transferring work between Python threads.',
        },
        {
          name: 'Java (ConcurrentLinkedQueue)',
          url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ConcurrentLinkedQueue.html',
          usage: 'Provides a nonblocking FIFO queue implemented with linked nodes.',
        },
      ],
      useCases: [
        {
          area: 'Background jobs',
          description: 'Place incoming jobs at the rear and let a worker take the oldest pending job, preserving arrival order.',
        },
        {
          area: 'Print scheduling',
          description: 'Line up print requests so a printer can handle one document at a time in submission order.',
        },
        {
          area: 'Breadth-first search',
          description: 'Enqueue newly discovered vertices so a search explores an unweighted graph one distance level at a time.',
        },
        {
          area: 'Producer-consumer pipelines',
          description: 'Hold items between a producer and a consumer so brief differences in their processing rates do not lose or reorder work.',
        },
      ],
    },
    'deque': {
      summary: 'A deque is a double-ended queue that allows insertion, removal, and inspection at either end. This visualizer uses doubly linked nodes and keeps pointers to both the front and back.',
      technologies: [
        {
          name: 'Python (collections.deque)',
          url: 'https://docs.python.org/3/library/collections.html#collections.deque',
          usage: 'Supports efficient additions and removals at either end of a Python sequence.',
        },
        {
          name: 'Java (ArrayDeque)',
          url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ArrayDeque.html',
          usage: 'Provides a growable array-backed double-ended queue that can also serve as a stack.',
        },
        {
          name: 'Rust (VecDeque)',
          url: 'https://doc.rust-lang.org/std/collections/struct.VecDeque.html',
          usage: 'Stores a growable ring-buffer deque with insertion and removal at both ends.',
        },
        {
          name: 'C++ Standard Library (std::deque)',
          url: 'https://eel.is/c++draft/deque.overview',
          usage: 'Provides the C++ double-ended sequence container with efficient end operations and indexed access.',
        },
        {
          name: 'Java concurrency library (LinkedBlockingDeque)',
          url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/LinkedBlockingDeque.html',
          usage: 'Provides a thread-safe blocking deque for producer-consumer work at either end.',
        },
      ],
      useCases: [
        {
          area: 'Sliding-window analysis',
          description: 'Keep candidate minimum or maximum values at the ends, removing expired or less useful candidates to process moving windows efficiently.',
        },
        {
          area: 'Work-stealing schedulers',
          description: 'Let a worker take local tasks from one end while idle workers steal tasks from the other, helping distribute work across processors.',
        },
        {
          area: 'Zero-one breadth-first search',
          description: 'Add vertices reached by a zero-cost edge to the front and those reached by a unit-cost edge to the back to find shortest paths with only these two edge costs.',
        },
        {
          area: 'Palindrome checking',
          description: 'Remove and compare symbols from opposite ends to check whether a sequence reads the same forward and backward.',
        },
      ],
    },
    'doubly-linked-list': {
      summary: 'A doubly linked list stores nodes with links to both their previous and next neighbors. Head and tail pointers allow traversal in either direction and direct updates at either end.',
      technologies: [
        {
          name: 'Java (LinkedList)',
          url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/LinkedList.html',
          usage: 'Stores a sequence with links to both neighboring nodes for traversal and updates at either end.',
        },
        {
          name: '.NET (LinkedList<T>)',
          url: 'https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.linkedlist-1',
          usage: 'Provides linked nodes with previous and next references for direct insertion and removal.',
        },
        {
          name: 'GLib (GList)',
          url: 'https://docs.gtk.org/glib/struct.List.html',
          usage: 'Stores GLib sequences in nodes linked in both directions.',
        },
        {
          name: 'Linux kernel (circular intrusive list_head)',
          url: 'https://docs.kernel.org/core-api/list.html',
          usage: 'Embeds circular doubly linked lists in kernel objects to connect and manipulate collections of records.',
        },
        {
          name: 'Java LinkedHashMap (access-order LRU caches)',
          url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/LinkedHashMap.html',
          usage: 'Links hash-map entries in insertion or access order, supporting predictable iteration and LRU-style caches.',
        },
      ],
      useCases: [
        {
          area: 'Least-recently-used caches',
          description: 'Pair the list with a hash map to move accessed entries to the front and remove the least recently used entry from the back.',
        },
        {
          area: 'Browser history',
          description: 'Link visited pages in both directions so Back and Forward can move between neighboring history entries.',
        },
        {
          area: 'Media playlists',
          description: 'Link tracks to their neighbors so playback can move to the previous or next track and remove a known track without shifting the rest.',
        },
        {
          area: 'Editable sequences',
          description: 'Keep a cursor on a node so an editor can move in either direction and insert or remove nearby items by reconnecting local links.',
        },
      ],
    },
    'circular-buffer': {
      summary: 'A circular buffer reuses a fixed set of slots by wrapping its read and write indices back to the start. This visualizer preserves first-in, first-out order and rejects new items when full instead of overwriting stored values.',
      technologies: [
        {
          name: 'Linux io_uring (I/O submission and completion rings)',
          url: 'https://man7.org/linux/man-pages/man7/io_uring.7.html',
          usage: 'Exchanges I/O submissions and completions through shared rings between applications and the kernel.',
        },
        {
          name: 'Linux kfifo (kernel FIFO buffers)',
          url: 'https://docs.kernel.org/core-api/kernel-api.html#fifo-buffer',
          usage: 'Provides bounded FIFO buffering for kernel data with wraparound storage.',
        },
        {
          name: 'JACK Audio Connection Kit (ringbuffer)',
          url: 'https://jackaudio.org/api/ringbuffer_8h.html',
          usage: 'Transfers data between audio-processing contexts through a lock-free ring buffer.',
        },
        {
          name: 'PortAudio (PaUtilRingBuffer)',
          url: 'https://portaudio.com/docs/v19-doxydocs-dev/pa__ringbuffer_8h.html',
          usage: 'Transfers samples between a single reader and writer without locks, including audio callbacks.',
        },
        {
          name: 'Boost.CircularBuffer (overwriting ring-buffer variant)',
          url: 'https://www.boost.org/doc/libs/latest/doc/html/circular_buffer.html',
          usage: 'Keeps a fixed-capacity sequence and overwrites old elements when full, a different policy from this visualizer.',
        },
      ],
      useCases: [
        {
          area: 'Audio streaming',
          description: 'Buffer audio samples between recording and playback so short timing differences can be absorbed using a fixed amount of memory.',
        },
        {
          area: 'Network packet buffering',
          description: 'Hold packets in a bounded receive queue while software processes earlier arrivals, with an explicit policy for a full buffer.',
        },
        {
          area: 'Sensor data collection',
          description: 'Queue measurements in preallocated slots so a device can collect and consume readings without repeatedly allocating memory.',
        },
        {
          area: 'Embedded communication',
          description: 'Buffer incoming serial bytes until the main program reads them, allowing the receiver and application to work at different rates within a fixed capacity.',
        },
      ],
    },
    'binary-tree': {
      summary: 'A binary search tree routes smaller keys left and larger keys right; this unbalanced version rejects duplicates and can become a chain. Boost.Intrusive exposes an unbalanced container, while AVL and Red-Black examples are listed under their own structures.',
      technologies: [
        {
          name: 'Boost.Intrusive (unbalanced bstree)',
          url: 'https://www.boost.org/doc/libs/1_86_0/doc/html/doxygen/classboost_1_1intrusive_1_1bstree.html',
          usage: 'Provides an ordered container whose links are embedded in application objects, avoiding a separate wrapper allocation per stored object.',
        },
      ],
      useCases: [
        {
          area: 'In-memory dictionaries',
          description: 'Associate records with ordered keys and choose one subtree at each comparison to find a record; performance depends on the tree shape.',
        },
        {
          area: 'Sorted reporting',
          description: 'Visit the left subtree, node, and right subtree to produce keys in ascending order without sorting the output separately.',
        },
        {
          area: 'Range filtering',
          description: 'Skip subtrees whose keys fall outside a requested interval, limiting the search to branches that can contain matching records.',
        },
        {
          area: 'Neighbor lookup',
          description: 'Follow ordered branches to find the next larger or smaller key, helping locate nearby values in a changing collection.',
        },
      ],
    },
    'avl-tree': {
      summary: 'An AVL tree is a binary search tree that keeps the heights of each node\'s two subtrees within one level of each other. Rotations restore this balance after updates, keeping searches, insertions, and deletions logarithmic in the worst case.',
      technologies: [
        {
          name: 'Windows kernel (AVL generic tables)',
          url: 'https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/ntddk/nf-ntddk-rtlinitializegenerictableavl',
          usage: 'Keeps kernel generic-table records ordered; file systems use it for data such as open-file name lookup.',
        },
        {
          name: 'illumos (libavl)',
          url: 'https://github.com/illumos/illumos-gate/blob/master/usr/src/common/avl/avl.c',
          usage: 'Supplies ordered record lookup in kernel and user-space components, including the runtime linker and debugger.',
        },
        {
          name: 'Boost.Intrusive (avl_set)',
          url: 'https://www.boost.org/doc/libs/latest/doc/html/intrusive/presenting_containers.html',
          usage: 'Provides AVL-based ordered sets with links embedded in application objects.',
        },
      ],
      useCases: [
        {
          area: 'Lookup-heavy dictionaries',
          description: 'Keep frequently searched keys in a tightly balanced tree so even unfavorable insertion orders cannot turn lookups into a long linear walk.',
        },
        {
          area: 'Ordered sets',
          description: 'Maintain unique keys in sorted order while supporting additions, removals, and membership checks with bounded tree height.',
        },
        {
          area: 'In-memory range indexes',
          description: 'Locate a range boundary through balanced search, then traverse matching keys in order instead of scanning unrelated entries.',
        },
        {
          area: 'Resource allocation',
          description: 'Index available resource sizes to find the smallest suitable size by ordered search, updating the index as resources are reserved or released.',
        },
      ],
    },
    'red-black-tree': {
      summary: 'A Red-Black tree is a binary search tree whose nodes carry red or black labels that enforce balance rules. Recoloring and rotations after updates keep its height logarithmic, giving worst-case logarithmic search, insertion, and deletion.',
      technologies: [
        {
          name: 'Java (TreeMap)',
          url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/TreeMap.html',
          usage: 'Provides an ordered key-value map with logarithmic search and updates.',
        },
        {
          name: 'Java (TreeSet, backed by TreeMap)',
          url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/TreeSet.html',
          usage: 'Provides an ordered set backed by TreeMap.',
        },
        {
          name: '.NET (SortedSet<T>)',
          url: 'https://github.com/dotnet/runtime/blob/main/src/libraries/System.Collections/src/System/Collections/Generic/SortedSet.cs',
          usage: 'Maintains sorted unique values using a red-black tree implementation.',
        },
        {
          name: 'Linux kernel (rbtree)',
          url: 'https://docs.kernel.org/core-api/rbtree.html',
          usage: 'Provides balanced ordered trees used by kernel subsystems for tasks such as timers and resource tracking.',
        },
        {
          name: 'NGINX (event timer tree)',
          url: 'https://github.com/nginx/nginx/blob/master/src/event/ngx_event_timer.h',
          usage: 'Orders pending event timers so the event loop can find and expire the earliest timer.',
        },
      ],
      useCases: [
        {
          area: 'Ordered maps and sets',
          description: 'Keep keys sorted while supporting frequent lookups and updates, preventing poor insertion orders from producing a linear chain.',
        },
        {
          area: 'Event scheduling',
          description: 'Order pending events by time so a scheduler can find the earliest event and insert or cancel others as plans change.',
        },
        {
          area: 'Memory region tracking',
          description: 'Index memory regions by address so a memory manager can locate a region or its neighbors without scanning every allocation.',
        },
        {
          area: 'Computational geometry',
          description: 'Maintain an ordered set of active segments during a sweep so algorithms can inspect neighboring segments as objects enter and leave.',
        },
      ],
    },
    'b-tree': {
      summary: 'A B-Tree is a balanced search tree that stores several keys and child pointers in each page, with all leaves at the same depth. Splits, borrowing, and merges preserve its shape; this visualizer uses pages with at most three keys and four children.',
      technologies: [
        {
          name: 'SQLite (index B-trees)',
          url: 'https://sqlite.org/fileformat.html#b_tree_pages',
          usage: 'Stores SQL index keys in balanced pages for ordered lookup; SQLite index B-trees differ from its table B-tree variant.',
        },
        {
          name: 'Rust (BTreeMap)',
          url: 'https://doc.rust-lang.org/std/collections/struct.BTreeMap.html',
          usage: 'Maintains a sorted key-value map with ordered iteration and range queries in the Rust standard library.',
        },
        {
          name: 'Abseil (C++ B-tree containers)',
          url: 'https://abseil.io/about/design/btree',
          usage: 'Provides C++ ordered maps and sets that pack multiple keys per node to reduce pointer overhead and improve locality.',
        },
        {
          name: 'etcd (in-memory MVCC key index)',
          url: 'https://github.com/etcd-io/etcd/blob/main/server/storage/mvcc/index.go',
          usage: 'Uses a B-tree to index user keys and their revision histories for versioned lookup and ordered range access.',
        },
      ],
      useCases: [
        {
          area: 'Database indexes',
          description: 'Group many ordered keys into each storage page so a lookup can narrow its search with fewer page reads.',
        },
        {
          area: 'File system metadata',
          description: 'Organize file or block records by key so a file system can find and update metadata without scanning all records.',
        },
        {
          area: 'Disk-backed dictionaries',
          description: 'Keep a searchable map larger than memory in balanced pages, reading only the pages needed along a lookup path.',
        },
        {
          area: 'Ordered data on storage devices',
          description: 'Split or merge individual pages as records change, maintaining sorted access without rewriting an entire sorted file after each update.',
        },
      ],
    },
    'b-plus-tree': {
      summary: 'A B+ Tree is a balanced multiway search tree that stores all records in linked leaves and uses internal keys to route searches. After finding a starting leaf, a range query can follow leaf links to read consecutive records efficiently.',
      technologies: [
        {
          name: 'MySQL InnoDB (non-spatial indexes)',
          url: 'https://dev.mysql.com/doc/refman/8.4/en/innodb-physical-structure.html',
          usage: 'Stores index records in leaf pages for point lookup and ordered range scans.',
        },
        {
          name: 'PostgreSQL (B-tree index implementation)',
          url: 'https://www.postgresql.org/docs/current/btree.html#BTREE-STRUCTURE',
          usage: 'Keeps row-reference tuples in leaf pages and routing tuples in internal pages for ordered SQL indexing.',
        },
        {
          name: 'Microsoft SQL Server (rowstore indexes)',
          url: 'https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide',
          usage: 'Organizes disk-based rowstore indexes into B+ trees for row lookup and range access.',
        },
        {
          name: 'OpenLDAP (LMDB storage backend)',
          url: 'https://github.com/LMDB/lmdb/blob/mdb.master/libraries/liblmdb/lmdb.h',
          usage: 'Uses memory-mapped ordered pages for transactional key-value storage, including the OpenLDAP storage backend.',
        },
        {
          name: 'bbolt (embedded Go database)',
          url: 'https://github.com/etcd-io/bbolt/blob/main/doc.go',
          usage: 'Provides a transactional B+ tree key-value store with sorted iteration and cursor-based range access.',
        },
      ],
      useCases: [
        {
          area: 'Database range queries',
          description: 'Find the first key in a requested interval and scan linked leaves to return matching rows without searching from the root for each row.',
        },
        {
          area: 'Database sorting',
          description: 'Read an index in leaf order to supply rows by indexed key, avoiding a separate sort when the query matches that order.',
        },
        {
          area: 'Time-based records',
          description: 'Index records by timestamp so queries can jump to the start of a time window and read forward until the window ends.',
        },
        {
          area: 'Paged key-value storage',
          description: 'Use compact internal routing pages and leaf records to support both individual key lookups and sequential scans in a large stored collection.',
        },
      ],
    },
    'directed-graph': {
      summary: 'A directed graph connects a source vertex to a target with an arrow; the reverse connection requires its own edge. This unweighted example permits cycles and self-loops, while duplicate directed edges are ignored.',
      useCases: [
        { area: 'Compiler control flow', description: 'Follow possible transfers between basic blocks, including loops and conditional branches.' },
        { area: 'One-way networks', description: 'Represent links that can be followed only from source to destination.' },
        { area: 'Web links', description: 'Distinguish pages that link to other pages from pages that receive those links.' },
        { area: 'Dependency analysis', description: 'Trace who depends on whom and inspect reachability, including possible cycles.' },
      ],
      technologies: [
        { name: 'LLVM (control-flow graphs)', url: 'https://llvm.org/docs/ProgrammersManual.html#viewing-graphs-while-debugging-code', usage: 'Represents control flow between basic blocks for compiler analysis, optimization, and CFG inspection.' },
        { name: 'Neo4j (directed property-graph variant)', url: 'https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/', usage: 'Stores typed, directed relationships and properties for querying connected data; its property-graph model also supports multiple relationships.' },
      ],
    },
    'weighted-graph': {
      summary: 'A weighted graph attaches a cost to each edge; weighted graphs in general can be directed or undirected. This example is undirected with nonnegative whole-number weights, uses Dijkstra for minimum-cost paths, and keeps summed distances exact with BigInt.',
      useCases: [
        { area: 'Routing', description: 'Minimize total distance or travel cost instead of the number of edges.' },
        { area: 'Communication networks', description: 'Find routes with minimum accumulated link latency or transmission cost.' },
        { area: 'Network planning', description: 'Represent installation or maintenance costs when comparing network connections.' },
        { area: 'Scientific graph analysis', description: 'Compute shortest-path distances on weighted relationships stored as sparse matrices.' },
      ],
      technologies: [
        { name: 'SciPy (sparse.csgraph.dijkstra)', url: 'https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csgraph.dijkstra.html', usage: 'Finds shortest paths on nonnegative sparse weighted graphs, including undirected graphs with directed=False. SciPy uses a priority queue; this teaching example uses a linear minimum scan.' },
        { name: 'pgRouting (pgr_dijkstra)', url: 'https://github.com/pgRouting/pgrouting/blob/main/doc/dijkstra/pgr_dijkstra.rst', usage: 'Computes minimum-cost routes over database edge tables and supports an undirected mode with directed=false.' },
      ],
    },
    'dag': {
      summary: 'A Directed Acyclic Graph has oriented edges and no directed cycles. This example rejects any insertion that would create a cycle and uses topological sorting to place every source before its target; dependency-edge conventions can vary between real systems.',
      useCases: [
        { area: 'Workflow scheduling', description: 'Run a task only after the prerequisite tasks on its incoming dependencies are ready.' },
        { area: 'Build dependencies', description: 'Order generated artifacts after the inputs needed to build them.' },
        { area: 'Version history', description: 'Represent revision ancestry without cycles, including branching and merges.' },
        { area: 'Data processing', description: 'Order transformations so intermediate inputs are available before consumers execute.' },
      ],
      technologies: [
        { name: 'Apache Airflow (workflow Dags)', url: 'https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dags.html', usage: 'Models tasks and dependencies to schedule and execute data workflows in dependency order.' },
        { name: 'Git (commit graph)', url: 'https://git-scm.com/docs/gitglossary.html#def_DAG', usage: 'Stores commit ancestry as a DAG: commits point to parents, enabling history traversal and merges.' },
      ],
    },
    'multigraph': {
      summary: 'A multigraph preserves multiple distinct edges between the same endpoints. This example is undirected and also permits self-loops, with a stable e-number for every edge so removing one parallel connection preserves the others.',
      useCases: [
        { area: 'Street networks', description: 'Keep physically different street segments that connect the same intersections.' },
        { area: 'Redundant links', description: 'Represent independent cables or connections between a pair of devices.' },
        { area: 'Transport services', description: 'Store separate routes or services connecting the same two stops.' },
        { area: 'Interaction records', description: 'Preserve distinct interactions between a pair of entities rather than collapsing them into one edge.' },
      ],
      technologies: [
        { name: 'OSMnx (undirected MultiGraph conversion)', url: 'https://osmnx.readthedocs.io/en/stable/user-reference.html#osmnx.convert.to_undirected', usage: 'Converts street networks to undirected multigraphs for compatible analysis routines, retaining parallel edges when their geometries differ. Its default street graph is a directed multigraph.' },
        { name: 'NetworkX (MultiGraph)', url: 'https://networkx.org/documentation/stable/reference/classes/multigraph.html', usage: 'Provides keyed parallel edges and self-loops for network analysis; OSMnx uses this class for its undirected conversion.' },
      ],
    },
    'graph': {
      summary: 'An undirected graph represents symmetric relationships: every edge can be followed in both directions. This is the original Graph example, now explicitly named; it is unweighted, permits self-loops, and stores one edge per endpoint pair.',
      technologies: [
        {
          name: 'NetworkX (undirected Graph)',
          url: 'https://networkx.org/documentation/stable/reference/classes/graph.html',
          usage: 'Stores undirected networks for scientific network analysis, connectivity queries, and graph computations. Self-loops are allowed; parallel edges are not.',
        },
        {
          name: 'SciPy (undirected sparse graph routines)',
          url: 'https://docs.scipy.org/doc/scipy/reference/sparse.csgraph.html',
          usage: 'Processes undirected networks in sparse-matrix form for connectivity and path analysis; this is a matrix representation rather than adjacency sets.',
        },
      ],
      useCases: [
        {
          area: 'Transport networks',
          description: 'Represent locations as vertices and two-way routes as edges so pathfinding can discover connections between places.',
        },
        {
          area: 'Social networks',
          description: 'Represent people and mutual friendships to find connected communities or suggest contacts through shared neighbors.',
        },
        {
          area: 'Computer networks',
          description: 'Represent devices and communication links to check reachability and identify parts of a network disconnected by a failed link.',
        },
        {
          area: 'Conflict scheduling',
          description: 'Connect tasks that cannot share a time slot, then use graph coloring to assign slots without placing conflicting tasks together.',
        },
      ],
    },
  }

  public static get(structure: StructureKind): StructureOverview {
    return this.overviews[structure]
  }
}
