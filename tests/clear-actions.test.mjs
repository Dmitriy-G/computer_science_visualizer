import assert from 'node:assert/strict'
import { test } from 'node:test'
import { FixedArray } from '../src/components/FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { LinkedList } from '../src/components/FundamentalDataStructures/Linear/LinkedList/LinkedList.ts'
import { BinaryTree } from '../src/components/FundamentalDataStructures/Trees/BinaryTree/BinaryTree.ts'
import { Graph } from '../src/components/FundamentalDataStructures/Graphs/SimpleGraph/Graph.ts'
import { ClearAnimation as ArrayClear } from '../src/components/FundamentalDataStructures/Linear/Array/Clear/ClearAnimation.ts'
import { ClearAnimation as ListClear } from '../src/components/FundamentalDataStructures/Linear/LinkedList/Clear/ClearAnimation.ts'
import { ClearAnimation as TreeClear } from '../src/components/FundamentalDataStructures/Trees/BinaryTree/Clear/ClearAnimation.ts'
import { ClearAnimation as GraphClear } from '../src/components/FundamentalDataStructures/Graphs/SimpleGraph/Clear/ClearAnimation.ts'
import { AnimationController } from '../src/visualization/AnimationController.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'

const features = [
  [FixedArray, ArrayClear, 'array'],
  [LinkedList, ListClear, 'linked-list'],
  [BinaryTree, TreeClear, 'binary-tree'],
  [Graph, GraphClear, 'graph'],
]

class ClearAssertions {
  static create(Model, values) {
    if (Model === FixedArray) return new FixedArray(values)
    const model = new Model()
    for (const value of values) {
      if (Model === LinkedList) model.insertAt(model.length, value)
      else if (Model === BinaryTree) model.insert(value)
      else model.addVertex(value)
    }
    return model
  }

  static plan(plan, original, kind) {
    const final = plan.steps.at(-1).scene
    assert.equal(plan.result.length, 0)
    assert.deepEqual(plan.result.getEntries(), [])
    assert.equal(final.kind, kind)
    assert.equal(final.count, 0)
    assert.equal(final.nodes.length, 0)
    assert.equal(final.edges.length, 0)
    for (const step of plan.steps.slice(0, -1)) assert.equal(step.scene.count, original.length)
    const positions = new Map(plan.steps[0].scene.nodes.map((node) => [node.id, node]))
    for (const step of plan.steps) {
      assert.ok(step.title && step.description && step.code && step.duration > 0)
      assert.ok(step.phase >= 1 && step.phase <= 4)
      const ids = new Set(step.scene.nodes.map((node) => node.id))
      assert.equal(ids.size, step.scene.nodes.length)
      if (step.scene.focusId !== null) assert.ok(ids.has(step.scene.focusId))
      for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
      for (const node of step.scene.nodes) {
        assert.equal(node.x, positions.get(node.id).x)
        assert.equal(node.y, positions.get(node.id).y)
        assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y))
      }
    }
  }
}

test('fixed array clear returns a separate empty allocation, preserves the source, and retains unique IDs', () => {
  const original = new FixedArray([10, 20, 20])
  const before = original.getEntries()
  const result = original.withoutAll()
  assert.notEqual(result, original)
  assert.equal(result.length, 0)
  assert.deepEqual(original.getEntries(), before)
  assert.equal(result.withInsertedAt(0, 99).getAt(0).id, 'array-element-3')
  assert.equal(result.withoutAll().length, 0)
  const plan = new ArrayClear(original)
  ClearAssertions.plan(plan, original, 'array')
  assert.equal(plan.steps[1].scene.slots.length, 3)
  assert.ok(plan.steps[1].scene.slots.every((slot) => !slot.empty))
  assert.deepEqual(plan.steps[1].scene.nodes.map((node) => node.value), [10, 20, 20])
  assert.ok(plan.steps[2].scene.nodes.every((node) => node.opacity === 0))
  assert.ok(plan.steps[2].scene.slots.every((slot) => slot.opacity === 0))
  assert.equal(plan.steps.at(-1).scene.slots.length, 0)
})

