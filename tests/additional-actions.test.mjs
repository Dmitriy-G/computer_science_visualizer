import assert from 'node:assert/strict'
import { test } from 'node:test'
import { LinkedList } from '../src/components/FundamentalDataStructures/Linear/LinkedList/LinkedList.ts'
import { FixedArray } from '../src/components/FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { BinaryTree } from '../src/components/FundamentalDataStructures/Trees/BinaryTree/BinaryTree.ts'
import { Graph } from '../src/components/FundamentalDataStructures/Graphs/SimpleGraph/Graph.ts'
import { InsertionAnimation as ListStart } from '../src/components/FundamentalDataStructures/Linear/LinkedList/AddAtStart/InsertionAnimation.ts'
import { InsertionAnimation as ListEnd } from '../src/components/FundamentalDataStructures/Linear/LinkedList/AddAtEnd/InsertionAnimation.ts'
import { InsertionAnimation as ListMiddle } from '../src/components/FundamentalDataStructures/Linear/LinkedList/AddInTheMiddle/InsertionAnimation.ts'
import { InsertionAnimation as ArrayStart } from '../src/components/FundamentalDataStructures/Linear/Array/AddAtStart/InsertionAnimation.ts'
import { InsertionAnimation as ArrayEnd } from '../src/components/FundamentalDataStructures/Linear/Array/AddAtEnd/InsertionAnimation.ts'
import { InsertionAnimation as ArrayMiddle } from '../src/components/FundamentalDataStructures/Linear/Array/AddInTheMiddle/InsertionAnimation.ts'
import { InsertionAnimation as TreeInsert } from '../src/components/FundamentalDataStructures/Trees/BinaryTree/Insert/InsertionAnimation.ts'
import { SearchAnimation as ListValue } from '../src/components/FundamentalDataStructures/Linear/LinkedList/SearchByValue/SearchAnimation.ts'
import { SearchAnimation as ListIndex } from '../src/components/FundamentalDataStructures/Linear/LinkedList/SearchByIndex/SearchAnimation.ts'
import { SearchAnimation as ArrayValue } from '../src/components/FundamentalDataStructures/Linear/Array/SearchByValue/SearchAnimation.ts'
import { SearchAnimation as ArrayIndex } from '../src/components/FundamentalDataStructures/Linear/Array/SearchByIndex/SearchAnimation.ts'
import { SearchAnimation as TreeKey } from '../src/components/FundamentalDataStructures/Trees/BinaryTree/SearchByKey/SearchAnimation.ts'
import { SearchAnimation as GraphValue } from '../src/components/FundamentalDataStructures/Graphs/SimpleGraph/SearchByValue/SearchAnimation.ts'
import { DeletionAnimation as ListDelete } from '../src/components/FundamentalDataStructures/Linear/LinkedList/DeleteByValue/DeletionAnimation.ts'
import { DeletionAnimation as ArrayDelete } from '../src/components/FundamentalDataStructures/Linear/Array/DeleteByValue/DeletionAnimation.ts'
import { DeletionAnimation as TreeDelete } from '../src/components/FundamentalDataStructures/Trees/BinaryTree/DeleteByKey/DeletionAnimation.ts'
import { DeletionAnimation as GraphDelete } from '../src/components/FundamentalDataStructures/Graphs/SimpleGraph/DeleteByValue/DeletionAnimation.ts'
import { AnimationController } from '../src/visualization/AnimationController.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'

class ActionAssertions {
  static list(values) {
    const list = new LinkedList()
    for (const value of values) list.insertAt(list.length, value)
    return list
  }

  static tree(values) {
    const tree = new BinaryTree()
    for (const value of values) tree.insert(value)
    return tree
  }

  static values(model) { return model.getEntries().map((entry) => entry.value) }

