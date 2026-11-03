import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Graph } from '../src/components/DataStructuresOverview/Graphs/SimpleGraph/Graph.ts'
import { DirectedGraph } from '../src/components/DataStructuresOverview/Graphs/DirectedGraph/DirectedGraph.ts'
import { WeightedGraph } from '../src/components/DataStructuresOverview/Graphs/WeightedGraph/WeightedGraph.ts'
import { DAG } from '../src/components/DataStructuresOverview/Graphs/DAG/DAG.ts'
import { Multigraph } from '../src/components/DataStructuresOverview/Graphs/Multigraph/Multigraph.ts'
import { GraphCatalog } from '../src/visualization/GraphCatalog.ts'
import { GraphSceneLayout } from '../src/visualization/GraphSceneLayout.ts'
import { GraphAnimation } from '../src/visualization/GraphAnimation.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'

class GraphFixtures {
  static create(Model, values, edges) {
    const model = new Model()
    const vertices = values.map((value) => model.addVertex(value))
    for (const [from, to, weight = 1] of edges) model.connect(vertices[from].id, vertices[to].id, weight)
    return model
  }

  static snapshot(model) { return JSON.stringify({ vertices: model.getEntries(), edges: model.getEdges() }) }

  static context(model) { return { vertices: model.getEntries().map((entry) => entry.value), edges: model.getEdges().map((edge) => edge.number) } }

  static plan(model, action, input = {}) { return new GraphAnimation(model, new GraphSceneLayout(), action, input, action, action) }
}

test('original graph choices remain available alongside representation and applied graph entries', () => {
  const graphs = StructureCatalog.getStructures('graphs')
  assert.equal(StructureCatalog.getName('graph'), 'Undirected Graph')
  assert.deepEqual(graphs.map((graph) => graph.kind).sort(), ['address-space-graph', 'compacted-de-bruijn-graph', 'hnsw-graph', 'adjacency-list', 'adjacency-matrix', 'bipartite-graph', 'complete-graph', 'compressed-sparse-row', 'dag', 'directed-graph', 'edge-list', 'flow-network', 'functional-graph', 'graph', 'hypergraph', 'multigraph', 'tree-graph', 'weighted-graph'].sort())
  for (const [kind, model] of GraphCatalog.createModels()) {
    assert.equal(model.kind, kind)
    assert.equal(model.length, 10)
    assert.equal(new Set(model.getEntries().map((entry) => entry.value)).size, 10)
    assert.equal(StructureInformation.get(kind).useCases.length, 4)
    assert.ok(StructureInformation.get(kind).technologies.every((entry) => entry.url.startsWith('https://') && entry.usage.length > 20))
  }
  assert.equal(ActionCatalog.getActions('graph').some((action) => action.kind === 'topological-sort'), false)
  assert.equal(ActionCatalog.getActions('directed-graph').some((action) => action.kind === 'shortest-path'), false)
})

test('edge direction, duplicate suppression, self-loops, and parallel identities differ by variant', () => {
  for (const Model of [Graph, DirectedGraph, WeightedGraph, Multigraph]) {
    const graph = GraphFixtures.create(Model, [1, 2], [[0, 1]])
    const [a, b] = graph.getEntries()
    assert.deepEqual(a.neighborIds, [b.id])
    assert.deepEqual(b.neighborIds, graph.directed ? [] : [a.id])
    graph.connect(a.id, b.id)
    assert.equal(graph.edgeCount, Model === Multigraph ? 2 : 1)
    graph.connect(b.id, a.id)
    assert.equal(graph.edgeCount, Model === Multigraph ? 3 : Model === DirectedGraph ? 2 : 1)
    graph.connect(a.id, a.id)
    assert.ok(graph.getEntries()[0].neighborIds.includes(a.id))
    const before = GraphFixtures.snapshot(graph)
    assert.throws(() => graph.connect(a.id, 'missing'), /exist/)
    assert.equal(GraphFixtures.snapshot(graph), before)
  }
  const multi = GraphFixtures.create(Multigraph, [1, 2], [[0, 1], [0, 1], [0, 0]])
  const original = multi.getEdges()
  const clone = multi.clone()
  clone.execute('remove-edge', { edge: original[0].number })
  assert.deepEqual(clone.getEdges().map((edge) => edge.id), original.slice(1).map((edge) => edge.id))
  assert.deepEqual(clone.getEntries()[0].neighborIds, multi.getEntries()[0].neighborIds)
  assert.equal(multi.edgeCount, 3)
})

