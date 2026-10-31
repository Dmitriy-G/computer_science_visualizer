import type { StructureKind } from '../../visualization/Scene.ts'

export interface StructureUseCase {
  readonly area: string
  readonly description: string
}

export interface StructureTechnology {
  readonly name: string
  readonly url: string
}

export interface StructureOverview {
  readonly summary: string
  readonly useCases: readonly StructureUseCase[]
  readonly technologies: readonly StructureTechnology[]
}

export class StructureInformation {
  private static readonly overviews: Record<StructureKind, StructureOverview> = {
    'ast': {
      summary: 'An Abstract Syntax Tree represents the structure of source code with nodes for meaningful constructs rather than every punctuation mark. This arithmetic subset stores integer literals, unary signs, and binary operators; parentheses guide grouping, and the default expression has ten syntax nodes.',
      useCases: [
        { area: 'Compilers', description: 'Represent parsed source constructs so later stages can check types and generate executable code.' },
        { area: 'Interpreters', description: 'Evaluate expression nodes by first computing their operands and then applying each operator.' },
        { area: 'Code analysis', description: 'Traverse structured syntax to identify suspicious patterns or enforce coding rules.' },
        { area: 'Source transformations', description: 'Rewrite selected constructs while preserving their syntactic relationships, supporting transpilation and automated refactoring.' },
      ],
      technologies: [
        { name: 'Python (ast module)', url: 'https://docs.python.org/3/library/ast.html' },
        { name: 'Babel (@babel/parser)', url: 'https://babeljs.io/docs/babel-parser' },
        { name: 'TypeScript (Compiler API)', url: 'https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API' },
        { name: 'Clang (C/C++ AST)', url: 'https://clang.llvm.org/docs/IntroductionToTheClangAST.html' },
        { name: 'ESLint (AST visitors for custom rules)', url: 'https://eslint.org/docs/latest/extend/custom-rules' },
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
        { name: 'pygtrie (character and string tries)', url: 'https://pygtrie.readthedocs.io/en/latest/index.html' },
        { name: 'Apache Commons Collections (PatriciaTrie variant)', url: 'https://commons.apache.org/proper/commons-collections/apidocs/org/apache/commons/collections4/trie/PatriciaTrie.html' },
        { name: 'MARISA (compact static trie)', url: 'https://github.com/s-yata/marisa-trie' },
        { name: 'Cedar (double-array trie)', url: 'https://www.tkl.iis.u-tokyo.ac.jp/~ynaga/cedar/' },
        { name: 'trie-rs (LOUDS-based Rust trie)', url: 'https://docs.rs/trie-rs/latest/trie_rs/' },
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
        { name: 'Python (heapq min-heap)', url: 'https://docs.python.org/3/library/heapq.html' },
        { name: 'Java (PriorityQueue)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/PriorityQueue.html' },
        { name: 'Rust (BinaryHeap, max-heap by default)', url: 'https://doc.rust-lang.org/std/collections/struct.BinaryHeap.html' },
        { name: '.NET (PriorityQueue, quaternary min-heap variant)', url: 'https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.priorityqueue-2' },
        { name: 'Boost.Heap (multiple variants)', url: 'https://www.boost.org/doc/libs/latest/doc/html/heap.html' },
      ],
    },
    'segment-tree': {
      summary: 'A Segment Tree caches aggregates over recursively divided array intervals. This example uses exact integer sums, point assignment, and inclusive range queries; clear resets values to zero while preserving indices.',
      useCases: [
        { area: 'Range totals', description: 'Combine cached interval sums after individual values change.' },
        { area: 'Range extremes', description: 'Variants using minimum or maximum answer interval-extreme queries after updates.' },
        { area: 'Online analytics', description: 'Maintain aggregates as measurements change while serving interval queries.' },
        { area: 'Geometric sweeps', description: 'Specialized variants track coverage counts across changing coordinate intervals.' },
      ],
      technologies: [
        { name: 'AtCoder Library (segtree)', url: 'https://atcoder.github.io/ac-library/production/document_en/segtree.html' },
        { name: 'KACTL (SegmentTree)', url: 'https://github.com/kth-competitive-programming/kactl/blob/main/content/data-structures/SegmentTree.h' },
        { name: 'ac-library-rs (Rust port)', url: 'https://github.com/rust-lang-ja/ac-library-rs/blob/master/src/segtree.rs' },
        { name: 'NyaanNyaan library (segment tree)', url: 'https://github.com/NyaanNyaan/library/blob/master/segment-tree/segment-tree.hpp' },
        { name: 'maspypy library (monoid segment tree)', url: 'https://github.com/maspypy/library/blob/main/ds/segtree/segtree.hpp' },
      ],
    },
    'fenwick-tree': {
      summary: 'A Fenwick Tree, or Binary Indexed Tree (BIT), stores prefix blocks in a compact array and navigates them using the least significant set bit. This example uses zero-based input indices, one-based BIT cells, exact sums, and additive updates.',
      useCases: [
        { area: 'Running totals', description: 'Update counters and query the total through a chosen position.' },
        { area: 'Frequency tables', description: 'Count observations at ranked values and query cumulative frequencies.' },
        { area: 'Inversion counting', description: 'Count previously seen larger or smaller ranks while scanning a sequence.' },
        { area: 'Weighted selection', description: 'BIT variants search cumulative totals as individual weights change.' },
      ],
      technologies: [
        { name: 'AtCoder Library (fenwick_tree)', url: 'https://atcoder.github.io/ac-library/production/document_en/fenwicktree.html' },
        { name: 'KACTL (FenwickTree)', url: 'https://github.com/kth-competitive-programming/kactl/blob/main/content/data-structures/FenwickTree.h' },
        { name: 'ac-library-rs (Rust port)', url: 'https://github.com/rust-lang-ja/ac-library-rs/blob/master/src/fenwicktree.rs' },
        { name: 'NyaanNyaan library (binary indexed tree)', url: 'https://github.com/NyaanNyaan/library/blob/master/data-structure/binary-indexed-tree.hpp' },
        { name: 'maspypy library (Fenwick tree)', url: 'https://github.com/maspypy/library/blob/main/ds/fenwicktree/fenwicktree.hpp' },
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
        { name: 'SQLite (R*Tree variant)', url: 'https://www.sqlite.org/rtree.html' },
        { name: 'libspatialindex (R-tree variants)', url: 'https://libspatialindex.org/' },
        { name: 'Boost.Geometry (R-tree)', url: 'https://www.boost.org/doc/libs/latest/libs/geometry/doc/html/geometry/spatial_indexes/introduction.html' },
        { name: 'RBush (JavaScript R-tree variant)', url: 'https://github.com/mourner/rbush' },
        { name: 'Python Rtree (libspatialindex wrapper)', url: 'https://rtree.readthedocs.io/en/latest/' },
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
        { name: 'RocksDB (LSM storage engine)', url: 'https://github.com/facebook/rocksdb/wiki/RocksDB-Overview' },
        { name: 'LevelDB (sorted tables and compaction)', url: 'https://github.com/google/leveldb/blob/main/doc/impl.md' },
        { name: 'Apache Cassandra (SSTables and compaction)', url: 'https://cassandra.apache.org/doc/latest/cassandra/managing/operating/compaction/overview.html' },
        { name: 'Apache HBase (memstores and StoreFiles)', url: 'https://hbase.apache.org/book.html#architecture' },
        { name: 'Pebble (Go LSM storage engine)', url: 'https://github.com/cockroachdb/pebble' },
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
        { name: 'Java (HashMap)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html' },
        { name: '.NET (Dictionary<TKey, TValue>)', url: 'https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2' },
        { name: 'CPython (dict)', url: 'https://docs.python.org/3/faq/design.html#how-are-dictionaries-implemented-in-cpython' },
        { name: 'Rust (HashMap)', url: 'https://doc.rust-lang.org/std/collections/struct.HashMap.html' },
        { name: 'GLib (GHashTable)', url: 'https://docs.gtk.org/glib/struct.HashTable.html' },
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
        { name: 'Java (HashSet)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashSet.html' },
        { name: '.NET (HashSet<T>)', url: 'https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.hashset-1' },
        { name: 'CPython (set)', url: 'https://docs.python.org/3/c-api/set.html' },
        { name: 'Rust (HashSet)', url: 'https://doc.rust-lang.org/std/collections/struct.HashSet.html' },
        { name: 'GLib (GHashTable used as a set)', url: 'https://docs.gtk.org/glib/type_func.HashTable.add.html' },
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
        { name: 'Redis (Bloom filter commands)', url: 'https://redis.io/docs/latest/data-types/probabilistic/bloom-filter/' },
        { name: 'RocksDB (SST filter blocks)', url: 'https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter' },
        { name: 'Apache Cassandra (SSTable Bloom filters)', url: 'https://cassandra.apache.org/doc/3.11/cassandra/operating/bloom_filters.html' },
        { name: 'Apache HBase (row and column Bloom filters)', url: 'https://hbase.apache.org/docs/performance/' },
        { name: 'LevelDB (BloomFilterPolicy)', url: 'https://github.com/google/leveldb/blob/main/util/bloom.cc' },
      ],
    },
    'array': {
      summary: 'An array stores elements in consecutive slots, each accessed by a numeric index. This visualizer uses fixed-size arrays, so insertion creates a separate array with one extra slot and preserves the original.',
      technologies: [
        { name: 'NumPy (ndarray)', url: 'https://numpy.org/doc/stable/reference/arrays.ndarray.html' },
        { name: 'JavaScript (typed arrays)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray' },
        { name: 'Java (native arrays)', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html' },
        { name: 'Rust (fixed-size arrays)', url: 'https://doc.rust-lang.org/std/primitive.array.html' },
        { name: '.NET (System.Array)', url: 'https://learn.microsoft.com/en-us/dotnet/api/system.array' },
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
        { name: 'GLib (GSList)', url: 'https://docs.gtk.org/glib/struct.SList.html' },
        { name: 'Java (ConcurrentLinkedQueue)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ConcurrentLinkedQueue.html' },
        { name: 'Boost.Intrusive (slist)', url: 'https://www.boost.org/doc/libs/latest/doc/html/intrusive/presenting_containers.html' },
        { name: 'Linux kernel (llist)', url: 'https://github.com/torvalds/linux/blob/master/include/linux/llist.h' },
        { name: 'Microsoft C++ STL (std::forward_list)', url: 'https://github.com/microsoft/STL/blob/main/stl/inc/forward_list' },
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
        { name: 'Java Virtual Machine (call frames and operand stacks)', url: 'https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-2.html' },
        { name: 'LLVM compilers (alloca stack memory)', url: 'https://llvm.org/docs/LangRef.html#alloca-instruction' },
        { name: 'Python (list used as a stack)', url: 'https://docs.python.org/3/tutorial/datastructures.html#using-lists-as-stacks' },
        { name: '.NET (Stack<T>)', url: 'https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.stack-1' },
        { name: 'Java (ArrayDeque used as a stack)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ArrayDeque.html' },
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
        { name: 'RabbitMQ (message queues)', url: 'https://www.rabbitmq.com/docs/queues' },
        { name: 'Apache ActiveMQ (message queues)', url: 'https://activemq.apache.org/components/classic/documentation/how-do-i-preserve-order-of-messages' },
        { name: 'TCP (queued send data)', url: 'https://www.rfc-editor.org/rfc/rfc9293.html#section-3.9.1.7' },
        { name: 'Python (queue.Queue)', url: 'https://docs.python.org/3/library/queue.html' },
        { name: 'Java (ConcurrentLinkedQueue)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ConcurrentLinkedQueue.html' },
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
        { name: 'Python (collections.deque)', url: 'https://docs.python.org/3/library/collections.html#collections.deque' },
        { name: 'Java (ArrayDeque)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ArrayDeque.html' },
        { name: 'Rust (VecDeque)', url: 'https://doc.rust-lang.org/std/collections/struct.VecDeque.html' },
        { name: 'C++ Standard Library (std::deque)', url: 'https://eel.is/c++draft/deque.overview' },
        { name: 'Java concurrency library (LinkedBlockingDeque)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/LinkedBlockingDeque.html' },
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
        { name: 'Java (LinkedList)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/LinkedList.html' },
        { name: '.NET (LinkedList<T>)', url: 'https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.linkedlist-1' },
        { name: 'GLib (GList)', url: 'https://docs.gtk.org/glib/struct.List.html' },
        { name: 'Linux kernel (list_head)', url: 'https://docs.kernel.org/core-api/list.html' },
        { name: 'Java LinkedHashMap (access-order LRU caches)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/LinkedHashMap.html' },
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
        { name: 'Linux io_uring (I/O submission and completion rings)', url: 'https://man7.org/linux/man-pages/man7/io_uring.7.html' },
        { name: 'Linux kfifo (kernel FIFO buffers)', url: 'https://docs.kernel.org/core-api/kernel-api.html#fifo-buffer' },
        { name: 'JACK Audio Connection Kit (ringbuffer)', url: 'https://jackaudio.org/api/ringbuffer_8h.html' },
        { name: 'PortAudio (PaUtilRingBuffer)', url: 'https://portaudio.com/docs/v19-doxydocs-dev/pa__ringbuffer_8h.html' },
        { name: 'Boost.CircularBuffer', url: 'https://www.boost.org/doc/libs/latest/doc/html/circular_buffer.html' },
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
      summary: 'A binary search tree stores keys in nodes with at most two children, placing smaller keys on the left and larger keys on the right. This version rejects duplicate keys and does not rebalance, so insertion order can produce a long chain.',
      technologies: [
        { name: 'Boost.Intrusive (unbalanced bstree)', url: 'https://www.boost.org/doc/libs/1_86_0/doc/html/doxygen/classboost_1_1intrusive_1_1bstree.html' },
        { name: 'GNU libavl (plain BST implementation)', url: 'https://adtinfo.org/libavl.html/index.html' },
        { name: 'Java TreeMap (Red-Black BST variant)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/TreeMap.html' },
        { name: '.NET SortedSet<T> (Red-Black BST variant)', url: 'https://github.com/dotnet/runtime/blob/main/src/libraries/System.Collections/src/System/Collections/Generic/SortedSet.cs' },
        { name: 'Windows kernel generic tables (AVL BST variant)', url: 'https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/ntddk/nf-ntddk-rtlinitializegenerictableavl' },
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
        { name: 'Windows kernel (AVL generic tables)', url: 'https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/ntddk/nf-ntddk-rtlinitializegenerictableavl' },
        { name: 'illumos (libavl)', url: 'https://www.smartos.org/man/3LIB/libavl' },
        { name: 'Apache Directory Server (AvlTreeImpl)', url: 'https://nightlies.apache.org/directory/apacheds/2.0.0.AM26/apidocs/org/apache/directory/server/core/avltree/AvlTreeImpl.html' },
        { name: 'Boost.Intrusive (avl_set)', url: 'https://www.boost.org/doc/libs/latest/doc/html/intrusive/presenting_containers.html' },
        { name: 'GNU libavl (AVL implementation)', url: 'https://adtinfo.org/libavl.html/index.html' },
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
        { name: 'Java (TreeMap)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/TreeMap.html' },
        { name: 'Java (TreeSet, backed by TreeMap)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/TreeSet.html' },
        { name: '.NET (SortedSet<T>)', url: 'https://github.com/dotnet/runtime/blob/main/src/libraries/System.Collections/src/System/Collections/Generic/SortedSet.cs' },
        { name: 'Linux kernel (rbtree)', url: 'https://docs.kernel.org/core-api/rbtree.html' },
        { name: 'NGINX (event timer tree)', url: 'https://github.com/nginx/nginx/blob/master/src/event/ngx_event_timer.h' },
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
        { name: 'SQLite (index B-trees)', url: 'https://sqlite.org/fileformat.html#b_tree_pages' },
        { name: 'Rust (BTreeMap)', url: 'https://doc.rust-lang.org/std/collections/struct.BTreeMap.html' },
        { name: 'Abseil (C++ B-tree containers)', url: 'https://abseil.io/about/design/btree' },
        { name: 'Google BTree (Go library)', url: 'https://github.com/google/btree' },
        { name: 'PostgreSQL (B-tree indexes with a B+ tree layout)', url: 'https://www.postgresql.org/docs/current/btree.html#BTREE-STRUCTURE' },
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
        { name: 'MySQL InnoDB (non-spatial indexes)', url: 'https://dev.mysql.com/doc/refman/8.4/en/innodb-physical-structure.html' },
        { name: 'PostgreSQL (B-tree index implementation)', url: 'https://www.postgresql.org/docs/current/btree.html#BTREE-STRUCTURE' },
        { name: 'Microsoft SQL Server (rowstore indexes)', url: 'https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide' },
        { name: 'LMDB (embedded key-value storage)', url: 'https://github.com/LMDB/lmdb' },
        { name: 'bbolt (embedded Go database)', url: 'https://github.com/etcd-io/bbolt' },
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
    'graph': {
      summary: 'A graph represents objects as vertices and relationships as edges, allowing connections beyond a simple sequence or hierarchy. This visualizer uses undirected edges, so each connection can be followed in either direction.',
      technologies: [
        { name: 'Neo4j (property graph database)', url: 'https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/' },
        { name: 'JanusGraph (distributed graph database)', url: 'https://docs.janusgraph.org/' },
        { name: 'Apache TinkerPop (graph traversal framework)', url: 'https://tinkerpop.apache.org/docs/current/reference/' },
        { name: 'NetworkX (graph algorithms)', url: 'https://networkx.org/documentation/stable/reference/classes/graph.html' },
        { name: 'LLVM compilers (directed control-flow graphs)', url: 'https://llvm.org/docs/ProgrammersManual.html#viewing-graphs-while-debugging-code' },
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
