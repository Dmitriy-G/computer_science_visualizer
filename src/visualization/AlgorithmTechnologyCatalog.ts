import { ActionCatalog } from './ActionCatalog.ts'
import type { ActionKind, ActionScope } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'
import type { AlgorithmUsage } from './AlgorithmInformation.ts'

// Only algorithm scopes receive real-world examples. Overview operations do not.
export class AlgorithmTechnologyCatalog {
  private static readonly uses: Readonly<Partial<Record<ActionKind, AlgorithmUsage>>> = {
    'flash-sort': {
      technologies: [],
      products: [],
      note: 'Flashsort is presented as an educational example of value classification, in-place cycle permutation, and insertion cleanup. No production use of this exact variant has been verified. Algorithm reference: https://www.neubert.net/FSOIntro.html.',
    },
    'american-flag-sort': {
      technologies: [],
      products: [],
      note: 'This 16-bin integer American Flag Sort is an educational example. No production use of this exact variant has been verified. String radix-sort implementations and proposals alone do not establish product use for this variant. Algorithm reference: https://www.usenix.org/publications/compsystems/1993/win_mcilroy.pdf.',
    },
    'spread-sort': {
      technologies: [{ name: 'NEST: Boost Spreadsort for connections', url: 'https://nest-simulator.readthedocs.io/en/main/installation/cmake_options.html', usage: 'NEST documents Boost Spreadsort for high-performance sorting of simulation connections when Boost support is enabled. This lesson reduces fan-out to 16, uses four-entry insertion leaves, and adds a depth-limited heap fallback; its complexity notes describe that teaching variant.' }],
      products: [{ name: 'NEST Simulator', url: 'https://nest-simulator.readthedocs.io/en/main/installation/cmake_options.html', usage: 'Uses Boost Spreadsort to order simulation connections, beyond demonstrating the algorithm.' }],
      note: 'The verified use is NEST connection sorting through Boost Spreadsort. The teaching implementation uses its own reduced parameters and safety fallback, not the optimized Boost implementation or its precise performance bounds. Boost algorithm documentation: https://www.boost.org/doc/libs/latest/libs/sort/doc/html/sort/single_thread/spreadsort.html.',
    },
    'burst-sort': {
      technologies: [],
      products: [],
      note: 'This Burstsort is an educational integer adaptation of string sorting, using exact hexadecimal offset keys and prefix-container bursting. No production use of this exact variant has been verified. Research benchmarks alone do not establish product use. Algorithm reference: https://people.eng.unimelb.edu.au/jzobel/fulltext/acmjea04.pdf.',
    },
    'pigeonhole-sort': {
      technologies: [],
      products: [],
      note: 'This stable full-record Pigeonhole Sort is an educational example. No production use of this exact variant has been verified. Counting Sort applications alone do not establish use of this separate hole-list implementation. Algorithm reference: https://xlinux.nist.gov/dads/HTML/pigeonholeSort.html.',
    },
    'parallel-merge-sort': {
      technologies: [{ name: 'OpenJDK: Arrays.parallelSort object path', url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/ArraysParallelSortHelpers.java', usage: 'OpenJDK uses fork/join sorting and merging for large object-array ranges, with TimSort leaves and parallel merges. This lesson instead uses binary singleton tasks, sequential merges, and two virtual worker lanes.' }],
      products: [{ name: 'Java', url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/ArraysParallelSortHelpers.java', usage: 'Provides a production fork/join merge-sort family implementation for object-array parallel sorting.' }],
      note: 'The verified use is the parallel merge-sort family. This deterministic teaching simulation does not create worker threads or reproduce OpenJDK performance guarantees.',
    },
    'parallel-quick-sort': {
      technologies: [{ name: 'oneTBB: parallel_sort', url: 'https://github.com/uxlfoundation/oneTBB/blob/master/include/oneapi/tbb/parallel_sort.h', usage: 'The large-range path uses parallel quicksort partition ranges, a sampled pivot, and std::sort leaves. This lesson uses a middle-slot pivot, three-way partitioning, and a deterministic two-lane task simulation.' }],
      products: [{ name: 'oneTBB runtime', url: 'https://github.com/uxlfoundation/oneTBB/blob/master/include/oneapi/tbb/parallel_sort.h', usage: 'Offers parallel_sort with a production parallel quicksort path for sufficiently large ranges.' }],
      note: 'oneTBB is a production parallel runtime, not an algorithm demonstration library. Its pivot policy, cutoffs, threading, and small-range sort differ from this educational simulation.',
    },
    'external-merge-sort': {
      technologies: [{ name: 'PostgreSQL: external tuplesort', url: 'https://github.com/postgres/postgres/blob/master/src/backend/utils/sort/tuplesort.c', usage: 'Large sorts write sorted runs to temporary storage and use balanced multiway merging. This lesson reduces the fan-in to two and uses four virtual tapes with three-record RAM chunks.' }],
      products: [{ name: 'PostgreSQL', url: 'https://github.com/postgres/postgres/blob/master/src/backend/utils/sort/tuplesort.c', usage: 'Uses external run sorting and balanced merging when a sort exceeds its memory budget.' }],
      note: 'PostgreSQL performs real temporary-file I/O and uses production buffering and multiway merging. The lesson stores all virtual tapes in RAM and reports logical per-record I/O.',
    },
    'polyphase-merge-sort': {
      technologies: [{ name: 'PostgreSQL 14: historical polyphase tuplesort', url: 'https://github.com/postgres/postgres/blob/REL_14_STABLE/src/backend/utils/sort/tuplesort.c', usage: 'PostgreSQL 14 documents its polyphase external merge schedule and logical tapes. This lesson demonstrates the three-tape Fibonacci special case with explicit dummy runs.' }],
      products: [{ name: 'PostgreSQL 14 (historical)', url: 'https://github.com/postgres/postgres/blob/REL_14_STABLE/src/backend/utils/sort/tuplesort.c', usage: 'Used polyphase external merging before PostgreSQL changed to balanced merging in version 15.' }],
      note: 'This is a historical production use. The three virtual tapes, fixed chunk size, and simple unstable tape-order tie handling are teaching choices rather than a reproduction of PostgreSQL tuplesort.',
    },
    'natural-merge-sort': {
      technologies: [{ name: 'GHC: Data.List sort', url: 'https://github.com/ghc/ghc/blob/master/libraries/ghc-internal/src/GHC/Internal/Data/OldList.hs', usage: 'The standard list sorter detects ascending and strictly descending sequences, then merges those natural runs. Its optimized multiway list merges differ from the adjacent pairwise array merges in this lesson.' }],
      products: [{ name: 'Glasgow Haskell Compiler standard library', url: 'https://github.com/ghc/ghc/blob/master/libraries/ghc-internal/src/GHC/Internal/Data/OldList.hs', usage: 'Provides natural-run merge sorting through the standard list sort and sortBy operations.' }],
      note: 'GHC is a production compiler and standard library. This lesson adapts natural-run detection to a fixed array with a lazy merge buffer; it does not reproduce the list allocation or multiway merge strategy.',
    },
    'odd-even-sort': {
      technologies: [],
      products: [],
      note: 'This Odd-Even Sort with early termination is an educational example. No production use of this exact variant has been verified.',
    },
    'odd-even-merge-sort': {
      technologies: [],
      products: [],
      note: 'This sequential Odd-Even Merge Sort is an educational example. No production use of this exact variant has been verified. GPU tutorial implementations alone do not establish product use.',
    },
    'bitonic-sort': {
      technologies: [{ name: 'PyTorch: SmallBitonicSort CUDA path', url: 'https://github.com/pytorch/pytorch/blob/main/aten/src/ATen/native/cuda/Sort.cu', usage: 'PyTorch dispatches very small unstable tensor-slice sorts to its bitonic CUDA kernel. That parallel kernel uses power-of-two shared storage and validity flags; this lesson uses a sequential arbitrary-length construction without padding.' }],
      products: [{ name: 'PyTorch', url: 'https://github.com/pytorch/pytorch/blob/main/aten/src/ATen/native/cuda/Sort.cu', usage: 'Uses bitonic sorting for its small unstable CUDA tensor-sorting path.' }],
      note: 'The verified use is PyTorch’s small CUDA sort path, not a claim that every tensor sort uses Bitonic Sort. The diagram uses Lang’s arbitrary-length variant: https://www.hwlang.de/algorithmen/sortieren/bitonic/oddn.htm.',
    },
    'pairwise-sorting-network': {
      technologies: [],
      products: [],
      note: 'Parberry’s Pairwise Sorting Network is presented here as an educational example. No production use of this exact recursive teaching variant has been verified.',
    },
    'sample-sort': {
      technologies: [],
      products: [],
      note: 'This stable sequential Sample Sort with bounded fan-out is an educational example. No production use of this exact variant has been verified. Production parallel sample sorts can use different sampling, partitioning, and local-sorting strategies.',
    },
    'cycle-sort': {
      technologies: [],
      products: [],
      note: 'Cycle Sort is presented here as an educational sorting example. No production use has been verified.',
    },
    'comb-sort': {
      technologies: [],
      products: [],
      note: 'Comb Sort is presented here as an educational sorting example. No production use has been verified.',
    },
    'cocktail-shaker-sort': {
      technologies: [],
      products: [],
      note: 'Cocktail Shaker Sort is presented here as an educational sorting example. No production use has been verified.',
    },
    'gnome-sort': {
      technologies: [],
      products: [],
      note: 'Gnome Sort is presented here as an educational sorting example. No production use has been verified.',
    },
    'wiki-sort': {
      technologies: [],
      products: [],
      note: 'WikiSort is presented here as an educational sorting example. No production use has been verified.',
    },
    'smooth-sort': {
      technologies: [],
      products: [],
      note: 'Smoothsort is presented here as an educational sorting example. No production use has been verified.',
    },
    'tree-sort': {
      technologies: [],
      products: [],
      note: 'This unbalanced BST Tree Sort is an educational implementation. No production use of this exact variant has been verified. Balanced ordered containers alone do not establish use of this sorting algorithm.',
    },
    'tournament-sort': {
      technologies: [{ name: 'STXXL: tournament-tree merging', url: 'https://stxxl.org/tags/1.4.1/design_algo_sorting.html', usage: 'STXXL 1.4.1 documents tournament-tree selection of the smallest buffered entry during external multiway sorting. This is the run-merging application of tournament selection; the lesson gives each input entry its own leaf and exhausts it after one win.' }],
      products: [{ name: 'STXXL', url: 'https://stxxl.org/tags/1.4.1/design_algo_sorting.html', usage: 'Uses tournament-tree selection in the merge stage of its external sorter, rather than this whole-array winner-tree variant.' }],
      note: 'The verified use is tournament selection during external run merging, not a claim that STXXL uses this exact in-memory whole-array sorting implementation.',
    },
    'patience-sort': {
      technologies: [],
      products: [],
      note: 'This pile-and-heap Patience Sort is an educational implementation. No production use of this complete sorting variant has been verified. Patience diff and longest-increasing-subsequence algorithms are related applications, not evidence of the full sorting pipeline.',
    },
    'tim-sort': {
      technologies: [
        { name: 'OpenJDK: TimSort', url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/TimSort.java', usage: 'Stably sorts object-array ranges using natural runs, binary insertion, a run stack, and galloping merges. This lesson reduces the minrun threshold and uses a fixed galloping trigger for readable small-array steps.' },
      ],
      products: [
        { name: 'Java', url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/TimSort.java', usage: 'OpenJDK provides TimSort for object-array sorting.' },
      ],
      note: 'Current CPython uses a different run-merge scheduling policy; it is not claimed to implement this exact TimSort variant.',
    },
    'intro-sort': {
      technologies: [{ name: 'GNU libstdc++ 14.2: std::sort', url: 'https://github.com/gcc-mirror/gcc/blob/releases/gcc-14.2.0/libstdc%2B%2B-v3/include/bits/stl_algo.h', usage: 'Its introsort loop starts with quicksort partitions, switches to heap-based partial_sort at the depth limit, and finishes with insertion sorting. This lesson uses median-of-three Lomuto partitioning and a smaller insertion cutoff.' }],
      products: [{ name: 'GCC', url: 'https://github.com/gcc-mirror/gcc/blob/releases/gcc-14.2.0/libstdc%2B%2B-v3/include/bits/stl_algo.h', usage: 'The libstdc++ standard library in GCC 14.2 implements an introspective std::sort hybrid.' }],
      note: 'This is evidence for a specific standard-library implementation, not a requirement that every C++ std::sort use introsort.',
    },
    'dual-pivot-quick-sort': {
      technologies: [{ name: 'OpenJDK: DualPivotQuicksort', url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/DualPivotQuicksort.java', usage: 'Partitions primitive-array ranges around two sampled pivots within an optimized hybrid. It also uses insertion, merging, and heap fallback. This lesson uses endpoint pivots and three-way range division without those worst-case protections.' }],
      products: [{ name: 'Java', url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/DualPivotQuicksort.java', usage: 'OpenJDK uses dual-pivot partitioning in its primitive-array sorting hybrid.' }],
      note: 'The quadratic worst case shown here belongs to this endpoint-pivot teaching variant, not the production hybrid.',
    },
    'block-merge-sort': {
      technologies: [],
      products: [],
      note: 'This buffered block-wise multiway merge variant is an educational implementation. No production use of this exact variant has been verified. It uses O(n) extra storage rather than constant-space internal-buffer block sorting.',
    },
    'heap-sort': {
      technologies: [
        { name: 'Linux: sort_r', url: 'https://github.com/torvalds/linux/blob/master/lib/sort.c', usage: 'Implements a nonrecursive heapsort for kernel arrays. Its optimized sifting differs from the direct parent/child swaps shown here.' },
        { name: 'OpenJDK: DualPivotQuicksort.heapSort', url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/DualPivotQuicksort.java', usage: 'Falls back to heapsort when primitive-array quicksort exceeds its recursion-depth limit, preventing quadratic partition behavior.' },
      ],
      products: [
        { name: 'Linux', url: 'https://github.com/torvalds/linux/blob/master/lib/sort.c', usage: 'The kernel array sort uses heapsort.' },
        { name: 'Java', url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/DualPivotQuicksort.java', usage: 'Primitive-array sorting includes a heapsort fallback.' },
      ],
      note: 'These are production heapsort variants; this lesson uses iterative max-heap sifting by swaps.',
    },
    'shell-sort': {
      technologies: [{ name: 'Linux 4.4: groups_sort', url: 'https://github.com/torvalds/linux/blob/v4.4/kernel/groups.c', usage: 'Historically sorted supplementary group IDs using Shell Sort with 3h + 1 gaps. Linux 4.4 uses shifts within each gapped insertion; this lesson uses exchanges and starts with a smaller maximum gap.' }],
      products: [{ name: 'Linux', url: 'https://github.com/torvalds/linux/blob/v4.4/kernel/groups.c', usage: 'Linux 4.4 used Shell Sort for supplementary group IDs; this is a historical example.' }],
      note: 'This is a version-specific historical use, not a claim about current Linux group sorting.',
    },
    'counting-sort': {
      technologies: [{ name: 'OpenJDK: DualPivotQuicksort.countingSort', url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/DualPivotQuicksort.java', usage: 'Uses counting sort for sufficiently large byte, short, and char arrays. Those primitive-only routines reconstruct values from frequencies; this lesson instead distributes entry references stably to preserve equal-key identity.' }],
      products: [{ name: 'Java', url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/DualPivotQuicksort.java', usage: 'Primitive-array sorting includes counting sort for bounded key types.' }],
      note: 'The visualizer supports signed safe integers but limits the inclusive key range to 4,096 values.',
    },
    'radix-sort': {
      technologies: [{ name: 'DuckDB: table sorting', url: 'https://duckdb.org/2021/08/27/external-sorting', usage: 'The 2021 engineering article describes radix-sorting encoded byte keys into sorted blocks, then merging the blocks for SQL ordering. This is a byte-key variant; the lesson uses decimal least-significant-digit passes.' }],
      products: [{ name: 'DuckDB', url: 'https://duckdb.org/2021/08/27/external-sorting', usage: 'Documents radix sorting in its table-sorting implementation in 2021.' }],
      note: 'The linked article documents a particular production implementation, rather than this decimal teaching variant.',
    },
    'bucket-sort': {
      technologies: [],
      products: [],
      note: 'This equal-width Bucket Sort with insertion-sorted buckets is presented as an educational example. No production use of this exact variant has been verified; this does not mean bucket sorting is only academic.',
    },
    'selection-sort': {
      technologies: [],
      products: [],
      note: 'Selection Sort is presented here as an educational example. No production use of this exact minimum-scan-and-swap variant has been verified.',
    },
    'insertion-sort': {
      technologies: [{
        name: 'OpenJDK: DualPivotQuicksort.insertionSort',
        url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/DualPivotQuicksort.java',
        usage: 'Uses ordinary insertion sort for small primitive-array partitions inside its hybrid sorting engine. This lesson runs insertion sort across the whole array.',
      }],
      products: [{
        name: 'Java',
        url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/DualPivotQuicksort.java',
        usage: 'OpenJDK uses insertion sort as a small-partition stage of its primitive-array sorting implementation.',
      }],
      note: 'The production sorter is a hybrid; its overall complexity is not the complexity of standalone insertion sort.',
    },
    'binary-insertion-sort': {
      technologies: [
        {
          name: 'CPython: list sorting binarysort',
          url: 'https://github.com/python/cpython/blob/main/Objects/listsort.txt',
          usage: 'Extends short natural runs with stable binary insertion before merging them. Binary search locates the position after equal entries; shifting remains linear per insertion.',
        },
        {
          name: 'OpenJDK: TimSort.binarySort',
          url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/TimSort.java',
          usage: 'Sorts small object-array ranges and extends short runs with binary insertion inside an adaptive merge-sort implementation.',
        },
      ],
      products: [
        { name: 'Python', url: 'https://github.com/python/cpython/blob/main/Objects/listsort.txt', usage: 'CPython list sorting uses binary insertion to extend short runs before merging.' },
        { name: 'Java', url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/TimSort.java', usage: 'OpenJDK TimSort uses binary insertion for small object-array ranges and short runs.' },
      ],
      note: 'Both runtimes use binary insertion as part of a hybrid, not as their sole general-purpose sorting algorithm.',
    },
    'merge-sort': {
      technologies: [
        {
          name: 'CPython: adaptive list mergesort',
          url: 'https://github.com/python/cpython/blob/main/Objects/listsort.txt',
          usage: 'Stably merges ordered runs in list.sort. It detects natural runs and uses adaptive merge scheduling; this lesson splits ranges evenly from the top down.',
        },
        {
          name: 'Linux: list_sort',
          url: 'https://github.com/torvalds/linux/blob/master/lib/list_sort.c',
          usage: 'Uses a stable bottom-up mergesort for kernel linked lists. This is a linked-list variant that relinks nodes instead of using this lesson’s array buffer.',
        },
      ],
      products: [
        { name: 'Python', url: 'https://github.com/python/cpython/blob/main/Objects/listsort.txt', usage: 'CPython sorts lists with an adaptive stable merging algorithm.' },
        { name: 'Linux', url: 'https://github.com/torvalds/linux/blob/master/lib/list_sort.c', usage: 'The kernel list_sort function implements a linked-list mergesort variant.' },
      ],
      note: 'Adaptive and linked-list merge variants differ from this buffered top-down array implementation.',
    },
    'quick-sort': {
      technologies: [{
        name: 'Java: Arrays.sort for primitive arrays',
        url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Arrays.html#sort(int%5B%5D)',
        usage: 'Documents a dual-pivot quicksort implementation for primitive arrays. The production implementation is a hybrid; this lesson demonstrates last-entry, single-pivot Lomuto partitioning without its extra protections.',
      }],
      products: [{
        name: 'Java',
        url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Arrays.html#sort(int%5B%5D)',
        usage: 'Java primitive-array sorting uses a dual-pivot quicksort variant rather than this lesson’s basic partition scheme.',
      }],
      note: 'Do not transfer the production hybrid’s performance guarantees to this simple last-pivot implementation.',
    },
    'bubble-sorting': {
      technologies: [{
        name: 'Linux NFS server: sort_pacl_range',
        url: 'https://github.com/torvalds/linux/blob/master/fs/nfsd/nfs4acl.c',
        usage: 'Bubble-sorts short POSIX access-control lists by tag and user/group ID. It compares adjacent entries and stops after a pass without swaps.',
      }],
      products: [{
        name: 'Linux',
        url: 'https://github.com/torvalds/linux/blob/master/fs/nfsd/nfs4acl.c',
        usage: 'Its NFS server bubble-sorts short access-control lists before validation. This is a specialized use on small lists.',
      }],
      note: 'Linux sorts ACL records rather than integers and does not use this example’s shrinking pass boundary.',
    },
    'breadth-first': {
      products: [
        {
          name: 'MongoDB Atlas',
          url: 'https://www.mongodb.com/docs/atlas/architecture/current/solutions-library/aml-network-analysis/',
          usage: 'The $graphLookup operator follows relationships in breadth-first waves. Atlas documents its use for financial-crime network analysis.',
        },
        {
          name: 'Neo4j',
          url: 'https://neo4j.com/docs/graph-data-science/current/algorithms/bfs/',
          usage: 'Graph Data Science exposes BFS to explore a projected graph from a starting node, with optional depth and target limits.',
        },
      ],
      technologies: [
        {
          name: 'Neo4j Graph Data Science: Breadth First Search',
          url: 'https://neo4j.com/docs/graph-data-science/current/algorithms/bfs/',
          usage: 'Traverses a projected graph outward from a source node, visiting each distance level before the next to explore reachable relationships.',
        },
        {
          name: 'NetworkX: bfs_edges',
          url: 'https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.traversal.breadth_first_search.bfs_edges.html',
          usage: 'Uses level-by-level frontiers to traverse reachable vertices in breadth-first order for directed or undirected graph analysis.',
        },
      ],
      note: 'NetworkX emits traversal-tree edges and groups frontier levels; this example uses a queue and reports visited vertex values. Parallel edges do not cause repeated vertex visits.',
    },
    'depth-first': {
      products: [
        {
          name: 'Git',
          url: 'https://git-scm.com/docs/gitformat-index#_cache_tree',
          usage: 'Writes its index cache-tree entries in top-down depth-first order. This traverses a directory tree, a special case of a graph.',
        },
        {
          name: 'Clang',
          url: 'https://clang.llvm.org/doxygen/classclang_1_1RecursiveASTVisitor.html',
          usage: 'Its RecursiveASTVisitor supports preorder and postorder depth-first traversal of syntax trees for compiler tooling.',
        },
        {
          name: 'Neo4j',
          url: 'https://neo4j.com/docs/graph-data-science/current/algorithms/dfs/',
          usage: 'Graph Data Science exposes DFS to explore branches of a projected graph before backtracking.',
        },
      ],
      technologies: [
        {
          name: 'Neo4j Graph Data Science: Depth First Search',
          url: 'https://neo4j.com/docs/graph-data-science/current/algorithms/dfs/',
          usage: 'Explores graph paths deeply before backtracking, providing a depth-first traversal of nodes reachable from a chosen source.',
        },
        {
          name: 'NetworkX: dfs_edges',
          url: 'https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.traversal.depth_first_search.dfs_edges.html',
          usage: 'Uses an explicit stack to follow a graph branch before backtracking, supporting depth-first exploration of reachable nodes.',
        },
      ],
      note: 'NetworkX emits traversal-tree edges; this example reports visited vertex values. Neighbor order can produce different valid traversal orders.',
    },
    'shortest-path': {
      products: [
        {
          name: 'QGIS',
          url: 'https://doc.qgis.org/3.44/en/docs/pyqgis_developer_cookbook/network_analysis.html#graph-analysis',
          usage: 'Uses Dijkstra in its network analysis tools to compute shortest routes and areas reachable within a travel-cost limit.',
        },
        {
          name: 'Blender',
          url: 'https://docs.blender.org/manual/fr/5.1/modeling/geometry_nodes/mesh/read/shortest_edge_paths.html',
          usage: 'The Blender 5.1 manual documents Dijkstra for the Shortest Edge Paths geometry node. It finds paths along mesh edges toward selected endpoint vertices, a multiple-endpoint variant.',
        },
        {
          name: 'Neo4j',
          url: 'https://neo4j.com/docs/graph-data-science/current/algorithms/dijkstra-source-target/',
          usage: 'Uses a binary-heap Dijkstra implementation for source-to-target paths on graphs with positive relationship weights.',
        },
      ],
      technologies: [
        {
          name: 'Neo4j Graph Data Science: Dijkstra Source-Target',
          url: 'https://neo4j.com/docs/graph-data-science/current/algorithms/dijkstra-source-target/',
          usage: 'Computes minimum-cost paths from a source to target nodes using relationship weights, supporting weighted route analysis.',
        },
        {
          name: 'NetworkX: dijkstra_path',
          url: 'https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.shortest_paths.weighted.dijkstra_path.html',
          usage: 'Uses Dijkstra’s algorithm to find a minimum-weight path between two graph nodes, as part of its weighted-network analysis tools.',
        },
      ],
      note: 'These libraries use heap-based priority queues. This example scans for the next minimum and uses exact integer path sums for nonnegative integer weights. Neo4j documents positive relationship weights.',
    },
    'topological-sort': {
      products: [
        {
          name: 'Apache Airflow',
          url: 'https://github.com/apache/airflow/blob/2.10.5/airflow/utils/task_group.py#L455-L507',
          usage: 'Airflow 2.10.5 orders workflow tasks after their upstream dependencies using a modified Kahn algorithm. It scans dependencies instead of precomputing indegrees.',
        },
        {
          name: 'Apache Maven',
          url: 'https://maven.apache.org/ref/3.9.9/maven-core/xref/org/apache/maven/project/ProjectSorter.html',
          usage: 'Maven 3.9.9 topologically orders a graph of projects with Plexus TopologicalSorter to determine the build order. This verifies topological sorting, not this example’s specific FIFO Kahn implementation.',
        },
      ],
      technologies: [
        {
          name: 'Python standard library: graphlib.TopologicalSorter',
          url: 'https://docs.python.org/3/library/graphlib.html',
          usage: 'Orders dependent tasks and exposes ready tasks for parallel execution. Completing a task releases successors whose prerequisites have all finished.',
        },
        {
          name: 'NetworkX: topological_generations / topological_sort',
          url: 'https://networkx.org/documentation/stable/_modules/networkx/algorithms/dag.html#topological_generations',
          usage: 'Uses the Kahn strategy: process zero-indegree vertices, then decrement their successors’ indegrees. topological_sort flattens these generations into a dependency-respecting order.',
        },
      ],
      note: 'NetworkX groups newly available vertices into generations; this example uses a FIFO queue. Both produce valid topological orders for a DAG.',
    },
  }

  private static readonly unverified: AlgorithmUsage = {
    technologies: [],
    products: [],
    note: 'This algorithm is presented for educational purposes. No use in a production system, language runtime, or established application library has been verified.',
  }

  public static get(structure: StructureKind, action: ActionKind, scope: ActionScope): AlgorithmUsage | null {
    if (scope === 'overview') return null
    for (const choice of ActionCatalog.getScopedActions(structure, scope)) {
      if (choice.kind === action) return this.uses[action] ?? this.unverified
    }
    return null
  }
}
