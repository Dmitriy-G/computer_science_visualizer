import type { StructureDefinition } from './StructureCatalog.ts'
export class ExtendedTreeDefinitions {
  public static readonly structures: readonly StructureDefinition[] = [
    { kind: 'general-tree', group: 'trees', name: 'General Tree (N-ary Tree)', description: 'Nodes with any number of ordered children and no search-key ordering', symbol: 'T' },
    { kind: 'unordered-binary-tree', group: 'trees', name: 'Binary Tree', description: 'Explicit left/right child placement without search-key ordering', symbol: 'T' },
    { kind: 'complete-binary-tree', group: 'trees', name: 'Complete Binary Tree', description: 'Level-order storage filled left to right, without heap ordering', symbol: 'T' },
    { kind: 'threaded-binary-tree', group: 'trees', name: 'Threaded Binary Tree', description: 'BST child links and predecessor/successor threads for stack-free traversal', symbol: 'T' },
    { kind: 'splay-tree', group: 'trees', name: 'Splay Tree', description: 'Accessed keys move to the root through zig, zig-zig, and zig-zag rotations', symbol: 'T' },
    { kind: 'treap', group: 'trees', name: 'Treap', description: 'BST keys and seeded min-heap priorities maintained through rotations', symbol: 'T' },
    { kind: 'cartesian-tree', group: 'trees', name: 'Cartesian Tree', description: 'Array order in inorder, minimum values above descendants, and a monotone spine', symbol: 'T' },
    { kind: 'scapegoat-tree', group: 'trees', name: 'Scapegoat Tree', description: 'Depth bounds trigger median-based rebuilding of unbalanced subtrees', symbol: 'T' },
    { kind: 'aa-tree', group: 'trees', name: 'AA Tree', description: 'Leveled search nodes repaired with skew and split operations', symbol: 'T' },
    { kind: 'two-three-tree', group: 'trees', name: '2-3 Tree', description: 'One or two keys per page, bottom-up splits, and equal leaf depths', symbol: 'T' },
    { kind: 'two-three-four-tree', group: 'trees', name: '2-3-4 Tree', description: 'One to three keys per page, with top-down splitting, borrowing, and merging', symbol: 'T' },
    { kind: 'radix-tree', group: 'string-text', name: 'Radix Tree (Patricia Trie)', description: 'Compressed character edges with explicit word ends and path recompression', symbol: 'T' },
    { kind: 'ternary-search-tree', group: 'string-text', name: 'Ternary Search Tree', description: 'Less/equal/greater character branches; only equality advances the word index', symbol: 'T' },
    { kind: 'suffix-tree', group: 'string-text', name: 'Suffix Tree', description: 'Compressed suffix edges stored as source-text ranges with suffix indices', symbol: 'T' },
    { kind: 'interval-tree', group: 'trees', name: 'Interval Tree', description: 'An unbalanced interval BST augmented with maximum high endpoints', symbol: 'T' },
    { kind: 'order-statistic-tree', group: 'trees', name: 'Order Statistic Tree', description: 'AVL-balanced keys with cached subtree sizes for rank and selection', symbol: 'T' },
    { kind: 'persistent-segment-tree', group: 'trees', name: 'Persistent Segment Tree', description: 'Immutable path-copy updates, shared branches, and exact sums across versions', symbol: 'T' },
    { kind: 'sparse-table', group: 'trees', name: 'Sparse Table', description: 'Static power-of-two range minima with constant-time inclusive queries', symbol: 'T' },
    { kind: 'kd-tree', group: 'trees', name: 'KD-Tree', description: 'An incremental 2D point tree with alternating X/Y split axes', symbol: 'T' },
    { kind: 'quadtree', group: 'trees', name: 'Quadtree', description: '2D point buckets subdivided into four sparse occupied quadrants', symbol: 'T' },
    { kind: 'octree', group: 'trees', name: 'Octree', description: '3D point buckets subdivided into eight sparse occupied octants', symbol: 'T' },
    { kind: 'bvh', group: 'trees', name: 'Bounding Volume Hierarchy (BVH)', description: 'A 2D AABB hierarchy with primitive leaves and refitted ancestor bounds', symbol: 'T' },
    { kind: 'merkle-tree', group: 'trees', name: 'Merkle Tree', description: 'SHA-256 leaf and parent hashes with path updates and inclusion proofs', symbol: 'T' },
    { kind: 'van-emde-boas-tree', group: 'trees', name: 'Van Emde Boas Tree', description: 'Recursive integer universes, min/max, clusters, and occupied-cluster summaries', symbol: 'T' },
  ]
}