test('BFS and DFS visit only reachable vertices in deterministic order and search restarts components', () => {
  const graph = GraphFixtures.create(DirectedGraph, [1, 2, 3, 4, 5, 6], [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4]])
  const before = GraphFixtures.snapshot(graph)
  assert.equal(graph.execute('breadth-first', { start: 1 }).code, 'return [1, 2, 3, 4, 5]')
  assert.equal(graph.execute('depth-first', { start: 1 }).code, 'return [1, 2, 3, 4, 5]')
  assert.equal(graph.execute('breadth-first', { start: 5 }).code, 'return [5]')
  assert.equal(graph.execute('search-value', { value: 6 }).code, 'return true')
  assert.equal(graph.execute('search-value', { value: -1 }).code, 'return false')
  assert.equal(GraphFixtures.snapshot(graph), before)
  const branching = GraphFixtures.create(Graph, [1, 2, 3, 4], [[0, 1], [0, 2], [1, 3]])
  assert.equal(branching.execute('breadth-first', { start: 1 }).code, 'return [1, 2, 3, 4]')
  assert.equal(branching.execute('depth-first', { start: 1 }).code, 'return [1, 2, 4, 3]')
})

test('DAG rejects cycles atomically and topological order covers disconnected vertices', () => {
  const graph = GraphFixtures.create(DAG, [1, 2, 3, 4], [[0, 1], [1, 2]])
  const before = GraphFixtures.snapshot(graph)
  const vertices = graph.getEntries()
  assert.throws(() => graph.connect(vertices[2].id, vertices[0].id), /cycle/)
  assert.throws(() => graph.connect(vertices[0].id, vertices[0].id), /cycle/)
  const plan = GraphFixtures.plan(graph, 'add-edge', { from: 3, to: 1 })
  assert.match(plan.steps.at(-1).code, /throw Error.*cycle/)
  assert.equal(GraphFixtures.snapshot(plan.result), before)
  assert.equal(GraphFixtures.snapshot(graph), before)
  graph.connect(vertices[2].id, vertices[3].id)
  assert.equal(graph.getEdges().at(-1).number, 2, 'Rejected edges do not consume IDs')
  assert.equal(graph.execute('topological-sort', {}).code, 'return [1, 2, 3, 4]')
  const defaultGraph = DAG.createDefault()
  const returned = defaultGraph.execute('topological-sort', {}).code.slice(7)
  const order = JSON.parse(returned)
  const values = new Map(defaultGraph.getEntries().map((entry) => [entry.id, entry.value]))
  for (const edge of defaultGraph.getEdges()) assert.ok(order.indexOf(values.get(edge.from)) < order.indexOf(values.get(edge.to)))
  assert.equal(new DAG().execute('topological-sort', {}).code, 'return []')
})