  static scenes(animation, originalSize) {
    const final = animation.steps.at(-1).scene
    assert.equal(final.count, animation.result.length)
    assert.equal(final.nodes.filter((node) => node.opacity > 0).length, animation.result.length)
    assert.deepEqual(final.nodes.filter((node) => node.opacity > 0).map((node) => node.id).sort(), animation.result.getEntries().map((entry) => entry.id).sort())
    for (const step of animation.steps.slice(0, -1)) assert.equal(step.scene.count, originalSize)
    for (const step of animation.steps) {
      const ids = new Set(step.scene.nodes.map((node) => node.id))
      assert.equal(ids.size, step.scene.nodes.length)
      if (step.scene.focusId !== null) assert.ok(ids.has(step.scene.focusId))
      for (const node of step.scene.nodes) {
        assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y))
        assert.ok(node.x >= 35 && node.x + 35 <= step.scene.width)
      }
      for (const edge of step.scene.edges) {
        assert.ok(ids.has(edge.from) && ids.has(edge.to))
      }
    }
    for (const entry of animation.result.getEntries()) {
      assert.equal(final.nodes.find((node) => node.id === entry.id).value, entry.value)
    }
  }

  static ordering(tree) {
    const entries = tree.getEntries()
    const byId = new Map(entries.map((entry) => [entry.id, entry]))
    const stack = entries.length ? [{ id: entries[0].id, min: -Infinity, max: Infinity }] : []
    const seen = new Set()
    while (stack.length) {
      const { id, min, max } = stack.pop()
      assert.ok(!seen.has(id))
      seen.add(id)
      const node = byId.get(id)
      assert.ok(node.value > min && node.value < max)
      if (node.leftId) stack.push({ id: node.leftId, min, max: node.value })
      if (node.rightId) stack.push({ id: node.rightId, min: node.value, max })
    }
    assert.equal(seen.size, tree.length)
  }
}

test('endpoint insertions handle empty, singleton, duplicate, and longer sequences with stable links', () => {
  for (const values of [[], [10], [10, 10], [10, 20, 30]]) {
    for (const [create, Start, End] of [[ActionAssertions.list, ListStart, ListEnd], [(items) => new FixedArray(items), ArrayStart, ArrayEnd]]) {
      const model = create(values)
      const before = model.getEntries()
      for (const [Animation, expected] of [[Start, [99, ...values]], [End, [...values, 99]]]) {
        const animation = new Animation(model, 99)
        assert.deepEqual(ActionAssertions.values(animation.result), expected)
        assert.deepEqual(model.getEntries(), before)
        ActionAssertions.scenes(animation, values.length)
        const final = animation.steps.at(-1).scene
        if (model instanceof LinkedList) {
          const entries = animation.result.getEntries()
          assert.equal(final.edges.length, entries.length - 1)
          for (let index = 1; index < entries.length; index += 1)
            assert.ok(final.edges.some((edge) => edge.from === entries[index - 1].id && edge.to === entries[index].id && edge.opacity > 0))
        }
      }
    }
    const middle = new ListMiddle(ActionAssertions.list(values), 99)
    ActionAssertions.scenes(middle, values.length)
  }
})

