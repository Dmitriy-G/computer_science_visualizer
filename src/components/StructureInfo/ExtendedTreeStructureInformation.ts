import type { StructureOverview } from './StructureInformation.ts'

export class ExtendedTreeStructureInformation {
  public static readonly overviews = {
    'general-tree': {
      summary: 'Nodes with any number of ordered children and no search-key ordering. Each node has one parent and any number of children; removing a subtree removes all of its descendants.',
      useCases: [
        { area: 'Document hierarchies', description: 'Represent nested elements whose number of children varies.' },
        { area: 'File navigation', description: 'Group directories and files under their parent folders.' },
        { area: 'Organization charts', description: 'Represent reporting relationships with an arbitrary number of direct reports.' },
        { area: 'Scene organization', description: 'Group related objects so parent operations can affect descendants.' },
      ],
      technologies: [
        { name: 'Browser DOM trees', url: 'https://dom.spec.whatwg.org/#trees', usage: 'The DOM defines parent/ordered-child node trees for document structure; unlike this lesson, nodes carry document data rather than numeric keys.' },
        { name: 'Git (directory tree objects)', url: 'https://git-scm.com/book/en/v2/Git-Internals-Git-Objects', usage: 'Represents directory snapshots as tree objects whose named entries reference blobs or subtrees. Stored objects can be shared between snapshots; this lesson shows a single numeric-node hierarchy.' },
      ],
    },
    'unordered-binary-tree': {
      summary: 'Explicit left/right child placement without search-key ordering. This is separate from the existing BST and does not compare keys to choose children.',
      useCases: [
        { area: 'Binary expressions', description: 'Give an arithmetic operator separate left and right operands.' },
        { area: 'Decision processes', description: 'Represent a sequence of two-way choices without ordering values.' },
        { area: 'Hierarchical decomposition', description: 'Split a problem into two recursively defined subproblems.' },
        { area: 'Tree transformations', description: 'Practice child attachment and subtree removal independently of search invariants.' },
      ],
      technologies: [
      ],
    },
    'complete-binary-tree': {
      summary: 'Level-order storage filled left to right, without heap ordering. It allows duplicate values and does not enforce heap order.',
      useCases: [
        { area: 'Binary heap shape', description: 'Keep the complete shape required by an array-backed binary heap; heap ordering is a separate invariant.' },
        { area: 'Implicit indexing', description: 'Derive child and parent positions arithmetically rather than storing pointers.' },
        { area: 'Level-order storage', description: 'Pack a hierarchy into consecutive occupied array positions.' },
        { area: 'Balanced-shape demonstrations', description: 'Study nearly equal depths without imposing a search-key ordering.' },
      ],
      technologies: [
      ],
    },
    'threaded-binary-tree': {
      summary: 'BST child links and predecessor/successor threads for stack-free traversal. Missing child pointers lead to inorder neighbors, with flags distinguishing threads from real children.',
      useCases: [
        { area: 'Sorted iteration', description: 'Find inorder successors without allocating a traversal stack.' },
        { area: 'Reverse iteration', description: 'Use predecessor threads where a left child is absent.' },
        { area: 'Ordered dictionaries', description: 'Retain BST comparisons while linking otherwise empty child positions.' },
        { area: 'Traversal engineering', description: 'Compare tagged thread pointers with parent pointers and recursion.' },
      ],
      technologies: [
      ],
    },
    'splay-tree': {
      summary: 'Accessed keys move to the root through zig, zig-zig, and zig-zag rotations. A single operation can be linear; logarithmic access bounds are amortized.',
      useCases: [
        { area: 'Repeated key access', description: 'Move recently accessed keys near the root.' },
        { area: 'Locality-sensitive dictionaries', description: 'Adapt tree shape to nonuniform access patterns.' },
        { area: 'Split and join', description: 'Expose a boundary at the root before separating or joining ordered sets.' },
        { area: 'Adaptive indexing', description: 'Trade strict per-operation bounds for logarithmic amortized access.' },
      ],
      technologies: [
        { name: 'GCC typed splay trees', url: 'https://gnu.googlesource.com/gcc/+/refs/heads/master/gcc/typed-splay-tree.h', usage: 'GCC supplies typed compiler wrappers around libiberty splay trees for compiler data.' },
      ],
    },
    'treap': {
      summary: 'BST keys and seeded min-heap priorities maintained through rotations. Fixed seeded priorities make playback deterministic; expected bounds assume independent random priorities.',
      useCases: [
        { area: 'Ordered sets', description: 'Combine ordered keys with independent priority ordering.' },
        { area: 'Randomized balancing', description: 'Use rotations to obtain expected shallow trees without deterministic height rules.' },
        { area: 'Split and merge', description: 'Partition by key while preserving a priority heap.' },
        { area: 'Sequence variants', description: 'Implicit-key treap variants use subtree sizes to represent editable sequences.' },
      ],
      technologies: [
      ],
    },
    'cartesian-tree': {
      summary: 'Array order in inorder, minimum values above descendants, and a monotone spine. Inorder traversal recovers array order, while each parent value is no greater than its descendants.',
      useCases: [
        { area: 'Range minima', description: 'Relate an interval minimum to a lowest common ancestor of array positions.' },
        { area: 'Array hierarchy', description: 'Preserve input order in inorder while expressing relative value minima.' },
        { area: 'Monotone-stack processing', description: 'Build Cartesian trees in linear total time using a right-spine stack.' },
        { area: 'Sequence analysis', description: 'Represent nesting around local minima while resolving equal values consistently.' },
      ],
      technologies: [
      ],
    },
    'scapegoat-tree': {
      summary: 'Depth bounds trigger median-based rebuilding of unbalanced subtrees. This alpha=2/3 variant caches subtree sizes and rebuilds after excessive depth or sufficient deletions.',
      useCases: [
        { area: 'Ordered dictionaries', description: 'Keep logarithmic height without node color or level invariants.' },
        { area: 'Rebuild-based balancing', description: 'Repair a heavy subtree with an inorder median rebuild.' },
        { area: 'Amortized updates', description: 'Spread occasional rebuilding work over a long update sequence.' },
        { area: 'Memory tradeoffs', description: 'Compare cached subtree sizes with implementations that count subtrees on demand.' },
      ],
      technologies: [
      ],
    },
    'aa-tree': {
      summary: 'Leveled search nodes repaired with skew and split operations. Levels prohibit horizontal left links and consecutive horizontal right links, repaired by skew and split.',
      useCases: [
        { area: 'Ordered sets', description: 'Maintain sorted unique keys with logarithmic paths.' },
        { area: 'Simplified balancing', description: 'Use levels, skew, and split to encode restricted red-black behavior.' },
        { area: 'Dynamic lookup', description: 'Preserve efficient comparisons across insertions and deletions.' },
        { area: 'Invariant education', description: 'Study horizontal right links and the exclusion of horizontal left links.' },
      ],
      technologies: [
      ],
    },
    'two-three-tree': {
      summary: 'One or two keys per page, bottom-up splits, and equal leaf depths. This lesson provides insertion, exact lookup, and clear, with bottom-up splitting.',
      useCases: [
        { area: 'Multiway search', description: 'Store one or two ordered separators per node.' },
        { area: 'Balanced indexing', description: 'Keep every leaf at the same depth.' },
        { area: 'Upward splitting', description: 'Promote a middle key when insertion creates a temporary three-key page.' },
        { area: 'Tree correspondences', description: 'Study how balanced binary representations relate to multiway nodes.' },
      ],
      technologies: [
      ],
    },
    'two-three-four-tree': {
      summary: 'One to three keys per page, with top-down splitting, borrowing, and merging. It reuses the canonical minimum-degree-two B-tree implementation because these are the same structure.',
      useCases: [
        { area: 'Multiway dictionaries', description: 'Store up to three separators and four child links per page.' },
        { area: 'Top-down insertion', description: 'Split full nodes before descending into them.' },
        { area: 'Deletion repair', description: 'Borrow or merge pages before descending into a minimum-size child.' },
        { area: 'Red-black correspondences', description: 'Relate multi-key nodes to black nodes connected by red links.' },
      ],
      technologies: [
      ],
    },
    'radix-tree': {
      summary: 'Compressed character edges with explicit word ends and path recompression. This character-compressed variant differs from a bitwise Patricia trie.',
      useCases: [
        { area: 'Prefix lookup', description: 'Match several characters on one compressed edge.' },
        { area: 'Compact dictionaries', description: 'Share common word prefixes while removing nonterminal unary paths.' },
        { area: 'Routing variants', description: 'Bitwise Patricia variants index binary prefixes rather than lowercase words.' },
        { area: 'Stream indexes', description: 'Compressed radix variants organize ordered stream identifiers.' },
      ],
      technologies: [
        { name: 'Redis Streams radix indexes', url: 'https://redis.io/docs/latest/develop/data-types/streams/', usage: 'Streams organize identifier-indexed macro nodes in a radix tree; the lesson instead indexes lowercase words.' },
      ],
    },
    'ternary-search-tree': {
      summary: 'Less/equal/greater character branches; only equality advances the word index. Low and high links compare alternatives at the same word position; equal links advance to the next character.',
      useCases: [
        { area: 'Text dictionaries', description: 'Use low/equal/high character branches for exact word membership.' },
        { area: 'Prefix navigation', description: 'Reach a shared character prefix before exploring completions.' },
        { area: 'Sparse alphabets', description: 'Avoid allocating a full alphabet-sized child array in each node.' },
        { area: 'Character comparison', description: 'Separate same-position comparisons from next-position transitions.' },
      ],
      technologies: [
      ],
    },
    'suffix-tree': {
      summary: 'Compressed suffix edges stored as source-text ranges with suffix indices. This lesson uses naive quadratic suffix insertion with a unique terminator, rather than linear-time Ukkonen construction.',
      useCases: [
        { area: 'Substring search', description: 'Find occurrences by matching a pattern along compressed suffix paths.' },
        { area: 'Repeated text analysis', description: 'Shared paths reveal repeated substrings.' },
        { area: 'Sequence indexing', description: 'Index text or biological sequences for pattern matching.' },
        { area: 'String algorithms', description: 'Use descendant suffix positions as building blocks for text analysis.' },
      ],
      technologies: [
      ],
    },
    'interval-tree': {
      summary: 'An unbalanced interval BST augmented with maximum high endpoints. This lesson is an unbalanced augmented BST; balanced interval-tree variants have stronger height guarantees.',
      useCases: [
        { area: 'Schedule conflicts', description: 'Locate an interval overlapping a requested time span.' },
        { area: 'Address ranges', description: 'Find stored memory or file ranges touching a query interval.' },
        { area: 'Genomic intervals', description: 'Locate overlapping coordinate spans on a sequence.' },
        { area: 'Sweep-line indexing', description: 'Keep active intervals and prune branches using maximum endpoints.' },
      ],
      technologies: [
        { name: 'Linux augmented red-black interval trees', url: 'https://www.kernel.org/doc/html/latest/core-api/rbtree.html', usage: 'Kernel interval trees augment balanced red-black nodes with subtree maximum endpoints; this lesson uses an unbalanced BST.' },
      ],
    },
    'order-statistic-tree': {
      summary: 'AVL-balanced keys with cached subtree sizes for rank and selection. This lesson augments an AVL-balanced tree with subtree counts.',
      useCases: [
        { area: 'Ranked dictionaries', description: 'Count keys strictly below a supplied key.' },
        { area: 'Selection', description: 'Retrieve a sorted key by its zero-based position.' },
        { area: 'Dynamic percentiles', description: 'Use rank and selection as primitives for evolving quantiles.' },
        { area: 'Pagination', description: 'Navigate ordered records by position as well as by key.' },
      ],
      technologies: [
        { name: 'Boost.MultiIndex ranked indices', url: 'https://www.boost.org/doc/libs/master/libs/multi_index/doc/reference/rnk_indices.html', usage: 'Ranked ordered-index variants support access by rank and rank calculation. The lesson uses AVL balancing rather than claiming an identical implementation.' },
      ],
    },
    'persistent-segment-tree': {
      summary: 'Immutable path-copy updates, shared branches, and exact sums across versions. Ten fixed indexed values support at most eight immutable versions, including updates from historical roots.',
      useCases: [
        { area: 'Historical queries', description: 'Read exact sums from an earlier array version.' },
        { area: 'Branching edits', description: 'Create a new version from any existing version.' },
        { area: 'Structural sharing', description: 'Reuse unchanged subtrees rather than copying a complete array index.' },
        { area: 'Version comparison', description: 'Retain independent roots while updates allocate only a logarithmic path.' },
      ],
      technologies: [
      ],
    },
    'sparse-table': {
      summary: 'Static power-of-two range minima with constant-time inclusive queries. It belongs to the requested Trees menu but is a static tabular range-query structure, not a node tree.',
      useCases: [
        { area: 'Static range minima', description: 'Answer inclusive minimum queries with two cached intervals.' },
        { area: 'Idempotent queries', description: 'Adapt the overlapping-block approach to maximum or greatest-common-divisor operations.' },
        { area: 'Immutable analytics', description: 'Precompute an array that receives many queries and no point updates.' },
        { area: 'LCA reductions', description: 'Use range-minimum preprocessing as a component of Euler-tour lowest-common-ancestor methods.' },
      ],
      technologies: [
      ],
    },
    'kd-tree': {
      summary: 'An incremental 2D point tree with alternating X/Y split axes. This two-dimensional incremental variant does not rebalance after insertion.',
      useCases: [
        { area: 'Point indexing', description: 'Partition a point set by alternating coordinate axes.' },
        { area: 'Orthogonal range search', description: 'Prune split branches that cannot contain points in a query box.' },
        { area: 'Neighbor-search variants', description: 'Extend point partitioning to nearest-neighbor methods.' },
        { area: 'Spatial data analysis', description: 'Organize low-dimensional coordinates for geometric queries.' },
      ],
      technologies: [
        { name: 'CGAL spatial searching', url: 'https://doc.cgal.org/latest/Spatial_searching/index.html', usage: 'KD-tree variants support spatial range and neighbor searches; production construction policies differ from this incremental lesson.' },
        { name: 'scikit-learn (KDTree neighbor searches)', url: 'https://scikit-learn.org/stable/modules/neighbors.html', usage: 'Uses KDTree for nearest-neighbor and radius queries in learning workflows. Its batch-built, metric-aware index differs from this incremental two-dimensional range-search tree.' },
        { name: 'Point Cloud Library (pcl::KdTree)', url: 'https://pointclouds.org/documentation/classpcl_1_1_kd_tree.html', usage: 'Provides nearest-neighbor and radius searches over point clouds through KD-tree implementations. Production point types and search backends extend beyond the integer 2D example.' },
        { name: 'Apache Lucene 10.3.1 (block KD-tree variant)', url: 'https://lucene.apache.org/core/10_3_1/core/org/apache/lucene/util/bkd/package-summary.html', usage: 'Builds BKD cells containing bounded blocks of multidimensional points for indexed searches. Its block storage and bulk construction differ from this one-point-per-node incremental KD-tree.' },
      ],
    },
    'quadtree': {
      summary: '2D point buckets subdivided into four sparse occupied quadrants. This sparse point-bucket variant uses integer coordinates in [-1024,1024), bucket size two, and depth at most eleven.',
      useCases: [
        { area: '2D point buckets', description: 'Subdivide crowded planar regions at coordinate midpoints.' },
        { area: 'Spatial range queries', description: 'Skip quadrants disjoint from a requested rectangle.' },
        { area: 'Map tiling variants', description: 'Relate recursive quadrants to two-dimensional spatial tiles.' },
        { area: 'Adaptive resolution', description: 'Use finer cells where more points occupy the same region.' },
      ],
      technologies: [
        { name: 'CGAL Quadtree', url: 'https://doc.cgal.org/latest/Orthtree/index.html', usage: 'The Orthtree package provides quadtree variants for point partitioning and spatial searches with configurable refinement.' },
      ],
    },
    'octree': {
      summary: '3D point buckets subdivided into eight sparse occupied octants. This sparse three-dimensional point-bucket variant uses integer coordinates in [-1024,1024) and depth at most eleven.',
      useCases: [
        { area: '3D point clouds', description: 'Subdivide occupied spatial cells across three coordinate axes.' },
        { area: 'Voxel variants', description: 'Represent three-dimensional regions with recursively refined cells.' },
        { area: 'Range filtering', description: 'Prune octants outside an inclusive spatial query box.' },
        { area: 'Adaptive geometry', description: 'Allocate finer subdivisions only where point buckets need them.' },
      ],
      technologies: [
        { name: 'CGAL Octree', url: 'https://doc.cgal.org/latest/Orthtree/index.html', usage: 'The Orthtree package provides octree variants to refine three-dimensional point sets and accelerate spatial queries.' },
        { name: 'OctoMap (occupancy octree variant)', url: 'https://octomap.github.io/octomap/doc/index', usage: 'Stores probabilistic occupied, free, and unknown regions in an octree for 3D robot mapping. This lesson partitions point buckets without occupancy probabilities or sensor updates.' },
      ],
    },
    'bvh': {
      summary: 'A 2D AABB hierarchy with primitive leaves and refitted ancestor bounds. This lesson uses two-dimensional axis-aligned rectangles, least-enlargement insertion, and ancestor refitting without balancing.',
      useCases: [
        { area: 'Intersection pruning', description: 'Reject whole groups when their bounding boxes miss a query.' },
        { area: 'Collision detection', description: 'Reduce candidate primitive pairs using hierarchical bounds.' },
        { area: 'Ray-tracing variants', description: 'Accelerate ray queries against bounded geometric primitives.' },
        { area: 'Geometry selection', description: 'Retrieve spatial records whose primitive bounds intersect a requested region.' },
      ],
      technologies: [
        { name: 'CGAL AABB tree', url: 'https://doc.cgal.org/latest/AABB_tree/', usage: 'A static bounding-box hierarchy accelerates geometric intersection and distance queries; this lesson instead inserts two-dimensional rectangle leaves incrementally.' },
        { name: 'MoveIt / FCL (collision hierarchy and AABBs)', url: 'https://moveit.ai/documentation/concepts/developer_concepts/', usage: 'Maintains collision-manager trees and cached axis-aligned bounds to prune robot/world overlap candidates before narrow-phase tests. Its moving 3D geometry differs from this unbalanced 2D rectangle hierarchy.' },
      ],
    },
    'merkle-tree': {
      summary: 'SHA-256 leaf and parent hashes with path updates and inclusion proofs. The lesson uses SHA-256 with distinct leaf/parent prefixes, ten integer data leaves, and six empty-byte padding leaves; its shape differs from Certificate Transparency trees.',
      useCases: [
        { area: 'Integrity checks', description: 'Commit an entire ordered dataset to one root digest.' },
        { area: 'Inclusion proofs', description: 'Verify one leaf using a logarithmic sequence of sibling hashes.' },
        { area: 'Change localization', description: 'An edited leaf changes only its ancestor hash path.' },
        { area: 'Transparency protocols', description: 'Merkle variants support verifiable append-only log protocols.' },
      ],
      technologies: [
        { name: 'Certificate Transparency Merkle hash trees', url: 'https://www.rfc-editor.org/rfc/rfc9162.html#section-2.1', usage: 'The transparency-log protocol defines Merkle hashing and inclusion proofs. Its unpadded log-tree shape differs from this padded fixed-size lesson.' },
      ],
    },
    'van-emde-boas-tree': {
      summary: 'Recursive integer universes, min/max, clusters, and occupied-cluster summaries. This sparse lazy-allocation variant restricts keys to 0..255 and displays local cluster keys.',
      useCases: [
        { area: 'Integer sets', description: 'Track bounded integer keys with recursive universe decomposition.' },
        { area: 'Successor queries', description: 'Find the next larger occupied integer without scanning the universe.' },
        { area: 'Priority structures', description: 'Use a minimum field and integer successor operations as ordered-set primitives.' },
        { area: 'Universe-sensitive analysis', description: 'Compare log-log-universe recursion with comparison-based search trees.' },
      ],
      technologies: [
      ],
    },
  } satisfies Record<string, StructureOverview>
}
