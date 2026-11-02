import assert from 'node:assert/strict'
import { test } from 'node:test'
import { BipartiteGraph } from '../src/components/DataStructuresOverview/Graphs/BipartiteGraph/BipartiteGraph.ts'
import { CompleteGraph } from '../src/components/DataStructuresOverview/Graphs/CompleteGraph/CompleteGraph.ts'
import { TreeGraph } from '../src/components/DataStructuresOverview/Graphs/TreeGraph/TreeGraph.ts'
import { Hypergraph } from '../src/components/DataStructuresOverview/Graphs/Hypergraph/Hypergraph.ts'
import { FlowNetwork } from '../src/components/DataStructuresOverview/Graphs/FlowNetwork/FlowNetwork.ts'
import { FunctionalGraph } from '../src/components/DataStructuresOverview/Graphs/FunctionalGraph/FunctionalGraph.ts'
import { AdjacencyMatrix } from '../src/components/DataStructuresOverview/Graphs/AdjacencyMatrix/AdjacencyMatrix.ts'
import { AdjacencyList } from '../src/components/DataStructuresOverview/Graphs/AdjacencyList/AdjacencyList.ts'
import { EdgeList } from '../src/components/DataStructuresOverview/Graphs/EdgeList/EdgeList.ts'
import { CompressedSparseRow } from '../src/components/DataStructuresOverview/Graphs/CompressedSparseRow/CompressedSparseRow.ts'
import { ExtendedGraphCatalog } from '../src/visualization/ExtendedGraphCatalog.ts'
import { ExtendedGraphInput } from '../src/visualization/ExtendedGraphInput.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'
import { LinearAnimation } from '../src/visualization/LinearAnimation.ts'
import { ActionOrdering } from '../src/components/MainMenu/ActionMenu/ActionOrdering.ts'

class GraphFixture {
  static create(Model, values, edges = []) {
    const model = new Model()
    for (const value of values) assert.notEqual(model.execute('add-vertex', { value }).status, 'REJECTED')
    for (const [from, to, capacity] of edges) assert.notEqual(model.execute('add-edge', { from, to, capacity }).status, 'REJECTED')
    return model
  }

  static snapshot(model) {
    return { vertices: structuredClone(model.getVertices()), edges: structuredClone(model.getEdges()), scene: ExtendedGraphCatalog.createScene(model) }
  }

  static reject(model, action, input) {
    const before = this.snapshot(model)
    assert.equal(model.execute(action, input).status, 'REJECTED')
    assert.deepEqual(this.snapshot(model), before)
  }

  static topology(model) {
    const ids = new Set(model.getVertices().map((vertex) => vertex.id))
    const edges = model.getEdges()
    assert.equal(ids.size, model.length)
    assert.equal(new Set(edges.map((edge) => edge.id)).size, edges.length)
    assert.equal(model.edgeCount, edges.length)
    for (const edge of edges) {
      assert.ok(ids.has(edge.from) && ids.has(edge.to))
      for (const member of edge.members ?? []) assert.ok(ids.has(member))
    }
    if (model instanceof BipartiteGraph) {
      const partitions = new Map(model.getVertices().map((vertex) => [vertex.id, vertex.partition]))
      for (const edge of edges) assert.notEqual(partitions.get(edge.from), partitions.get(edge.to))
    }
    if (model instanceof CompleteGraph) assert.equal(edges.length, model.length * (model.length - 1) / 2)
    if (model instanceof TreeGraph && model.length) {
      assert.equal(edges.length, model.length - 1)
      assert.equal(model.execute('breadth-first', { start: model.getVertices()[0].value }).value.length, model.length)
    }
    if (model instanceof FunctionalGraph) for (const id of ids) assert.equal(edges.filter((edge) => edge.from === id).length, 1)
    if (model instanceof Hypergraph) {
      const sets = edges.map((edge) => [...edge.members].sort().join(','))
      assert.equal(new Set(sets).size, edges.length)
      for (const edge of edges) assert.ok(edge.members.length >= 2 && new Set(edge.members).size === edge.members.length)
    }
  }

