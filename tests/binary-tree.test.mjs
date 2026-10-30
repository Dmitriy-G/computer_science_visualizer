import assert from 'node:assert/strict'
import { test } from 'node:test'
import { BinaryTree } from '../src/components/DataStructures/Trees/BinaryTree/BinaryTree.ts'
import { BinaryTreeLayout } from '../src/components/DataStructures/Trees/BinaryTree/BinaryTreeLayout.ts'
import { InsertionAnimation } from '../src/components/DataStructures/Trees/BinaryTree/Insert/InsertionAnimation.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { LinkedList } from '../src/components/DataStructures/Linear/LinkedList/LinkedList.ts'
import { AnimationController } from '../src/visualization/AnimationController.ts'

class TreeAssertions {
  static create(values) {
    const tree = new BinaryTree()
    for (const value of values) tree.insert(value)
    return tree
  }

  static checkOrdering(tree) {
    const entries = tree.getEntries()
    const byId = new Map(entries.map((entry) => [entry.id, entry]))
    const stack = entries.length ? [{ id: entries[0].id, min: -Infinity, max: Infinity }] : []
    const seen = new Set()
    while (stack.length) {
      const { id, min, max } = stack.pop()
      assert.ok(!seen.has(id), 'No cycles or shared children')
      seen.add(id)
      const node = byId.get(id)
      assert.ok(node)
      assert.ok(node.value > min && node.value < max)
      if (node.leftId) stack.push({ id: node.leftId, min, max: node.value })
      if (node.rightId) stack.push({ id: node.rightId, min: node.value, max })
    }
    assert.equal(seen.size, tree.length)
  }

  static checkFinal(animation) {
    const final = animation.steps.at(-1).scene
    const entries = animation.result.getEntries()
    assert.equal(final.count, entries.length)
    assert.equal(final.nodes.length, entries.length)
    assert.equal(final.edges.length, entries.length - 1)
    for (const entry of entries) {
      const node = final.nodes.find((item) => item.id === entry.id)
      assert.ok(node)
      assert.equal(node.value, entry.value)
      assert.equal(node.opacity, 1)
      for (const childId of [entry.leftId, entry.rightId]) {
        if (childId === null) continue
        assert.ok(final.edges.some((edge) =>
          edge.from === entry.id && edge.to === childId && edge.opacity === 1,
        ))
      }
    }
    this.checkOrdering(animation.result)
  }
}

test('default binary search tree has ten nodes and preview uses the actual model', () => {
  const tree = BinaryTree.createDefault()
  assert.equal(tree.length, 10)
  assert.equal(tree.getEntries()[0].value, 50)
  TreeAssertions.checkOrdering(tree)
  const scene = StructureCatalog.createPreview('binary-tree', LinkedList.createDefault())
  assert.deepEqual(scene, new BinaryTreeLayout().create(tree.getEntries()))
})

test('tree inserts into empty roots, both branches, and deep subtrees while rejecting duplicate keys', () => {
  const tree = TreeAssertions.create([50, 30, 80, 40, 35, 50, 50, -20, 100])
  TreeAssertions.checkOrdering(tree)
  const entries = tree.getEntries()
  assert.equal(tree.length, 7)
  assert.equal(new Set(entries.map((entry) => entry.id)).size, 7)
  const root = entries[0]
  assert.equal(entries.find((entry) => entry.id === root.leftId).value, 30)
  assert.equal(entries.find((entry) => entry.id === root.rightId).value, 80)
  assert.equal(entries.filter((entry) => entry.value === 50).length, 1)
})

test('duplicate insertion preserves root, child pointers, count, and the next node ID', () => {
  const tree = BinaryTree.createDefault()
  const before = tree.getEntries()
  for (const value of [50, 30, 10, 70, 100, 50]) {
    assert.equal(tree.insert(value), null)
    assert.deepEqual(tree.getEntries(), before)
    assert.equal(tree.length, 10)
    TreeAssertions.checkOrdering(tree)
  }
  const clone = tree.clone()
  assert.equal(clone.insert(50), null)
  assert.equal(clone.insert(99).id, 'tree-node-10')
  assert.deepEqual(tree.getEntries(), before)
  assert.equal(tree.insert(99).id, 'tree-node-10')
  assert.equal(tree.insert(99), null)
  assert.equal(tree.insert(101).id, 'tree-node-11')
  TreeAssertions.checkOrdering(tree)
})

test('invalid values cannot mutate the tree or consume node IDs', () => {
  const tree = TreeAssertions.create([10])
  const before = tree.getEntries()
  for (const value of [NaN, Infinity, -Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => tree.insert(value), TypeError)
    assert.throws(() => new InsertionAnimation(tree, value), TypeError)
  }
  assert.deepEqual(tree.getEntries(), before)
  assert.equal(tree.insert(20).id, 'tree-node-1')
})

