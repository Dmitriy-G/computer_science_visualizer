import type { StructureOverview } from './StructureInformation.ts'

export class PriorityStructureInformation {
  public static readonly overviews = {
    'priority-queue': {
      summary: 'A Priority Queue selects entries by priority rather than arrival order. This binary min-heap example stores value/priority pairs, serves smaller numeric priorities first, and preserves FIFO order for ties.',
      useCases: [
        { area: 'Task scheduling', description: 'Select urgent tasks before lower-priority work.' },
        { area: 'Event simulation', description: 'Treat a timestamp as priority to select the earliest event.' },
        { area: 'Search frontiers', description: 'Select the next candidate by a cost or score.' },
        { area: 'Stable priority handling', description: 'Use an insertion counter to preserve arrival order among equal priorities.' },
      ],
      technologies: [{ name: 'Python queue.PriorityQueue', url: 'https://docs.python.org/3/library/queue.html#queue.PriorityQueue', usage: 'Provides a heap-backed synchronized priority queue. Its native tie behavior depends on the queued records; this visualization explicitly adds a FIFO counter.' }],
    },
    'binary-max-heap': {
      summary: 'A Binary Max-Heap is a complete binary tree whose parents are at least as large as their children. This array-backed model supports duplicate safe integers, sift-up insertion, and sift-down maximum extraction.',
      useCases: [
        { area: 'Maximum selection', description: 'Read the largest retained value without sorting the entire collection.' },
        { area: 'Descending processing', description: 'Repeatedly extract maxima to process values from large to small.' },
        { area: 'Heap sorting', description: 'Move successive maxima into the sorted suffix of an array.' },
        { area: 'Bounded selection', description: 'Keep the largest retained candidate available while choosing a smaller subset.' },
      ],
      technologies: [{ name: 'Python heapq max-heap operations', url: 'https://docs.python.org/3/library/heapq.html', usage: 'Exposes max-heap construction, insertion, and removal over list storage; the maximum remains at index zero.' }],
    },
    'binomial-heap': {
      summary: 'A Binomial Heap stores a forest of heap-ordered trees with unique root degrees after consolidation. Equal-degree roots link like binary carries; this min-oriented example caches its minimum and reverses the removed root’s child list before union.',
      useCases: [
        { area: 'Mergeable work queues', description: 'Combine two queues by linking roots instead of reinserting all old entries.' },
        { area: 'Priority selection', description: 'Retain a cached minimum while representing heap sizes through tree degrees.' },
        { area: 'Batch aggregation', description: 'Build a donor queue and unite its binomial forest with existing work.' },
        { area: 'Carry-based consolidation', description: 'Study equal-rank linking and the relationship between degrees and powers of two.' },
      ],
      technologies: [{ name: 'Boost.Heap binomial_heap', url: 'https://www.boost.org/doc/libs/latest/doc/html/heap/data_structures.html', usage: 'Supplies a mergeable binomial-heap container. Boost ordering is comparator-configurable; this example always selects minima.' }],
    },
    'fibonacci-heap': {
      summary: 'A Fibonacci Heap uses circular doubly linked root and child lists with degree and child-loss marks. This min-heap demonstrates lazy insertion, extract-min consolidation, stable handle IDs, and cascading cuts; its handle Map adds donor-transfer work to meld.',
      useCases: [
        { area: 'Repeated key decreases', description: 'Lower priorities through known node handles while postponing consolidation.' },
        { area: 'Shortest-path queues', description: 'Explore a priority queue designed for many decrease-key operations.' },
        { area: 'Heap merging', description: 'Splice root lists and compare cached minima without consolidating first.' },
        { area: 'Amortized analysis', description: 'Track marked nodes and deferred root work to explain costs across an operation sequence.' },
      ],
      technologies: [{ name: 'Boost.Heap fibonacci_heap', url: 'https://www.boost.org/doc/libs/latest/doc/html/heap/data_structures.html', usage: 'Provides a mutable Fibonacci-heap container with handle-based updates and merging. This teaching model additionally maintains a numeric-ID Map and includes its transfer cost.' }],
    },
    'pairing-heap': {
      summary: 'A Pairing Heap is a heap-ordered multiway tree represented by child/sibling links. This min-oriented variant links roots in constant pointer work and uses a left-to-right pairing pass followed by a right-to-left combine pass for extraction.',
      useCases: [
        { area: 'Meldable queues', description: 'Combine two heap roots with a comparison and child-link update.' },
        { area: 'Incremental scheduling', description: 'Insert work with low pointer-update overhead and extract the next minimum.' },
        { area: 'Batch priority merging', description: 'Combine newly gathered tasks with an existing priority queue.' },
        { area: 'Self-adjusting structures', description: 'Study a heap that reorganizes children during extraction without explicit balance ranks.' },
      ],
      technologies: [
        { name: 'Boost.Heap pairing_heap', url: 'https://www.boost.org/doc/libs/latest/doc/html/heap/data_structures.html', usage: 'Supplies a self-adjusting pairing-heap container, including operations beyond the insert, two-pass extract, and meld subset shown here.' },
        { name: 'PostgreSQL ordered index-scan queue', url: 'https://github.com/postgres/postgres/blob/master/src/backend/executor/nodeIndexscan.c', usage: 'Uses a pairing heap to reorder tuples during ordered index scans when rechecked distances require it. Comparator inversion makes the queue return the smallest ordering value first.' },
      ],
    },
    'leftist-heap': {
      summary: 'A Leftist Heap is a binary min-heap with null-path ranks satisfying rank(left) >= rank(right). Meld traverses right spines, conditionally exchanges children, and recomputes ranks with rank(null) = 0.',
      useCases: [
        { area: 'Mergeable priority queues', description: 'Join heap roots along logarithmically bounded right spines.' },
        { area: 'Functional queue variants', description: 'Use leftist-tree invariants in implementations that preserve old versions.' },
        { area: 'Batch scheduling', description: 'Combine independently constructed queues while retaining heap order.' },
        { area: 'Rank invariants', description: 'Relate null-path ranks to guaranteed merge-path bounds.' },
      ],
      technologies: [
        { name: 'OCaml Containers CCHeap (functional variant)', url: 'https://github.com/c-cube/ocaml-containers#new-types-ccvector-ccheap-ccresult-ccsexp-ccbyte_buffer', usage: 'Implements a reusable functional heap using leftist rank and merge operations. This visualization uses mutable links inside an independently cloned playback model.' },
      ],
    },
    'skew-heap': {
      summary: 'A Skew Heap is a self-adjusting binary min-heap with no stored balance rank. Its meld combines right subtrees and unconditionally swaps children while returning; logarithmic performance is amortized rather than a bound on each individual operation.',
      useCases: [
        { area: 'Mergeable queues', description: 'Combine queues without maintaining height or null-path metadata.' },
        { area: 'Dynamic work aggregation', description: 'Meld new work into an existing priority ordering.' },
        { area: 'Self-adjusting heaps', description: 'Trade explicit rank maintenance for unconditional local child exchanges.' },
        { area: 'Amortized-cost lessons', description: 'Compare a long individual merge with its cost over a sequence of operations.' },
      ],
      technologies: [{ name: 'Boost.Heap skew_heap', url: 'https://www.boost.org/doc/libs/latest/doc/html/heap/data_structures.html', usage: 'Provides a self-adjusting skew-heap container with configurable comparison and mutability. This min-oriented example exposes the basic recursive meld policy.' }],
    },
    'indexed-priority-queue': {
      summary: 'An Indexed Priority Queue combines a binary min-heap with an inverse key-to-position Map. Unique integer keys let the model find entries directly, change priorities in either direction, and delete selected keys while maintaining inverse indices.',
      useCases: [
        { area: 'Priority updates', description: 'Change an existing item’s priority without scanning the heap or inserting duplicates.' },
        { area: 'Shortest-path frontiers', description: 'Keep one pending queue entry for each indexed vertex.' },
        { area: 'Cancellation', description: 'Remove a known task directly through its inverse heap position.' },
        { area: 'Mutable ranked work', description: 'Maintain an external key while the corresponding record moves during heap exchanges.' },
      ],
      technologies: [{ name: 'NetworkX MappedQueue', url: 'https://networkx.org/documentation/stable/reference/generated/networkx.utils.mapped_queue.MappedQueue.html', usage: 'Tracks heap element positions in a dictionary to support removal and priority updates. Its generic element keys differ from this example’s safe-integer keys.' }],
    },
    'monotonic-queue': {
      summary: 'A Monotonic Queue retains only decreasing maximum candidates for a sliding window. This linked-deque model expires old front indices, removes dominated back values, and reports the maximum of the latest ten arrivals; it is not an arbitrary-priority heap.',
      useCases: [
        { area: 'Sliding-window maxima', description: 'Read the greatest value among the most recent fixed number of arrivals.' },
        { area: 'Streaming extrema', description: 'Remove candidates that a newer, larger value makes irrelevant.' },
        { area: 'Signal filtering', description: 'Compute moving maximum envelopes as a window advances.' },
        { area: 'Sequence optimization', description: 'Use ordered candidates and expiry indices when a recurrence has a sliding maximum.' },
      ],
      technologies: [{ name: 'SciPy maximum_filter1d (MAXLIST variant)', url: 'https://docs.scipy.org/doc/scipy/reference/generated/scipy.ndimage.maximum_filter1d.html', usage: 'Documents a linear-time MAXLIST algorithm for moving maximum filtering. Its boundary modes and specialized candidate storage differ from this streaming linked-deque demonstration.' }],
    },
  } satisfies Record<'priority-queue' | 'binary-max-heap' | 'binomial-heap' | 'fibonacci-heap' | 'pairing-heap' | 'leftist-heap' | 'skew-heap' | 'indexed-priority-queue' | 'monotonic-queue', StructureOverview>
}