test('mutable clear models are idempotent, preserve detached snapshots and clones, and remain reusable', () => {
  for (const Model of [LinkedList, BinaryTree, Graph]) {
    const model = Model.createDefault()
    const before = model.getEntries()
    const saved = JSON.stringify(before)
    const clone = model.clone()
    clone.clear()
    assert.deepEqual(model.getEntries(), before)
    model.clear()
    model.clear()
    assert.equal(model.length, 0)
    assert.deepEqual(model.getEntries(), [])
    assert.equal(JSON.stringify(before), saved)
    assert.deepEqual(clone.getEntries(), [])
    const added = Model === LinkedList ? model.insertAt(0, 99) : Model === BinaryTree ? model.insert(99) : model.addVertex(99)
    assert.ok(!before.some((entry) => entry.id === added.id))
    assert.equal(model.length, 1)
    if (Model === BinaryTree) {
      assert.equal(added.leftId, null)
      assert.equal(added.rightId, null)
    }
    if (Model === Graph) assert.deepEqual(added.neighborIds, [])
  }
})

test('all four clear animations handle empty, singleton, duplicates, and defaults without mutating input', () => {
  for (const [Model, Animation, kind] of features) {
    for (const model of [new Model(), ClearAssertions.create(Model, [20]), ClearAssertions.create(Model, [20, 20, -5]), Model.createDefault()]) {
      const before = model.getEntries()
      const plan = new Animation(model)
      ClearAssertions.plan(plan, model, kind)
      assert.deepEqual(model.getEntries(), before)
      assert.deepEqual(new Animation(model).steps, plan.steps)
      const snapshots = JSON.stringify(plan.steps)
      if (Model === FixedArray) plan.result.withInsertedAt(0, 88)
      else if (Model === LinkedList) plan.result.insertAt(0, 88)
      else if (Model === BinaryTree) plan.result.insert(88)
      else plan.result.addVertex(88)
      assert.equal(JSON.stringify(plan.steps), snapshots)
      assert.deepEqual(model.getEntries(), before)
    }
  }
})

test('linked list clear releases from head to tail and removes each outgoing pointer before its node', () => {
  const model = ClearAssertions.create(LinkedList, [20, 20, -5])
  const entries = model.getEntries()
  const plan = new ListClear(model)
  const released = plan.steps.filter((step) => step.title.startsWith('Release value'))
  assert.deepEqual(released.map((step) => step.scene.nodes.map((node) => node.id)), [entries.slice(1).map((entry) => entry.id), [entries[2].id], []])
  for (const step of plan.steps.filter((step) => step.title.startsWith('Disconnect value'))) {
    assert.equal(step.scene.nodes[0].id, step.scene.focusId)
    assert.ok(step.scene.edges.filter((edge) => edge.from === step.scene.focusId).every((edge) => edge.opacity === 0))
  }
  assert.equal(plan.steps.at(-1).scene.slots[0].label, 'head = null')
})

test('binary tree clear releases children before their parent in deterministic left-right-root order', () => {
  for (const values of [[50, 30, 70, 20, 40, 60, 80], [10, 20, 30, 40], [40, 30, 20, 10], [20, 20, 20]]) {
    const tree = ClearAssertions.create(BinaryTree, values)
    const entries = tree.getEntries()
    const plan = new TreeClear(tree)
    const order = []
    const released = new Set()
    let previous = new Set(entries.map((entry) => entry.id))
    for (const step of plan.steps.filter((step) => step.title.startsWith('Release value'))) {
      const remaining = new Set(step.scene.nodes.map((node) => node.id))
      const id = [...previous].find((candidate) => !remaining.has(candidate))
      const entry = entries.find((candidate) => candidate.id === id)
      assert.ok(entry)
      if (entry.leftId !== null) assert.ok(released.has(entry.leftId))
      if (entry.rightId !== null) assert.ok(released.has(entry.rightId))
      order.push(entry.value)
      released.add(id)
      previous = remaining
    }
    assert.equal(order.length, tree.length)
    assert.equal(order.at(-1), values[0])
    if (values.length === 7) assert.deepEqual(order, [20, 40, 30, 60, 80, 70, 50])
    assert.equal(plan.steps.at(-1).scene.slots[0].label, 'root = null')
    ClearAssertions.plan(plan, tree, 'binary-tree')
  }
  const deep = new BinaryTree()
  for (let value = 0; value < 500; value += 1) deep.insert(value)
  deep.clear()
  assert.equal(deep.length, 0)
  assert.equal(deep.insert(99).id, 'tree-node-500')
})