test('clones and entry snapshots retain IDs without sharing mutable child pointers', () => {
  const original = BinaryTree.createDefault()
  const before = original.getEntries()
  const clone = original.clone()
  assert.deepEqual(clone.getEntries(), before)
  clone.insert(35)
  clone.insert(99)
  assert.deepEqual(original.getEntries(), before)
  assert.equal(clone.length, 12)
  const entries = original.getEntries()
  entries[0].leftId = null
  entries[0].value = 999
  assert.deepEqual(original.getEntries(), before)
  const emptyClone = new BinaryTree().clone()
  emptyClone.insert(-1)
  assert.equal(emptyClone.length, 1)
})

test('animation compares and traverses the correct path for left, right, and duplicate insertions', () => {
  const tree = BinaryTree.createDefault()
  for (const [value, expectedPath] of [
    [35, [50, 30, 40]],
    [99, [50, 80, 90, 100]],
    [50, [50]],
    [-999, [50, 30, 20, 10]],
  ]) {
    const animation = new InsertionAnimation(tree, value)
    const comparisons = animation.steps.filter((step) => step.code.startsWith('if ('))
    assert.deepEqual(comparisons.map((step) =>
      step.scene.nodes.find((node) => node.id === step.scene.focusId).value,
    ), expectedPath)
    assert.deepEqual([...new Set(animation.steps.map((step) => step.phase))], value === 50 ? [1, 2, 6] : [1, 2, 3, 4, 5, 6])
    assert.equal(tree.length, 10)
    assert.equal(animation.result.length, value === 50 ? 10 : 11)
    TreeAssertions.checkFinal(animation)
  }
})

test('locate, create, connect, and commit are separate scenes with a pending node count', () => {
  const animation = new InsertionAnimation(BinaryTree.createDefault(), 99)
  const locate = animation.steps.find((step) => step.phase === 3).scene
  const create = animation.steps.find((step) => step.phase === 4).scene
  const connect = animation.steps.find((step) => step.phase === 5).scene
  const final = animation.steps.at(-1).scene
  const pending = create.nodes.find((node) => node.tone === 'new')
  assert.ok(pending)
  assert.equal(locate.nodes.find((node) => node.id === pending.id).opacity, 0)
  assert.equal(locate.slots[0].empty, true)
  assert.equal(locate.slots[0].opacity, 1)
  assert.match(pending.label, /pending/)
  assert.equal(pending.opacity, 1)
  assert.equal(create.edges.find((edge) => edge.to === pending.id).opacity, 0)
  assert.equal(connect.edges.find((edge) => edge.to === pending.id).opacity, 1)
  for (const step of animation.steps.slice(0, -1)) assert.equal(step.scene.count, 10)
  assert.equal(final.count, 11)
  assert.doesNotMatch(final.nodes.find((node) => node.id === pending.id).label, /pending/)
  for (const node of create.nodes) {
    assert.deepEqual(
      { x: node.x, y: node.y },
      { x: connect.nodes.find((item) => item.id === node.id).x, y: connect.nodes.find((item) => item.id === node.id).y },
    )
  }
})

test('empty, singleton, and skewed trees animate correctly', () => {
  for (const values of [[], [10], [1, 2, 3, 4, 5], [5, 4, 3, 2, 1], [5, 5, 5]]) {
    for (const value of [-999, 5, 999]) {
      const tree = TreeAssertions.create(values)
      const before = tree.getEntries()
      const animation = new InsertionAnimation(tree, value)
      assert.deepEqual(tree.getEntries(), before)
      assert.equal(animation.steps[0].scene.count, tree.length)
      TreeAssertions.checkFinal(animation)
      if (values.length === 0) {
        assert.match(animation.steps.at(-2).code, /root = newNode/)
        assert.equal(animation.steps.at(-1).scene.nodes[0].label, 'root')
      }
    }
  }
})

test('replay and subsequent insertions are deterministic and leave previous scenes unchanged', () => {
  const original = BinaryTree.createDefault()
  const before = original.getEntries()
  const first = new InsertionAnimation(original, 99)
  const saved = JSON.stringify(first.steps)
  const replay = new InsertionAnimation(original, 99)
  assert.deepEqual(replay.steps, first.steps)
  assert.deepEqual(replay.result.getEntries(), first.result.getEntries())
  const second = new InsertionAnimation(first.result, 99)
  assert.equal(second.result.length, 11)
  assert.deepEqual(second.result.getEntries(), first.result.getEntries())
  assert.equal(second.steps.at(-1).title, 'Duplicate rejected')
  assert.equal(first.result.length, 11)
  assert.deepEqual(original.getEntries(), before)
  assert.equal(JSON.stringify(first.steps), saved)
  assert.equal(new Set(second.result.getEntries().map((entry) => entry.id)).size, 11)
  TreeAssertions.checkFinal(second)
  const third = new InsertionAnimation(second.result, 101)
  assert.equal(third.result.length, 12)
  assert.equal(third.result.getEntries().find((entry) => entry.value === 101).id, 'tree-node-11')
  TreeAssertions.checkFinal(third)
})