  static flow(model, source, sink, expected) {
    const balances = new Map(model.getVertices().map((vertex) => [vertex.id, 0n]))
    for (const edge of model.getEdges()) {
      assert.ok(edge.flow >= 0n && edge.flow <= BigInt(edge.capacity))
      balances.set(edge.from, balances.get(edge.from) - edge.flow)
      balances.set(edge.to, balances.get(edge.to) + edge.flow)
    }
    for (const vertex of model.getVertices()) assert.equal(balances.get(vertex.id), vertex.value === source ? -expected : vertex.value === sink ? expected : 0n)
  }

  static storage(model) {
    this.topology(model)
    const vertices = model.getVertices()
    const edges = model.getEdges()
    if (model instanceof AdjacencyMatrix) {
      const matrix = model.getMatrix()
      assert.equal(matrix.length, model.length)
      for (let row = 0; row < model.length; row += 1) {
        assert.equal(matrix[row].length, model.length)
        for (let column = 0; column < model.length; column += 1) assert.equal(matrix[row][column], Number(edges.some((edge) => edge.from === vertices[row].id && edge.to === vertices[column].id)))
      }
    }
    if (model instanceof AdjacencyList) for (const vertex of vertices) assert.deepEqual(model.getRow(vertex.id), edges.filter((edge) => edge.from === vertex.id))
    if (model instanceof CompressedSparseRow) {
      const { offsets, columns, edgeNumbers } = model.getStorage()
      assert.equal(offsets.length, model.length + 1)
      assert.equal(offsets[0], 0)
      assert.equal(offsets.at(-1), edges.length)
      assert.equal(columns.length, edges.length)
      assert.equal(new Set(edgeNumbers).size, edges.length)
      for (let row = 0; row < model.length; row += 1) {
        assert.ok(offsets[row] <= offsets[row + 1])
        const indices = columns.slice(offsets[row], offsets[row + 1])
        assert.deepEqual(indices, [...new Set(indices)].sort((a, b) => a - b))
        assert.ok(indices.every((column) => column >= 0 && column < model.length))
        for (let index = offsets[row]; index < offsets[row + 1]; index += 1) assert.ok(edges.some((edge) => edge.number === edgeNumbers[index] && edge.from === vertices[row].id && edge.to === vertices[columns[index]].id))
      }
    }
    for (const vertex of vertices) {
      const expected = edges.filter((edge) => edge.from === vertex.id).map((edge) => edge.to).sort()
      assert.deepEqual([...model.getNeighbors(vertex.id)].sort(), expected)
    }
  }
}

test('new graph entries have ten vertices, separate storage views, and complete menu/input coverage', () => {
  for (const [kind, model] of ExtendedGraphCatalog.createModels()) {
    assert.equal(model.length, 10)
    GraphFixture.topology(model)
    const scene = ExtendedGraphCatalog.createScene(model)
    assert.equal(scene.count, 10)
    assert.equal(scene.countLabel, 'vertices')
    assert.equal(StructureCatalog.structures.find((entry) => entry.kind === kind).group, 'graphs')
    const overview = StructureInformation.get(kind)
    assert.ok(overview.summary && overview.useCases.length >= 4)
    const edit = ActionCatalog.getScopedActions(kind, 'overview')
    const algorithms = ActionCatalog.getScopedActions(kind, 'graph-traversal')
    assert.deepEqual(algorithms.map((entry) => entry.kind), kind === 'flow-network' ? ['breadth-first', 'depth-first', 'max-flow'] : ['breadth-first', 'depth-first'])
    for (const action of algorithms) assert.ok(!edit.some((entry) => entry.kind === action.kind))
    assert.equal(ActionInputRequest.supportsStructure(kind), true)
    assert.equal(ActionInputRequest.create(kind, 'clear', 0), null)
  }
})