test('graph clear handles disconnected components, duplicate values, isolated vertices, and self loops', () => {
  const graph = ClearAssertions.create(Graph, [20, 20, 30, 40, 50])
  const entries = graph.getEntries()
  graph.connect(entries[0].id, entries[1].id)
  graph.connect(entries[2].id, entries[3].id)
  graph.connect(entries[0].id, entries[0].id)
  const before = graph.getEntries()
  const plan = new GraphClear(graph)
  assert.equal(plan.steps.filter((step) => step.title === 'Release the edge').length, 3)
  assert.equal(plan.steps.filter((step) => step.title.startsWith('Release vertex')).length, 5)
  const firstVertex = plan.steps.findIndex((step) => step.title.startsWith('Release vertex'))
  const lastEdge = plan.steps.findLastIndex((step) => step.title === 'Release the edge')
  assert.ok(firstVertex > lastEdge)
  for (const step of plan.steps.slice(firstVertex)) assert.equal(step.scene.edges.length, 0)
  assert.deepEqual(graph.getEntries(), before)
  ClearAssertions.plan(plan, graph, 'graph')
  const clone = graph.clone()
  clone.clear()
  assert.deepEqual(graph.getEntries(), before)
  assert.equal(graph.getSearchPath(30).at(-1).id, entries[2].id)
  assert.equal(graph.deleteValue(20).id, entries[0].id)
  assert.deepEqual(graph.getEntries().find((entry) => entry.id === entries[1].id).neighborIds, [])
  graph.clear()
  const fresh = graph.addVertex(60)
  graph.connect(fresh.id, fresh.id)
  assert.equal(fresh.id, 'graph-5')
  assert.deepEqual(graph.getEntries()[0].neighborIds, [fresh.id])
})

test('clear rewinds and replays without changing the source, and disposal cancels pending playback', () => {
  for (const [Model, Animation] of features) {
    const original = Model.createDefault()
    const before = original.getEntries()
    const plan = new Animation(original)
    let committed = original
    let scheduled = null
    const controller = new AnimationController(plan.steps, {
      onTimelineChange(index) { committed = index === plan.steps.length - 1 ? plan.result : original },
    }, { schedule(callback) { scheduled = callback; return 1 }, cancel() { scheduled = null } })
    controller.seek(plan.steps.length - 1)
    assert.equal(committed.length, 0)
    controller.previous()
    assert.equal(committed, original)
    controller.seek(plan.steps.length - 1)
    controller.play()
    assert.equal(committed, original)
    assert.ok(scheduled)
    controller.seek(plan.steps.length - 1)
    assert.equal(committed.length, 0)
    controller.play()
    controller.dispose()
    assert.equal(scheduled, null)
    assert.deepEqual(original.getEntries(), before)
  }
})

test('clear appears once in each menu and its card describes actual model costs', () => {
  for (const [, Animation, kind] of features) {
    assert.equal(ActionCatalog.getActions(kind).filter((action) => action.kind === 'clear').length, 1)
    const info = Animation.describe(10)
    assert.match(info.terms[0].meaning, /n = 10\./)
    assert.match(info.memory.explanation, /Animation storage excluded/)
    const time = Animation === ArrayClear ? 'O(1)' : Animation === GraphClear ? 'O(n + e)' : 'O(n)'
    for (const scenario of ['best', 'average', 'worst']) assert.equal(info.time[scenario], time)
    if (Animation === TreeClear) {
      assert.equal(info.memory.best, 'O(log n)')
      assert.equal(info.memory.average, 'O(log n)')
      assert.equal(info.memory.worst, 'O(n)')
      assert.match(info.memory.explanation, /random order/)
    } else {
      for (const scenario of ['best', 'average', 'worst']) assert.equal(info.memory[scenario], 'O(1)')
    }
  }
})
