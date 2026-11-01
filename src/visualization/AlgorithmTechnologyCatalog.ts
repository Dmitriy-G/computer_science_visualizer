import { ActionCatalog } from './ActionCatalog.ts'
import type { ActionKind, ActionScope } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'
import type { AlgorithmUsage } from './AlgorithmInformation.ts'

// Only algorithm scopes receive real-world examples. Overview operations do not.
export class AlgorithmTechnologyCatalog {
  private static readonly uses: Readonly<Partial<Record<ActionKind, AlgorithmUsage>>> = {
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