test('Dijkstra reports actual weighted paths, zero costs, unreachable targets, and exact large sums', () => {
  const graph = WeightedGraph.createDefault()
  const before = GraphFixtures.snapshot(graph)
  assert.equal(graph.execute('shortest-path', { from: 10, to: 50 }).code, 'return { distance: 20, path: [10, 30, 60, 50] }')
  assert.equal(graph.execute('shortest-path', { from: 10, to: 10 }).code, 'return { distance: 0, path: [10] }')
  assert.equal(GraphFixtures.snapshot(graph), before)
  const large = GraphFixtures.create(WeightedGraph, [1, 2, 3, 4], [[0, 1, Number.MAX_SAFE_INTEGER], [1, 2, Number.MAX_SAFE_INTEGER]])
  assert.equal(large.execute('shortest-path', { from: 1, to: 3 }).code, 'return { distance: 18014398509481982, path: [1, 2, 3] }')
  assert.equal(large.execute('shortest-path', { from: 1, to: 4 }).code, 'return { distance: Infinity, path: [] }')
  large.execute('update-weight', { edge: 0, weight: 0 })
  large.execute('update-weight', { edge: 1, weight: 0 })
  assert.equal(large.execute('shortest-path', { from: 1, to: 3 }).code, 'return { distance: 0, path: [1, 2, 3] }')
  const saved = GraphFixtures.snapshot(large)
  for (const weight of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(large.execute('update-weight', { edge: 0, weight }).error, true)
    assert.equal(GraphFixtures.snapshot(large), saved)
  }
})

test('deleting a vertex detaches every incidence and clear retains stable counters for reuse', () => {
  for (const Model of [Graph, DirectedGraph, WeightedGraph, DAG, Multigraph]) {
    const edges = Model === DAG ? [[0, 1], [1, 2], [3, 1]] : [[0, 1], [1, 2], [3, 1], [1, 1], [0, 1]]
    const graph = GraphFixtures.create(Model, [1, 2, 3, 4], edges)
    const snapshot = GraphFixtures.snapshot(graph)
    const clone = graph.clone()
    assert.equal(clone.execute('delete-value', { value: 2 }).code, 'return true')
    assert.equal(clone.edgeCount, 0)
    assert.ok(clone.getEntries().every((entry) => entry.neighborIds.length === 0))
    assert.equal(GraphFixtures.snapshot(graph), snapshot)
    const lastNumber = graph.getEdges().at(-1).number
    graph.clear()
    assert.equal(graph.length, 0)
    assert.equal(graph.edgeCount, 0)
    const a = graph.addVertex(5)
    const b = graph.addVertex(6)
    assert.match(a.id, /-4$/)
    graph.connect(a.id, b.id)
    assert.equal(graph.getEdges()[0].number, lastNumber + 1)
  }
})

test('graph input validates current endpoints, edge IDs, uniqueness, safe integers, and empty states', () => {
  const graph = WeightedGraph.createDefault()
  const context = GraphFixtures.context(graph)
  const request = ActionInputRequest.create('weighted-graph', 'add-edge', graph.length, context).structured
  assert.deepEqual(request.parse({ from: '10', to: '20', weight: '0' }), { from: 10, to: 20, weight: 0 })
  assert.ok(request.validate({ from: '999', to: '20', weight: '1' }).from)
  for (const weight of ['', '-1', '0.5', '9007199254740992']) assert.ok(request.validate({ from: '10', to: '20', weight }).weight)
  assert.ok(ActionInputRequest.create('graph', 'add-vertex', 10, context).structured.validate({ value: '10' }).value)
  const edge = ActionInputRequest.create('weighted-graph', 'remove-edge', 10, context).structured
  assert.deepEqual(edge.parse({ edge: '0' }), { edge: 0 })
  assert.ok(edge.validate({ edge: '999' }).edge)
  assert.equal(edge.acceptsDraft(edge.fields[0], 'e0'), false)
  assert.equal(ActionInputRequest.create('graph', 'breadth-first', 0, { vertices: [], edges: [] }).available, false)
  assert.equal(ActionInputRequest.create('graph', 'remove-edge', 1, { vertices: [1], edges: [] }).available, false)
  assert.equal(ActionInputRequest.create('graph', 'add-vertex', 0, { vertices: [], edges: [] }).available, true)
  assert.equal(ActionInputRequest.create('dag', 'topological-sort', 0), null)
})

