import type { StructureOverview } from './StructureInformation.ts'

export class ExtendedGraphStructureInformation {
  public static readonly overviews = {
    'bipartite-graph': {
      summary: 'A Bipartite Graph splits vertices into two disjoint sets, with edges crossing between them. This undirected example assigns fixed L/R partitions and rejects same-side edges.',
      useCases: [
        { area: 'Assignments', description: 'Represent compatibility between workers and jobs.' },
        { area: 'Recommendations', description: 'Connect users to items without mixing the two entity types.' },
        { area: 'Matching', description: 'Find disjoint compatible pairs across two sets.' },
        { area: 'Incidence modeling', description: 'Connect objects to the groups that contain them.' },
      ],
      technologies: [{ name: 'NetworkX bipartite algorithms', url: 'https://networkx.org/documentation/stable/reference/algorithms/bipartite.html', usage: 'Analyzes bipartite networks using ordinary graph objects and partition attributes. This example enforces partitions during editing.' }],
    },
    'complete-graph': {
      summary: 'A Complete Graph connects every distinct pair of vertices, giving V(V - 1)/2 undirected edges. This simple unweighted example maintains all required edges automatically when a vertex is added or removed.',
      useCases: [
        { area: 'Pairwise comparisons', description: 'Represent every possible comparison among a collection of items.' },
        { area: 'Dense graph baselines', description: 'Compare algorithms against the maximum simple undirected edge count.' },
        { area: 'All-to-all connectivity', description: 'Model a system in which each participant can contact every other participant directly.' },
        { area: 'Clique analysis', description: 'Describe the fully connected subgraphs sought in larger networks.' },
      ],
      technologies: [{ name: 'NetworkX complete_graph', url: 'https://networkx.org/documentation/stable/reference/generated/networkx.generators.classic.complete_graph.html', usage: 'Constructs complete graphs within the graph-analysis library; its generator also supports directed variants.' }],
    },
    'tree-graph': {
      summary: 'A Tree Graph is a connected undirected graph without cycles, with V - 1 edges when nonempty. This general tree has no search-key ordering: edits attach new leaves and delete only leaves.',
      useCases: [
        { area: 'Network backbones', description: 'Connect all vertices without redundant cycles.' },
        { area: 'Hierarchies', description: 'Represent parent-child relationships after choosing a root.' },
        { area: 'Unique routes', description: 'Model connections with exactly one simple path between each pair.' },
        { area: 'Spanning trees', description: 'Represent the cycle-free connected result of a spanning-tree algorithm.' },
      ],
      technologies: [{ name: 'NetworkX spanning trees', url: 'https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.tree.mst.minimum_spanning_tree.html', usage: 'Returns a minimum spanning tree for a connected undirected graph, or a forest for disconnected input. This example edits an unweighted single tree directly.' }],
    },
    'hypergraph': {
      summary: 'A Hypergraph allows one hyperedge to contain several vertices. This unweighted example stores distinct sets of 2–16 members and draws square H incidence nodes; deletion shrinks sets, drops sets smaller than two, and coalesces duplicates.',
      useCases: [
        { area: 'Group interactions', description: 'Represent one interaction involving several participants together.' },
        { area: 'Document membership', description: 'Connect documents through shared multi-member term or topic sets.' },
        { area: 'Collaboration', description: 'Represent each collaboration as one group rather than a collection of pairwise links.' },
        { area: 'Set incidence', description: 'Explore which objects belong to which overlapping sets.' },
      ],
      technologies: [{ name: 'HyperNetX', url: 'https://hypernetx.readthedocs.io/en/latest/classes/classes.html', usage: 'Provides hypergraph objects with incidence data, node and edge properties, and weighted variants beyond this restricted unweighted model.' }],
    },
    'flow-network': {
      summary: 'A Flow Network assigns capacities to directed edges and conserves flow at intermediate vertices. This example computes Edmonds–Karp maximum flow with exact integer arithmetic; valid graph edits reset flows, and reverse residual arcs can cancel earlier flow.',
      useCases: [
        { area: 'Throughput planning', description: 'Find the maximum amount that can move between a source and a sink.' },
        { area: 'Bottleneck analysis', description: 'Relate saturated capacity constraints to source-to-sink cuts.' },
        { area: 'Allocation', description: 'Encode limited supplies and demands as capacities.' },
        { area: 'Matching reductions', description: 'Express unit-capacity matching problems as network flow.' },
      ],
      technologies: [{ name: 'NetworkX Edmonds–Karp', url: 'https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.flow.edmonds_karp.html', usage: 'Computes single-commodity maximum flow using BFS-selected residual augmenting paths. NetworkX supports additional residual-network and capacity conventions.' }],
    },
    'functional-graph': {
      summary: 'A Functional Graph has exactly one outgoing edge per vertex, so each component contains a directed cycle with paths feeding into it. This example replaces successors in place and redirects surviving predecessors to themselves when their successor is deleted; no concrete production use of this exact editable model has been verified here.',
      useCases: [
        { area: 'Repeated function application', description: 'Follow a finite mapping from one state to its next state.' },
        { area: 'Cycle detection', description: 'Distinguish the path into a cycle from the cycle itself.' },
        { area: 'Deterministic transitions', description: 'Model systems where every state has one next state.' },
        { area: 'Successor queries', description: 'Study repeated jumps through a fixed successor relation.' },
      ],
      technologies: [],
    },
    'adjacency-matrix': {
      summary: 'An Adjacency Matrix stores a source row and target column for every possible vertex pair. This directed unweighted model uses an actual square matrix of edge records or empty cells and displays their 1/0 occupancy beside the graph.',
      useCases: [
        { area: 'Dense graphs', description: 'Store graphs where many possible endpoint pairs are present.' },
        { area: 'Edge membership', description: 'Check a pair directly through its matrix cell.' },
        { area: 'Matrix algorithms', description: 'Express graph relationships through algebraic operations.' },
        { area: 'Connectivity inspection', description: 'Compare outgoing rows and incoming columns.' },
      ],
      technologies: [{ name: 'NetworkX / NumPy adjacency arrays', url: 'https://networkx.org/documentation/stable/reference/generated/networkx.convert_matrix.to_numpy_array.html', usage: 'Converts graph adjacency to a dense NumPy array, including weighted and multigraph aggregation variants. This visualization stores binary occupancy with separate stable edge IDs.' }],
    },
    'adjacency-list': {
      summary: 'An Adjacency List groups outgoing edges by source vertex. This directed unweighted model stores a Map of per-vertex arrays and draws those rows beside the graph; the row connectors illustrate array order rather than pointer-linked storage.',
      useCases: [
        { area: 'Sparse networks', description: 'Store only existing edges instead of every possible pair.' },
        { area: 'Neighbor traversal', description: 'Visit one vertex’s outgoing entries without scanning unrelated edges.' },
        { area: 'Reachability', description: 'Supply neighbors to breadth-first and depth-first traversal.' },
        { area: 'Incremental editing', description: 'Add an outgoing record to a selected source row.' },
      ],
      technologies: [{ name: 'NetworkX DiGraph adjacency', url: 'https://networkx.org/documentation/stable/reference/classes/digraph.html', usage: 'Stores directed adjacency through nested dictionaries. That dictionary-based variant differs from the per-source arrays used here.' }],
    },
    'edge-list': {
      summary: 'An Edge List stores individual source/target records in an array. This directed unweighted example keeps a separate vertex registry so isolated vertices survive even when they have no edge records.',
      useCases: [
        { area: 'Graph exchange', description: 'Represent connections as simple endpoint records for transfer or import.' },
        { area: 'Edge processing', description: 'Scan all connections without first choosing a source vertex.' },
        { area: 'Batch transformations', description: 'Filter and rewrite complete edge-record collections.' },
        { area: 'Storage comparison', description: 'Contrast compact records with the extra scanning required for neighbor lookup.' },
      ],
      technologies: [{ name: 'NetworkX edge-list I/O', url: 'https://networkx.org/documentation/stable/reference/readwrite/edgelist.html', usage: 'Reads and writes endpoint records with optional edge data. Its plain edge-list file format cannot retain isolated vertices; this model uses a separate registry.' }],
    },
    'compressed-sparse-row': {
      summary: 'Compressed Sparse Row (CSR) packs neighbors into a column-index array and uses V + 1 offsets to delimit each source row. This directed binary example keeps columns sorted, treats every stored value as 1, and preserves edge IDs in a parallel array as edits shift packed entries.',
      useCases: [
        { area: 'Sparse matrix storage', description: 'Avoid allocating cells for absent graph edges.' },
        { area: 'Sequential neighbor access', description: 'Read one source row as a contiguous range of packed entries.' },
        { area: 'Graph computation', description: 'Expose a sparse adjacency matrix to row-oriented algorithms.' },
        { area: 'Storage locality', description: 'Group outgoing column indices while making insertion and offset-update costs visible.' },
      ],
      technologies: [{ name: 'SciPy CSR matrices', url: 'https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csr_matrix.html', usage: 'Represents sparse matrices with data, indices, and indptr arrays. This binary graph omits an explicit data array because every stored value is 1.' }],
    },
  } satisfies Record<string, StructureOverview>
}