test('bipartite, complete, tree, and functional edits preserve their defining invariants', () => {
  const bipartite = BipartiteGraph.createDefault()
  GraphFixture.reject(bipartite, 'add-edge', { from: 10, to: 20 })
  GraphFixture.reject(bipartite, 'add-vertex', { value: 11, partition: 2 })
  assert.notEqual(bipartite.execute('add-edge', { from: 10, to: 80 }).status, 'REJECTED')
  GraphFixture.topology(bipartite)

  const complete = CompleteGraph.createDefault()
  GraphFixture.reject(complete, 'remove-edge', { edge: 0 })
  for (const value of [110, 120, 130, 140, 150, 160]) {
    complete.execute('add-vertex', { value })
    GraphFixture.topology(complete)
  }
  GraphFixture.reject(complete, 'add-vertex', { value: 170 })
  complete.execute('delete-value', { value: 50 })
  GraphFixture.topology(complete)

  const tree = TreeGraph.createDefault()
  GraphFixture.reject(tree, 'delete-value', { value: 10 })
  GraphFixture.reject(tree, 'add-vertex', { value: 110, parent: 999 })
  tree.execute('add-vertex', { value: 110, parent: 30 })
  tree.execute('delete-value', { value: 100 })
  GraphFixture.topology(tree)

  const functional = FunctionalGraph.createDefault()
  const original = functional.getEdges().find((edge) => edge.from === functional.getVertices()[0].id).id
  functional.execute('add-edge', { from: 10, to: 50 })
  assert.equal(functional.execute('read-successor', { value: 10 }).value, 50)
  assert.equal(functional.getEdges().find((edge) => edge.from === functional.getVertices()[0].id).id, original)
  GraphFixture.reject(functional, 'add-vertex', { value: 110, successor: 999 })
  functional.execute('delete-value', { value: 50 })
  assert.equal(functional.execute('read-successor', { value: 10 }).value, 10)
  GraphFixture.topology(functional)
})

test('hyperedges are sets, incidence drawing is not a clique, and deletion coalesces duplicates', () => {
  const graph = GraphFixture.create(Hypergraph, [1, 2, 3, 4])
  graph.execute('add-edge', { members: '1,2,3' })
  graph.execute('add-edge', { members: '1,2' })
  GraphFixture.reject(graph, 'add-edge', { members: '3,2,1' })
  for (const members of ['1', '1,1', '1,99', '1,2.5', '1,9007199254740992']) GraphFixture.reject(graph, 'add-edge', { members })
  const scene = ExtendedGraphCatalog.createScene(graph)
  assert.equal(scene.nodes.length, 6)
  assert.equal(scene.edges.length, 5)
  assert.ok(scene.edges.every((edge) => edge.to.startsWith('hyperedge-')))
  assert.deepEqual(graph.execute('breadth-first', { start: 1 }).value, [1, 2, 3])
  graph.execute('delete-value', { value: 3 })
  assert.equal(graph.edgeCount, 1)
  assert.equal(graph.getEdges()[0].number, 0)
  graph.execute('delete-value', { value: 2 })
  assert.equal(graph.edgeCount, 0)
  GraphFixture.topology(graph)
})

test('all four representations agree through row removal, self-loops, isolated vertices, and packed edits', () => {
  const models = [AdjacencyMatrix, AdjacencyList, EdgeList, CompressedSparseRow].map((Model) => GraphFixture.create(Model, [1, 2, 3, 4, 5], [[1, 3], [1, 2], [2, 2], [3, 1], [4, 2], [3, 4]]))
  for (const model of models) {
    GraphFixture.storage(model)
    GraphFixture.reject(model, 'add-edge', { from: 1, to: 2 })
    const stable = model.getEdges().find((edge) => edge.number === 0)
    const copy = model.clone()
    model.execute('delete-value', { value: 2 })
    GraphFixture.storage(model)
    assert.deepEqual(model.getEdges().find((edge) => edge.number === 0), stable)
    model.execute('add-vertex', { value: 6 })
    model.execute('add-edge', { from: 6, to: 1 })
    model.execute('remove-edge', { edge: 0 })
    GraphFixture.storage(model)
    GraphFixture.storage(copy)
    assert.equal(copy.length, 5)
    assert.equal(copy.edgeCount, 6)
    assert.deepEqual(model.execute('breadth-first', { start: 6 }).value, [6, 1])
    assert.deepEqual(model.execute('depth-first', { start: 5 }).value, [5])
    const counter = Math.max(...model.getEdges().map((edge) => edge.number))
    model.execute('clear', {})
    GraphFixture.storage(model)
    model.execute('add-vertex', { value: 7 })
    model.execute('add-edge', { from: 7, to: 7 })
    assert.ok(model.getEdges()[0].number > counter)
    GraphFixture.storage(model)
  }
  const pairs = models.map((model) => model.getEdges().map((edge) => [model.getVertices().find((vertex) => vertex.id === edge.from).value, model.getVertices().find((vertex) => vertex.id === edge.to).value]))
  for (const entries of pairs) assert.deepEqual(entries, [[7, 7]])
})