test('duplicate animations stop at root or subtree matches without creating pending nodes or changing any scene count', () => {
  const original = BinaryTree.createDefault()
  const before = original.getEntries()
  for (const value of [50, 30, 10, 70, 100]) {
    const animation = new InsertionAnimation(original, value)
    const match = before.find((entry) => entry.value === value)
    assert.deepEqual(animation.result.getEntries(), before)
    assert.equal(animation.steps.at(-1).title, 'Duplicate rejected')
    assert.equal(animation.steps.at(-1).scene.focusId, match.id)
    assert.equal(animation.steps.at(-1).scene.nodes.find((node) => node.id === match.id).status, 'DUPLICATE')
    assert.match(animation.steps.at(-1).description, /unchanged/)
    assert.ok(!animation.steps.some((step) => step.phase >= 3 && step.phase <= 5))
    for (const step of animation.steps) {
      assert.equal(step.scene.count, original.length)
      assert.deepEqual(step.scene.nodes.map((node) => node.id), before.map((entry) => entry.id))
      assert.equal(step.scene.nodes.some((node) => node.tone === 'new'), false)
      assert.equal(step.scene.slots.length, 0)
      assert.equal(step.scene.edges.length, original.length - 1)
    }
    const compared = animation.steps.filter((step) => step.code.startsWith('if ('))
    assert.deepEqual(compared.map((step) => step.scene.focusId), original.getSearchPath(value).map((entry) => entry.id))
    assert.deepEqual(new InsertionAnimation(original, value).steps, animation.steps)
    assert.deepEqual(original.getEntries(), before)
    TreeAssertions.checkFinal(animation)
  }
})

test('duplicate rejection remains a no-op after commit, rewind, replay, and selecting a different input', () => {
  const original = BinaryTree.createDefault()
  const before = original.getEntries()
  const animation = new InsertionAnimation(original, 50)
  let committed = original
  const controller = new AnimationController(animation.steps, {
    onTimelineChange(index) { committed = index === animation.steps.length - 1 ? animation.result : original },
  }, { schedule() { return 1 }, cancel() {} })
  controller.seek(animation.steps.length - 1)
  assert.deepEqual(committed.getEntries(), before)
  controller.previous()
  assert.equal(committed, original)
  controller.seek(animation.steps.length - 1)
  controller.play()
  assert.equal(committed, original)
  controller.seek(animation.steps.length - 1)
  assert.deepEqual(committed.getEntries(), before)
  controller.dispose()
  const fresh = new InsertionAnimation(committed, 99)
  assert.equal(fresh.result.length, original.length + 1)
  assert.equal(fresh.result.getEntries().find((entry) => entry.value === 99).id, 'tree-node-10')
  assert.deepEqual(original.getEntries(), before)
})

test('tree layouts preserve child directions, leave room for labels, and contain every node', () => {
  for (const tree of [BinaryTree.createDefault(), TreeAssertions.create([1, 2, 3, 4, 5, 6, 7])]) {
    const scene = new BinaryTreeLayout().create(tree.getEntries())
    const nodes = new Map(scene.nodes.map((node) => [node.id, node]))
    for (const entry of tree.getEntries()) {
      const node = nodes.get(entry.id)
      assert.ok(node.x >= 80 && node.x + 80 <= scene.width)
      assert.ok(node.y >= 80 && node.y + 80 <= scene.height)
      for (const [childId, direction] of [[entry.leftId, -1], [entry.rightId, 1]]) {
        if (childId === null) continue
        const child = nodes.get(childId)
        assert.ok((child.x - node.x) * direction > 0)
        assert.ok(child.y - node.y >= 154)
      }
    }
  }
})

test('tree information distinguishes complexity cases and explains the average-case assumption', () => {
  const information = InsertionAnimation.describe(10)
  assert.equal(information.time.best, 'O(1)')
  assert.equal(information.time.average, 'O(log n)')
  assert.equal(information.time.worst, 'O(n)')
  for (const scenario of ['best', 'average', 'worst']) {
    assert.equal(information.memory[scenario], 'O(1)')
  }
  assert.deepEqual(information.terms.map((term) => term.symbol), [
    'n', 'h', 'O(h)', 'O(log n)', 'O(n)', 'O(1)',
  ])
  assert.match(information.time.explanation, /tree height/)
  assert.match(information.time.explanation, /distinct keys inserted in random order/)
  assert.match(information.time.explanation, /sorted distinct keys/)
  assert.match(information.terms[0].meaning, /n = 10/)
  assert.match(information.summary, /Duplicate keys are rejected/)
  assert.match(information.memory.explanation, /Rejected duplicates allocate no node/)
  for (const size of [0, 1, 11]) {
    assert.match(InsertionAnimation.describe(size).terms[0].meaning, new RegExp(`n = ${size}\\.`))
  }
})
