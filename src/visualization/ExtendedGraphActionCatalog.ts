import type { ActionChoice } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'

export class ExtendedGraphActionCatalog {
  public static getActions(kind: StructureKind): readonly ActionChoice[] | null {
    switch (kind) {
      case 'bipartite-graph': return [
        { kind: 'add-vertex', title: 'Add a partitioned vertex', description: 'Place a new vertex explicitly in partition L (0) or R (1).' },
        { kind: 'add-edge', title: 'Add a cross-partition edge', description: 'Connect L to R; reject same-side edges and self-loops.' },
        { kind: 'remove-edge', title: 'Remove edge by ID', description: 'Remove one stable edge number and repair storage.' },
        { kind: 'delete-value', title: 'Delete vertex', description: 'Remove a vertex and repair every incident storage entry.' },
        { kind: 'search-value', title: 'Search by value', description: 'Scan registered vertex values and stop at the matching vertex.' },
        { kind: 'clear', title: 'Clear', description: 'Release vertices and their stored edges while retaining the ID counters.' },
        { kind: 'breadth-first', title: 'Breadth-first traversal', description: 'Visit reachable vertices in queue order from a chosen start.' },
        { kind: 'depth-first', title: 'Depth-first traversal', description: 'Visit reachable vertices recursively before backtracking.' },
      ]
      case 'complete-graph': return [
        { kind: 'add-vertex', title: 'Add a fully connected vertex', description: 'Add a new vertex and connect it atomically to every existing vertex.' },
        { kind: 'delete-value', title: 'Delete vertex', description: 'Remove a vertex and repair every incident storage entry.' },
        { kind: 'search-value', title: 'Search by value', description: 'Scan registered vertex values and stop at the matching vertex.' },
        { kind: 'clear', title: 'Clear', description: 'Release vertices and their stored edges while retaining the ID counters.' },
        { kind: 'breadth-first', title: 'Breadth-first traversal', description: 'Visit reachable vertices in queue order from a chosen start.' },
        { kind: 'depth-first', title: 'Depth-first traversal', description: 'Visit reachable vertices recursively before backtracking.' },
      ]
      case 'tree-graph': return [
        { kind: 'add-vertex', title: 'Attach a leaf', description: 'Add a new vertex with exactly one existing parent; the first vertex names itself.' },
        { kind: 'delete-value', title: 'Delete a leaf', description: 'Reject non-leaf deletion so the surviving graph stays connected and acyclic.' },
        { kind: 'search-value', title: 'Search by value', description: 'Scan registered vertex values and stop at the matching vertex.' },
        { kind: 'clear', title: 'Clear', description: 'Release vertices and their stored edges while retaining the ID counters.' },
        { kind: 'breadth-first', title: 'Breadth-first traversal', description: 'Visit reachable vertices in queue order from a chosen start.' },
        { kind: 'depth-first', title: 'Depth-first traversal', description: 'Visit reachable vertices recursively before backtracking.' },
      ]
      case 'hypergraph': return [
        { kind: 'add-vertex', title: 'Add vertex', description: 'Register a unique integer vertex and allocate its storage.' },
        { kind: 'add-edge', title: 'Add a hyperedge', description: 'Collect 2–16 distinct existing vertex values into one incidence set.' },
        { kind: 'remove-edge', title: 'Remove a hyperedge by ID', description: 'Remove one hyperedge and all of its incidence links.' },
        { kind: 'delete-value', title: 'Delete vertex', description: 'Shrink incident hyperedges, dropping small or duplicate sets while keeping the first ID.' },
        { kind: 'search-value', title: 'Search by value', description: 'Scan registered vertex values and stop at the matching vertex.' },
        { kind: 'clear', title: 'Clear', description: 'Release vertices and repair their hyperedge incidences.' },
        { kind: 'breadth-first', title: 'Breadth-first traversal', description: 'Visit reachable vertices in queue order from a chosen start.' },
        { kind: 'depth-first', title: 'Depth-first traversal', description: 'Visit reachable vertices recursively before backtracking.' },
      ]
      case 'flow-network': return [
        { kind: 'add-vertex', title: 'Add vertex', description: 'Register a unique integer vertex and allocate its storage.' },
        { kind: 'add-edge', title: 'Add a capacity edge', description: 'Store a directed nonnegative capacity; editing resets all flows.' },
        { kind: 'remove-edge', title: 'Remove edge by ID', description: 'Remove one stable edge number and repair storage.' },
        { kind: 'update-capacity', title: 'Update a capacity', description: 'Replace one edge capacity and reset all existing flows.' },
        { kind: 'delete-value', title: 'Delete vertex', description: 'Remove a vertex and repair every incident storage entry.' },
        { kind: 'search-value', title: 'Search by value', description: 'Scan registered vertex values and stop at the matching vertex.' },
        { kind: 'clear', title: 'Clear', description: 'Release vertices and their stored edges while retaining the ID counters.' },
        { kind: 'breadth-first', title: 'Breadth-first traversal', description: 'Visit reachable vertices in queue order from a chosen start.' },
        { kind: 'depth-first', title: 'Depth-first traversal', description: 'Visit reachable vertices recursively before backtracking.' },
        { kind: 'max-flow', title: 'Edmonds–Karp maximum flow', description: 'Reset flow, find residual paths with BFS, and augment until no source-to-sink path remains.' },
      ]
      case 'functional-graph': return [
        { kind: 'add-vertex', title: 'Add a vertex / successor', description: 'Add a vertex and its one outgoing successor, possibly itself.' },
        { kind: 'add-edge', title: 'Set successor', description: 'Replace the existing outgoing target while retaining its edge ID.' },
        { kind: 'read-successor', title: 'Read successor', description: 'Follow the one outgoing edge and return its target value.' },
        { kind: 'delete-value', title: 'Delete vertex', description: 'Redirect surviving predecessors to themselves, then remove the vertex.' },
        { kind: 'search-value', title: 'Search by value', description: 'Scan registered vertex values and stop at the matching vertex.' },
        { kind: 'clear', title: 'Clear', description: 'Release vertices and their stored edges while retaining the ID counters.' },
        { kind: 'breadth-first', title: 'Breadth-first traversal', description: 'Visit reachable vertices in queue order from a chosen start.' },
        { kind: 'depth-first', title: 'Depth-first traversal', description: 'Visit reachable vertices recursively before backtracking.' },
      ]
      case 'adjacency-matrix': return [
        { kind: 'add-vertex', title: 'Add vertex / matrix row', description: 'Add one row and one column of zero cells.' },
        { kind: 'add-edge', title: 'Set a matrix cell', description: 'Store a directed edge by writing its source-row / target-column cell.' },
        { kind: 'remove-edge', title: 'Remove edge by ID', description: 'Scan for the stable edge ID and zero its matrix cell.' },
        { kind: 'delete-value', title: 'Delete vertex / row / column', description: 'Remove its row and column, shifting matrix indices but preserving IDs.' },
        { kind: 'search-value', title: 'Search by value', description: 'Scan registered vertex values and stop at the matching vertex.' },
        { kind: 'inspect-storage', title: 'Inspect matrix cells', description: 'Scan rows and columns to distinguish stored edges from zero cells.' },
        { kind: 'clear', title: 'Clear', description: 'Remove rows and columns until the matrix is empty.' },
        { kind: 'breadth-first', title: 'Breadth-first traversal', description: 'Visit reachable vertices in queue order from a chosen start.' },
        { kind: 'depth-first', title: 'Depth-first traversal', description: 'Visit reachable vertices recursively before backtracking.' },
      ]
      case 'adjacency-list': return [
        { kind: 'add-vertex', title: 'Add vertex', description: 'Register a unique integer vertex and allocate its storage.' },
        { kind: 'add-edge', title: 'Append an adjacency entry', description: 'Check one source row for duplicates and append the target record.' },
        { kind: 'remove-edge', title: 'Remove edge by ID', description: 'Remove one stable edge number and repair storage.' },
        { kind: 'delete-value', title: 'Delete vertex', description: 'Remove a vertex and repair every incident storage entry.' },
        { kind: 'search-value', title: 'Search by value', description: 'Scan registered vertex values and stop at the matching vertex.' },
        { kind: 'inspect-storage', title: 'Inspect adjacency rows', description: 'Read each vertex head and follow its outgoing records.' },
        { kind: 'clear', title: 'Clear', description: 'Release vertices and their stored edges while retaining the ID counters.' },
        { kind: 'breadth-first', title: 'Breadth-first traversal', description: 'Visit reachable vertices in queue order from a chosen start.' },
        { kind: 'depth-first', title: 'Depth-first traversal', description: 'Visit reachable vertices recursively before backtracking.' },
      ]
      case 'edge-list': return [
        { kind: 'add-vertex', title: 'Add vertex', description: 'Register a unique integer vertex and allocate its storage.' },
        { kind: 'add-edge', title: 'Add edge', description: 'Connect existing endpoint values in canonical storage.' },
        { kind: 'remove-edge', title: 'Remove edge by ID', description: 'Remove one stable edge number and repair storage.' },
        { kind: 'delete-value', title: 'Delete vertex', description: 'Remove a vertex and repair every incident storage entry.' },
        { kind: 'search-value', title: 'Search by value', description: 'Scan registered vertex values and stop at the matching vertex.' },
        { kind: 'inspect-storage', title: 'Inspect edge records', description: 'Read the canonical source/target records in their array order.' },
        { kind: 'clear', title: 'Clear', description: 'Release vertices and their stored edges while retaining the ID counters.' },
        { kind: 'breadth-first', title: 'Breadth-first traversal', description: 'Visit reachable vertices in queue order from a chosen start.' },
        { kind: 'depth-first', title: 'Depth-first traversal', description: 'Visit reachable vertices recursively before backtracking.' },
      ]
      case 'compressed-sparse-row': return [
        { kind: 'add-vertex', title: 'Add vertex', description: 'Register a unique integer vertex and allocate its storage.' },
        { kind: 'add-edge', title: 'Insert a packed edge', description: 'Insert the sorted target column and update every later row offset.' },
        { kind: 'remove-edge', title: 'Remove a packed edge', description: 'Compact the column and ID arrays, then decrement later offsets.' },
        { kind: 'delete-value', title: 'Delete vertex / CSR row', description: 'Rebuild packed storage without the row or incoming column; remap later columns.' },
        { kind: 'search-value', title: 'Search by value', description: 'Scan registered vertex values and stop at the matching vertex.' },
        { kind: 'inspect-storage', title: 'Inspect CSR arrays', description: 'Read offsets and the sorted column ranges for each source row.' },
        { kind: 'clear', title: 'Clear', description: 'Release vertices and their stored edges while retaining the ID counters.' },
        { kind: 'breadth-first', title: 'Breadth-first traversal', description: 'Visit reachable vertices in queue order from a chosen start.' },
        { kind: 'depth-first', title: 'Depth-first traversal', description: 'Visit reachable vertices recursively before backtracking.' },
      ]
      default: return null
    }
  }
}