test('Edmonds–Karp cancels earlier paths, conserves every published flow, and keeps rejected edits atomic', () => {
  // The first path is 0→1→3→5. The second must cancel 1→3 via 3→1.
  const graph = GraphFixture.create(FlowNetwork, [0, 1, 2, 3, 4, 5], [[0, 1, 1], [0, 2, 1], [1, 3, 1], [1, 4, 1], [2, 3, 1], [3, 5, 1], [4, 5, 1]])
  const events = []
  const result = graph.execute('max-flow', { from: 0, to: 5 }, { onLinearChange(event) {
    events.push(event)
    const sinkId = graph.getVertices().find((vertex) => vertex.value === 5).id
    const total = graph.getEdges().filter((edge) => edge.to === sinkId).reduce((sum, edge) => sum + edge.flow, 0n)
    GraphFixture.flow(graph, 0, 5, total)
  } })
  assert.equal(result.value, '2')
  assert.ok(events.some((event) => event.status === 'AUGMENT' && event.edgeIds.includes(graph.getEdges()[2].id)))
  assert.equal(graph.getEdges()[2].flow, 0n)
  GraphFixture.flow(graph, 0, 5, 2n)
  GraphFixture.reject(graph, 'add-edge', { from: 0, to: 1, capacity: 3 })
  GraphFixture.reject(graph, 'update-capacity', { edge: 0, capacity: -1 })
  GraphFixture.reject(graph, 'max-flow', { from: 0, to: 0 })
  const copy = graph.clone()
  graph.execute('update-capacity', { edge: 0, capacity: 0 })
  assert.ok(graph.getEdges().every((edge) => edge.flow === 0n))
  assert.deepEqual(graph.terminals, [null, null])
  GraphFixture.flow(copy, 0, 5, 2n)
  assert.equal(graph.execute('max-flow', { from: 0, to: 5 }).value, '1')

  const capacity = Number.MAX_SAFE_INTEGER
  const exact = GraphFixture.create(FlowNetwork, [0, 1, 2, 3], [[0, 1, capacity], [1, 3, capacity], [0, 2, capacity], [2, 3, capacity], [1, 0, 0]])
  assert.equal(exact.execute('max-flow', { from: 0, to: 3 }).value, (BigInt(capacity) * 2n).toString())
  GraphFixture.flow(exact, 0, 3, BigInt(capacity) * 2n)
  assert.equal(GraphFixture.create(FlowNetwork, [1, 2]).execute('max-flow', { from: 1, to: 2 }).value, '0')
})