test('value searches find the first matching ID, report misses, and never mutate models', () => {
  for (const [Model, Animation] of [[LinkedList, ListValue], [FixedArray, ArrayValue], [BinaryTree, TreeKey], [Graph, GraphValue]]) {
    for (const model of [new Model(), Model.createDefault()]) {
      const before = model.getEntries()
      for (const value of [10, 50, 100, -999]) {
        const animation = new Animation(model, value)
        const expected = before.find((entry) => entry.value === value)
        assert.equal(animation.foundId, expected?.id ?? null)
        assert.deepEqual(animation.result.getEntries(), before)
        assert.deepEqual(model.getEntries(), before)
        ActionAssertions.scenes(animation, model.length)
        assert.equal('annotations' in animation.steps.at(-1).scene, false)
        assert.match(animation.steps.at(-2).description, expected ? /Found/ : /not found/)
      }
      for (const value of [NaN, Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => new Animation(model, value), TypeError)
    }
  }
  for (const [model, Animation] of [[ActionAssertions.list([5, 5]), ListValue], [new FixedArray([5, 5]), ArrayValue], [ActionAssertions.tree([5, 5]), TreeKey]]) {
    assert.equal(new Animation(model, 5).foundId, model.getEntries()[0].id)
  }
})

test('index search traverses the list but directly reads one array slot, including bounds checks', () => {
  for (const [Model, Animation] of [[LinkedList, ListIndex], [FixedArray, ArrayIndex]]) {
    for (const model of [new Model(), Model.createDefault()]) {
      for (const index of [0, 4, 9, 10, Number.MAX_SAFE_INTEGER]) {
        const animation = new Animation(model, index)
        assert.equal(animation.foundId, model.getEntries()[index]?.id ?? null)
        ActionAssertions.scenes(animation, model.length)
        if (index < model.length) {
          const visits = animation.steps.filter((step) => step.title.startsWith('Read index') || step.title.startsWith('Visit index'))
          assert.equal(visits.length, model instanceof FixedArray ? 1 : index + 1)
        } else {
          assert.equal(animation.steps.filter((step) => step.phase === 2).length, 0)
        }
      }
      for (const index of [-1, 0.5, NaN, Infinity]) assert.throws(() => new Animation(model, index), RangeError)
    }
  }
})

test('every action keeps all standalone text annotations out of the diagram', () => {
  const actions = [
    [LinkedList, [ListStart, ListEnd, ListMiddle, ListValue, ListIndex, ListDelete]],
    [FixedArray, [ArrayStart, ArrayEnd, ArrayMiddle, ArrayValue, ArrayIndex, ArrayDelete]],
    [BinaryTree, [TreeInsert, TreeKey, TreeDelete]],
    [Graph, [GraphValue, GraphDelete]],
  ]
  for (const [Model, animations] of actions) {
    for (const model of [new Model(), Model.createDefault()]) {
      for (const Animation of animations) {
        for (const value of [0, 50, 999]) {
          const animation = new Animation(model, value)
          for (const step of animation.steps) {
            assert.equal('annotations' in step.scene, false, `${Model.name}/${Animation.name}: unexpected standalone text annotations`)
          }
          assert.ok(animation.steps.at(-1).description.length > 0)
        }
      }
    }
  }
})

test('all actions explain the correct best, average, and worst time and additional-memory costs', () => {
  const constant = ['O(1)', 'O(1)', 'O(1)']
  const linear = ['O(n)', 'O(n)', 'O(n)']
  const scan = ['O(1)', 'O(n)', 'O(n)']
  const tree = ['O(1)', 'O(log n)', 'O(n)']
  const graph = ['O(n + e)', 'O(n + e)', 'O(n + e)']
  const graphSearch = ['O(n)', 'O(n + e)', 'O(n + e)']
  const actions = [
    [ListStart, constant, constant], [ListEnd, linear, constant], [ListMiddle, linear, constant],
    [ListValue, scan, constant], [ListIndex, scan, constant], [ListDelete, scan, constant],
    [ArrayStart, linear, linear], [ArrayEnd, linear, linear], [ArrayMiddle, linear, linear],
    [ArrayValue, scan, constant], [ArrayIndex, constant, constant], [ArrayDelete, linear, scan],
    [TreeInsert, tree, constant], [TreeKey, tree, constant], [TreeDelete, tree, constant],
    [GraphValue, graphSearch, linear], [GraphDelete, graph, graphSearch],
  ]
  for (const [Animation, time, memory] of actions) {
    for (const size of [0, 1, 10, 25]) {
      const information = Animation.describe(size)
      const scenarios = ['best', 'average', 'worst']
      assert.deepEqual(scenarios.map((scenario) => information.time[scenario]), time, information.name)
      assert.deepEqual(scenarios.map((scenario) => information.memory[scenario]), memory, information.name)
      assert.match(information.terms[0].meaning, new RegExp(`n = ${size}\\.`))
      assert.match(information.memory.explanation, /Animation storage excluded/)
      assert.equal(new Set(information.terms.map((term) => term.symbol)).size, information.terms.length)
    }
  }
  for (const Animation of [ListValue, ListDelete, ListIndex, ArrayValue]) {
    assert.match(Animation.describe(10).time.explanation, /uniformly distributed/)
  }
  for (const Animation of [TreeInsert, TreeKey, TreeDelete]) {
    assert.match(Animation.describe(10).time.explanation, /distinct keys inserted in random order/)
    assert.match(Animation.describe(10).time.explanation, /chain/)
  }
  assert.match(ListEnd.describe(10).time.explanation, /no cached tail pointer/)
  assert.match(ListMiddle.describe(10).time.explanation, /boundary cases/)
  assert.match(ArrayDelete.describe(10).memory.explanation, /value is absent/)
  assert.match(ArrayDelete.describe(10).memory.explanation, /success probability/)
  assert.match(GraphDelete.describe(10).memory.explanation, /for a miss/)
  assert.match(GraphDelete.describe(10).memory.explanation, /successful deletion/)
  assert.match(GraphValue.describe(10).time.explanation, /lookup before the first comparison/)
  assert.match(GraphValue.describe(10).time.explanation, /upper bound/)
})

test('linear deletion removes only the first duplicate, preserves survivors and handles misses and empty results', () => {
  for (const [create, Animation] of [[ActionAssertions.list, ListDelete], [(values) => new FixedArray(values), ArrayDelete]]) {
    for (const values of [[], [20], [10, 20, 20, 30]]) {
      for (const value of [10, 20, 30, 99]) {
        const model = create(values)
        const before = model.getEntries()
        const expected = [...before]
        const index = values.indexOf(value)
        if (index >= 0) expected.splice(index, 1)
        const animation = new Animation(model, value)
        assert.deepEqual(animation.result.getEntries(), expected)
        assert.deepEqual(model.getEntries(), before)
        ActionAssertions.scenes(animation, model.length)
        if (model instanceof FixedArray && index >= 0) {
          for (const step of animation.steps.filter((step) => step.phase === 4 || step.phase === 5)) {
            assert.equal(step.scene.slots.filter((slot) => slot.id.startsWith('result')).length, model.length - 1)
            for (let source = 0; source < before.length; source += 1) {
              const node = step.scene.nodes.find((item) => item.id === `source-${before[source].id}`)
              assert.equal(node.value, before[source].value)
              assert.equal(node.x, 80 + source * 92)
            }
          }
        }
      }
    }
  }
})

test('index model operations reject invalid indices and detached snapshots cannot mutate storage', () => {
  for (const model of [ActionAssertions.list([10]), new FixedArray([10])]) {
    const before = model.getEntries()
    for (const index of [-1, 1, 0.5, NaN, Infinity]) {
      assert.throws(() => model.getAt(index), RangeError)
      assert.throws(() => model instanceof LinkedList ? model.deleteAt(index) : model.withoutAt(index), RangeError)
    }
    model.getAt(0).value = 999
    assert.deepEqual(model.getEntries(), before)
    assert.throws(() => model.findIndex(NaN), TypeError)
  }
})

test('tree deletion covers leaves, either single child, root, both successor positions and rejected duplicate inserts', () => {
  for (const values of [[], [50], [50, 30], [50, 80], [50, 30, 80, 90], [50, 30, 80, 60, 70], [50, 30, 80, 60, 65, 90, 50, 50]]) {
    for (const value of [50, 30, 80, 60, 90, 999]) {
      const model = ActionAssertions.tree(values)
      const before = model.getEntries()
      const removed = model.getSearchPath(value).find((entry) => entry.value === value)
      const animation = new TreeDelete(model, value)
      assert.deepEqual(model.getEntries(), before)
      const expected = before.filter((entry) => entry.id !== removed?.id).map(({ id, value }) => ({ id, value }))
      assert.deepEqual(animation.result.getEntries().map(({ id, value }) => ({ id, value })).sort((a, b) => a.id.localeCompare(b.id)), expected.sort((a, b) => a.id.localeCompare(b.id)))
      ActionAssertions.ordering(animation.result)
      ActionAssertions.scenes(animation, model.length)
    }
  }
  const tree = BinaryTree.createDefault()
  for (const value of [50, 30, 80, 20, 40, 70, 90, 10, 60, 100]) {
    tree.deleteValue(value)
    ActionAssertions.ordering(tree)
  }
  assert.equal(tree.length, 0)
  assert.equal(tree.insert(1).id, 'tree-node-10')
  assert.throws(() => tree.deleteValue(Infinity), TypeError)
})

test('graph search handles cycles, disconnected components, isolated vertices and duplicate values', () => {
  const graph = new Graph()
  const a = graph.addVertex(10)
  const b = graph.addVertex(20)
  const c = graph.addVertex(30)
  const d = graph.addVertex(20)
  graph.connect(a.id, b.id)
  graph.connect(b.id, c.id)
  graph.connect(c.id, a.id)
  assert.equal(new GraphValue(graph, 20).foundId, b.id)
  const missing = new GraphValue(graph, 99)
  assert.equal(missing.foundId, null)
  const comparisons = missing.steps.filter((step) => step.title.startsWith('Compare'))
  assert.equal(comparisons.length, 4)
  assert.ok(comparisons.some((step) => step.scene.focusId === d.id))
  const before = graph.getEntries()
  graph.getEntries()[0].neighborIds.push('fake')
  assert.deepEqual(graph.getEntries(), before)
  assert.throws(() => graph.connect(a.id, 'missing'), RangeError)
  assert.throws(() => graph.addVertex(NaN), TypeError)
})

test('graph deletion removes all incident edges and preserves remaining adjacency symmetry', () => {
  for (const model of [new Graph(), Graph.createDefault()]) {
    for (const value of [10, 50, 100, 999]) {
      const before = model.getEntries()
      const animation = new GraphDelete(model, value)
      assert.deepEqual(model.getEntries(), before)
      ActionAssertions.scenes(animation, model.length)
      const entries = animation.result.getEntries()
      const byId = new Map(entries.map((entry) => [entry.id, entry]))
      for (const entry of entries) for (const id of entry.neighborIds) {
        assert.ok(byId.has(id))
        assert.ok(byId.get(id).neighborIds.includes(entry.id))
      }
    }
  }
  const single = new Graph()
  single.addVertex(1)
  assert.equal(new GraphDelete(single, 1).result.length, 0)
})

test('new action plans are deterministic and deletion rewind/replay restores original without repeated mutation', () => {
  for (const [model, Animation, value] of [
    [LinkedList.createDefault(), ListDelete, 50], [FixedArray.createDefault(), ArrayDelete, 50],
    [BinaryTree.createDefault(), TreeDelete, 50], [Graph.createDefault(), GraphDelete, 50],
    [LinkedList.createDefault(), ListEnd, 99], [FixedArray.createDefault(), ArrayEnd, 99],
  ]) {
    const before = model.getEntries()
    const animation = new Animation(model, value)
    const saved = JSON.stringify(animation.steps)
    assert.deepEqual(new Animation(model, value).steps, animation.steps)
    let committed = model
    const controller = new AnimationController(animation.steps, {
      onTimelineChange(index) { committed = index === animation.steps.length - 1 ? animation.result : model },
    }, { schedule() { return 1 }, cancel() {} })
    controller.seek(animation.steps.length - 1)
    assert.equal(committed, animation.result)
    controller.previous()
    assert.equal(committed, model)
    controller.seek(animation.steps.length - 1)
    controller.play()
    assert.equal(committed, model)
    controller.dispose()
    assert.deepEqual(model.getEntries(), before)
    assert.equal(JSON.stringify(animation.steps), saved)
  }
})

test('catalog offers only indexed searches for linear structures and metadata matches implementation costs', () => {
  for (const kind of ['linked-list', 'array', 'binary-tree', 'graph']) {
    const actions = ActionCatalog.getActions(kind)
    assert.ok(actions.some((action) => action.kind === 'search-value'))
    assert.ok(actions.some((action) => action.kind === 'delete-value'))
    assert.equal(actions.some((action) => action.kind === 'search-index'), kind === 'array' || kind === 'linked-list')
  }
  for (const scenario of ['best', 'average', 'worst']) {
    assert.equal(ListStart.describe(10).time[scenario], 'O(1)')
    assert.equal(ListEnd.describe(10).time[scenario], 'O(n)')
    assert.equal(ArrayIndex.describe(10).time[scenario], 'O(1)')
  }
  for (const Animation of [ListStart, ListEnd, ArrayStart, ArrayEnd, ListIndex, ArrayIndex, ListValue, ArrayValue, TreeKey, GraphValue, ListDelete, ArrayDelete, TreeDelete, GraphDelete]) {
    assert.match(Animation.describe(7).terms[0].meaning, /n = 7/)
  }
})