test('layout separates parallel/reciprocal edges, draws distinct loops, and labels weights', () => {
  const multi = GraphFixtures.create(Multigraph, [1, 2], [[0, 1], [0, 1], [0, 1], [0, 0], [0, 0]])
  const scene = new GraphSceneLayout().create(multi)
  assert.equal(new Set(scene.edges.map((edge) => edge.id)).size, 5)
  assert.equal(new Set(scene.edges.slice(0, 3).map((edge) => edge.curveOffset)).size, 3)
  assert.notEqual(scene.edges[3].loopRadius, scene.edges[4].loopRadius)
  assert.ok(scene.edges.every((edge) => !edge.directed && /^e\d+$/.test(edge.label)))
  const directed = GraphFixtures.create(DirectedGraph, [1, 2], [[0, 1], [1, 0]])
  const arrows = new GraphSceneLayout().create(directed).edges
  assert.ok(arrows.every((edge) => edge.directed && edge.curveOffset !== 0))
  const weighted = new GraphSceneLayout().create(WeightedGraph.createDefault())
  assert.ok(weighted.edges.every((edge) => /^e\d+: \d+$/.test(edge.label)))
})

test('every offered action has a sequence with independent snapshots and a concrete final result', async () => {
  const folders = { 'add-vertex': 'AddVertex', 'add-edge': 'AddEdge', 'remove-edge': 'RemoveEdge', 'delete-value': 'DeleteByValue', 'search-value': 'SearchByValue', 'breadth-first': 'BreadthFirst', 'depth-first': 'DepthFirst', clear: 'Clear', 'update-weight': 'UpdateWeight', 'shortest-path': 'ShortestPath', 'topological-sort': 'TopologicalSort' }
  const structures = { graph: 'SimpleGraph', 'directed-graph': 'DirectedGraph', 'weighted-graph': 'WeightedGraph', dag: 'DAG', multigraph: 'Multigraph' }
  for (const [kind, model] of GraphCatalog.createModels()) {
    const before = GraphFixtures.snapshot(model)
    for (const choice of ActionCatalog.getActions(kind)) {
      const folder = folders[choice.kind]
      const prefix = kind === 'graph' && ['Clear', 'DeleteByValue', 'SearchByValue'].includes(folder) ? 'Graph' : ''
      const name = `${prefix}${folder}Animation`
      const category = ['breadth-first', 'depth-first', 'shortest-path', 'topological-sort'].includes(choice.kind)
        ? 'DataStructuresAlgorithms/GraphsTraversal' : 'DataStructuresOverview/Graphs'
      const module = await import(`../src/components/${category}/${structures[kind]}/${folder}/${name}.ts`)
      const Animation = module[name]
      const input = { value: 999, from: 10, to: 100, start: 10, weight: 2, edge: 0 }
      const plan = new Animation(model, input)
      const final = plan.steps.at(-1)
      assert.match(final.code, /^return /, `${kind}: ${choice.kind}`)
      assert.equal(final.scene.count, plan.result.length)
      assert.equal(final.scene.edges.length, plan.result.edgeCount)
      for (const step of plan.steps.slice(0, -1)) assert.equal(step.scene.count, model.length)
      for (const step of plan.steps) {
        const ids = new Set(step.scene.nodes.map((node) => node.id))
        assert.equal(ids.size, step.scene.nodes.length)
        if (step.scene.focusId) assert.ok(ids.has(step.scene.focusId))
        for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
      }
      const snapshots = JSON.stringify(plan.steps)
      plan.result.clear()
      assert.equal(JSON.stringify(plan.steps), snapshots)
      assert.equal(GraphFixtures.snapshot(model), before)
      const info = Animation.describe(model.length, model.edgeCount)
      assert.equal(info.name, choice.title)
      assert.ok(info.time.explanation && info.memory.explanation)
    }
  }
})