test('new graph dialogs validate membership, partitions, first roots, successors, capacities, and empty states', () => {
  const context = { vertices: [1, 2, 3], edges: [7], partitions: { 1: 0, 2: 1, 3: 0 } }
  const bipartite = ExtendedGraphInput.create('bipartite-graph', 'add-edge', 3, context)
  assert.deepEqual(bipartite.parse({ from: '01', to: '02' }), { from: 1, to: 2 })
  assert.ok(bipartite.validate({ from: '01', to: '03' }).to)
  const hyperedge = ExtendedGraphInput.create('hypergraph', 'add-edge', 3, context)
  assert.deepEqual(hyperedge.parse({ members: '1, 2,3' }), { members: '1, 2,3' })
  assert.ok(hyperedge.validate({ members: '1,9' }).members)
  const tree = ExtendedGraphInput.create('tree-graph', 'add-vertex', 0, { vertices: [], edges: [] })
  assert.deepEqual(tree.parse({ value: '9', parent: '9' }), { value: 9, parent: 9 })
  assert.ok(tree.validate({ value: '9', parent: '8' }).parent)
  const functional = ExtendedGraphInput.create('functional-graph', 'add-vertex', 3, context)
  assert.deepEqual(functional.parse({ value: '4', successor: '4' }), { value: 4, successor: 4 })
  assert.ok(functional.validate({ value: '4', successor: '99' }).successor)
  const flow = ExtendedGraphInput.create('flow-network', 'add-edge', 3, context)
  for (const capacity of ['', '-1', '0.5', '9007199254740992']) assert.ok(flow.validate({ from: '1', to: '2', capacity }).capacity)
  assert.ok(ExtendedGraphInput.create('flow-network', 'max-flow', 3, context).validate({ from: '1', to: '1' }).to)
  assert.equal(ExtendedGraphInput.create('edge-list', 'remove-edge', 3, { vertices: [1, 2, 3], edges: [] }).available, false)
  assert.equal(ExtendedGraphInput.create('flow-network', 'max-flow', 1).available, false)
})

test('every new action has deterministic independent bounded scenes and action-owned complexity', async () => {
  const structures = { 'bipartite-graph': 'BipartiteGraph', 'complete-graph': 'CompleteGraph', 'tree-graph': 'TreeGraph', hypergraph: 'Hypergraph', 'flow-network': 'FlowNetwork', 'functional-graph': 'FunctionalGraph', 'adjacency-matrix': 'AdjacencyMatrix', 'adjacency-list': 'AdjacencyList', 'edge-list': 'EdgeList', 'compressed-sparse-row': 'CompressedSparseRow' }
  const folders = { 'add-vertex': 'AddVertex', 'add-edge': 'AddEdge', 'remove-edge': 'RemoveEdge', 'delete-value': 'DeleteByValue', 'search-value': 'SearchByValue', clear: 'Clear', 'breadth-first': 'BreadthFirst', 'depth-first': 'DepthFirst', 'inspect-storage': 'InspectStorage', 'read-successor': 'ReadSuccessor', 'update-capacity': 'UpdateCapacity', 'max-flow': 'MaxFlow' }
  let inspected = 0
  for (const [kind, model] of ExtendedGraphCatalog.createModels()) {
    const original = GraphFixture.snapshot(model)
    const information = new Map()
    for (const choice of ActionCatalog.getActions(kind)) {
      const folder = kind === 'functional-graph' && choice.kind === 'add-edge' ? 'SetSuccessor' : folders[choice.kind]
      const algorithm = ['breadth-first', 'depth-first', 'max-flow'].includes(choice.kind)
      const category = algorithm ? 'DataStructuresAlgorithms/GraphsTraversal' : 'DataStructuresOverview/Graphs'
      const module = await import(`../src/components/${category}/${structures[kind]}/${folder}/${folder}Animation.ts`)
      const Animation = module[`${folder}Animation`]
      const input = { value: choice.kind === 'add-vertex' ? 110 : choice.kind === 'delete-value' ? 100 : 10, partition: 0, parent: 10, successor: 10, from: 10, to: kind === 'bipartite-graph' ? 80 : 100, members: '10,100', capacity: 2, edge: 0, start: 10 }
      const plan = new Animation(model, input)
      assert.deepEqual(plan.steps, new Animation(model, input).steps)
      assert.deepEqual(GraphFixture.snapshot(model), original)
      assert.ok(plan.steps.length <= LinearAnimation.maximumDetailedFrames + 2)
      assert.equal(plan.steps.at(-1).scene.count, plan.result.length)
      assert.ok(!plan.steps.at(-1).description.startsWith('Rejected:'))
      const dimensions = new Set(plan.steps.map((step) => `${step.scene.width}:${step.scene.height}`))
      assert.equal(dimensions.size, 1)
      for (const step of plan.steps) {
        const ids = new Set(step.scene.nodes.map((node) => node.id))
        assert.equal(ids.size, step.scene.nodes.length)
        if (step.scene.focusId) assert.ok(ids.has(step.scene.focusId))
        for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
        for (const node of step.scene.nodes) assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y) && node.x > 0 && node.y > 0)
      }
      const snapshots = structuredClone(plan.steps)
      plan.result.execute('clear', {})
      assert.deepEqual(plan.steps, snapshots)
      const info = Animation.describe(model.length, model.edgeCount)
      assert.equal(info.name, choice.title)
      assert.ok(info.time.explanation && info.memory.explanation)
      information.set(choice.kind, info)
      inspected += 1
    }
    if (kind === 'flow-network') assert.equal(ActionOrdering.arrange(ActionCatalog.getScopedActions(kind, 'graph-traversal'), 'average-time', (action) => information.get(action)).at(-1).kind, 'max-flow')
  }
  assert.equal(inspected, 82)
})

test('matrix inspection caps stored frames while still completing the entire operation', async () => {
  const { InspectStorageAnimation } = await import('../src/components/DataStructuresOverview/Graphs/AdjacencyMatrix/InspectStorage/InspectStorageAnimation.ts')
  const model = AdjacencyMatrix.createDefault()
  for (let value = 110; value <= 160; value += 10) model.execute('add-vertex', { value })
  const plan = new InspectStorageAnimation(model)
  assert.equal(plan.steps.length, 98)
  assert.match(plan.steps.at(-1).description, /160 intermediate trace events/)
  assert.equal(plan.result.length, 16)
  assert.equal(plan.result.edgeCount, model.edgeCount)
})

test('clear preserves each graph invariant during release, isolates clones, and never recycles identities', () => {
  for (const [kind, model] of ExtendedGraphCatalog.createModels()) {
    const before = GraphFixture.snapshot(model)
    const copy = model.clone()
    model.execute('clear', {}, { onLinearChange() { GraphFixture.topology(model) } })
    assert.equal(model.length, 0)
    assert.equal(model.edgeCount, 0)
    assert.deepEqual(GraphFixture.snapshot(copy), before)
    assert.notEqual(model.execute('add-vertex', { value: 1000, partition: 1, parent: 1000, successor: 1000 }).status, 'REJECTED')
    assert.equal(model.getVertices()[0].id, `${kind}-v10`)
    GraphFixture.topology(model)
    if ([AdjacencyMatrix, AdjacencyList, EdgeList, CompressedSparseRow].some((Model) => model instanceof Model)) GraphFixture.storage(model)
  }
})

test('ordinary edge and hyperedge limits reject atomically without consuming stable IDs', () => {
  for (const Model of [AdjacencyMatrix, AdjacencyList, EdgeList, CompressedSparseRow]) {
    const model = GraphFixture.create(Model, Array.from({ length: 16 }, (_, index) => index))
    for (let from = 0; from < 8; from += 1) for (let to = 0; to < 16; to += 1) assert.notEqual(model.execute('add-edge', { from, to }).status, 'REJECTED')
    assert.equal(model.edgeCount, 128)
    GraphFixture.reject(model, 'add-edge', { from: 8, to: 0 })
    model.execute('remove-edge', { edge: 0 })
    model.execute('add-edge', { from: 8, to: 0 })
    assert.ok(model.getEdges().some((edge) => edge.number === 128))
    GraphFixture.storage(model)
  }
  const hypergraph = GraphFixture.create(Hypergraph, Array.from({ length: 9 }, (_, index) => index))
  const pairs = []
  for (let from = 0; from < 9; from += 1) for (let to = from + 1; to < 9; to += 1) pairs.push(`${from},${to}`)
  for (const members of pairs.slice(0, 32)) hypergraph.execute('add-edge', { members })
  assert.equal(hypergraph.edgeCount, 32)
  GraphFixture.reject(hypergraph, 'add-edge', { members: pairs[32] })
  hypergraph.execute('remove-edge', { edge: 0 })
  hypergraph.execute('add-edge', { members: pairs[32] })
  assert.equal(hypergraph.getEdges().at(-1).number, 32)
  GraphFixture.topology(hypergraph)
})
