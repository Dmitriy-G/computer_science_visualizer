import assert from 'node:assert/strict'
import { test } from 'node:test'
import { AVLTree } from '../src/components/DataStructures/Trees/AVLTree/AVLTree.ts'
import { RedBlackTree } from '../src/components/DataStructures/Trees/RedBlackTree/RedBlackTree.ts'
import { BTree } from '../src/components/DataStructures/Trees/BTree/BTree.ts'
import { BPlusTree } from '../src/components/DataStructures/Trees/BPlusTree/BPlusTree.ts'
import { AVLTreeLayout } from '../src/components/DataStructures/Trees/AVLTree/AVLTreeLayout.ts'
import { RedBlackTreeLayout } from '../src/components/DataStructures/Trees/RedBlackTree/RedBlackTreeLayout.ts'
import { BTreeLayout } from '../src/components/DataStructures/Trees/BTree/BTreeLayout.ts'
import { BPlusTreeLayout } from '../src/components/DataStructures/Trees/BPlusTree/BPlusTreeLayout.ts'
import { InsertionAnimation as AVLInsert } from '../src/components/DataStructures/Trees/AVLTree/Insert/InsertionAnimation.ts'
import { SearchAnimation as AVLSearch } from '../src/components/DataStructures/Trees/AVLTree/SearchByValue/SearchAnimation.ts'
import { DeletionAnimation as AVLDelete } from '../src/components/DataStructures/Trees/AVLTree/DeleteByValue/DeletionAnimation.ts'
import { ClearAnimation as AVLClear } from '../src/components/DataStructures/Trees/AVLTree/Clear/ClearAnimation.ts'
import { InsertionAnimation as RBInsert } from '../src/components/DataStructures/Trees/RedBlackTree/Insert/InsertionAnimation.ts'
import { SearchAnimation as RBSearch } from '../src/components/DataStructures/Trees/RedBlackTree/SearchByValue/SearchAnimation.ts'
import { DeletionAnimation as RBDelete } from '../src/components/DataStructures/Trees/RedBlackTree/DeleteByValue/DeletionAnimation.ts'
import { ClearAnimation as RBClear } from '../src/components/DataStructures/Trees/RedBlackTree/Clear/ClearAnimation.ts'
import { InsertionAnimation as BInsert } from '../src/components/DataStructures/Trees/BTree/Insert/InsertionAnimation.ts'
import { SearchAnimation as BSearch } from '../src/components/DataStructures/Trees/BTree/SearchByValue/SearchAnimation.ts'
import { DeletionAnimation as BDelete } from '../src/components/DataStructures/Trees/BTree/DeleteByValue/DeletionAnimation.ts'
import { ClearAnimation as BClear } from '../src/components/DataStructures/Trees/BTree/Clear/ClearAnimation.ts'
import { InsertionAnimation as PlusInsert } from '../src/components/DataStructures/Trees/BPlusTree/Insert/InsertionAnimation.ts'
import { SearchAnimation as PlusSearch } from '../src/components/DataStructures/Trees/BPlusTree/SearchByValue/SearchAnimation.ts'
import { DeletionAnimation as PlusDelete } from '../src/components/DataStructures/Trees/BPlusTree/DeleteByValue/DeletionAnimation.ts'
import { ClearAnimation as PlusClear } from '../src/components/DataStructures/Trees/BPlusTree/Clear/ClearAnimation.ts'
import { RangeAnimation } from '../src/components/DataStructures/Trees/BPlusTree/RangeFromValue/RangeAnimation.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { AnimationController } from '../src/visualization/AnimationController.ts'
import { LinkedList } from '../src/components/DataStructures/Linear/LinkedList/LinkedList.ts'

const features = [
  [AVLTree, 'avl-tree', AVLTreeLayout, [AVLInsert, AVLSearch, AVLDelete, AVLClear]],
  [RedBlackTree, 'red-black-tree', RedBlackTreeLayout, [RBInsert, RBSearch, RBDelete, RBClear]],
  [BTree, 'b-tree', BTreeLayout, [BInsert, BSearch, BDelete, BClear]],
  [BPlusTree, 'b-plus-tree', BPlusTreeLayout, [PlusInsert, PlusSearch, PlusDelete, PlusClear, RangeAnimation]],
]

class TreeAssertions {
  static create(Model, values) {
    const tree = new Model()
    for (const value of values) tree.insert(value)
    return tree
  }

  static keys(tree) {
    const values = []
    for (const entry of tree.getEntries()) {
      if ('value' in entry) values.push(entry.value)
      else if (!(tree instanceof BPlusTree) || entry.leaf) values.push(...entry.keys)
    }
    return values.sort((a, b) => a - b)
  }

  static invariants(tree) {
    const entries = tree.getEntries()
    assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length)
    if (!entries.length) { assert.equal(tree.length, 0); return }
    const byId = new Map(entries.map((entry) => [entry.id, entry]))
    const visited = new Set()
    const leafDepths = new Set()
    const leaves = []
    let records = 0
    const walk = (id, minimum, maximum, depth) => {
      assert.ok(byId.has(id))
      assert.ok(!visited.has(id), 'no cycles or multiply attached children')
      visited.add(id)
      const entry = byId.get(id)
      if ('value' in entry) {
        assert.ok(entry.value > minimum && entry.value < maximum)
        records += 1
        const left = entry.leftId ? walk(entry.leftId, minimum, entry.value, depth + 1) : { height: 0, blackHeight: 1 }
        const right = entry.rightId ? walk(entry.rightId, entry.value, maximum, depth + 1) : { height: 0, blackHeight: 1 }
        if (tree instanceof AVLTree) {
          assert.equal(entry.height, 1 + Math.max(left.height, right.height))
          assert.ok(Math.abs(left.height - right.height) <= 1)
        }
        if (tree instanceof RedBlackTree) {
          assert.ok(entry.color === 'red' || entry.color === 'black')
          if (depth === 0) assert.equal(entry.color, 'black')
          if (entry.color === 'red') {
            if (entry.leftId) assert.equal(byId.get(entry.leftId).color, 'black')
            if (entry.rightId) assert.equal(byId.get(entry.rightId).color, 'black')
          }
          assert.equal(left.blackHeight, right.blackHeight)
        }
        return { height: 1 + Math.max(left.height, right.height), blackHeight: left.blackHeight + (entry.color === 'black' ? 1 : 0) }
      }
      assert.ok(entry.keys.length >= 1 && entry.keys.length <= 3)
      for (let index = 0; index < entry.keys.length; index += 1) {
        assert.ok(entry.keys[index] >= minimum && entry.keys[index] < maximum)
        if (index) assert.ok(entry.keys[index - 1] < entry.keys[index])
      }
      if (entry.leaf) {
        assert.equal(entry.childIds.length, 0)
        if (tree instanceof BPlusTree && depth > 0) assert.ok(entry.keys.length >= 2)
        records += entry.keys.length
        leafDepths.add(depth)
        leaves.push(entry)
        return { minimum: entry.keys[0], maximum: entry.keys.at(-1) }
      }
      assert.equal(entry.childIds.length, entry.keys.length + 1)
      if (!(tree instanceof BPlusTree)) records += entry.keys.length
      const ranges = []
      for (let index = 0; index < entry.childIds.length; index += 1) {
        const lower = index === 0 ? minimum : entry.keys[index - 1]
        const upper = index === entry.keys.length ? maximum : entry.keys[index]
        const range = walk(entry.childIds[index], lower, upper, depth + 1)
        if (tree instanceof BPlusTree && index > 0) assert.equal(range.minimum, entry.keys[index - 1])
        ranges.push(range)
      }
      return { minimum: ranges[0].minimum, maximum: ranges.at(-1).maximum }
    }
    walk(entries[0].id, -Infinity, Infinity, 0)
    assert.equal(visited.size, entries.length)
    assert.equal(records, tree.length)
    assert.equal(new Set(TreeAssertions.keys(tree)).size, tree.length)
    if ('keys' in entries[0]) assert.equal(leafDepths.size, 1)
    if (tree instanceof BPlusTree) {
      for (let index = 0; index < leaves.length; index += 1) assert.equal(leaves[index].nextId, leaves[index + 1]?.id ?? null)
      assert.deepEqual(tree.range(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), TreeAssertions.keys(tree))
    }
  }

  static scenes(plan, source, kind) {
    const final = plan.steps.at(-1).scene
    assert.equal(final.kind, kind)
    assert.equal(final.count, plan.result.length)
    const entries = plan.result.getEntries()
    assert.deepEqual(final.nodes.map((node) => node.id).sort(), entries.map((entry) => entry.id).sort())
    for (const step of plan.steps.slice(0, -1)) assert.equal(step.scene.count, source.length)
    let phase = 0
    for (const step of plan.steps) {
      assert.ok(step.phase >= phase && step.phase <= 5)
      phase = step.phase
      assert.ok(step.title && step.description && step.code && step.duration > 0)
      const ids = new Set(step.scene.nodes.map((node) => node.id))
      assert.equal(ids.size, step.scene.nodes.length)
      if (step.scene.focusId !== null) assert.ok(ids.has(step.scene.focusId))
      for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
      for (const node of step.scene.nodes) {
        assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y))
        assert.ok(node.x - (node.width ?? 66) / 2 >= 0)
        assert.ok(node.x + (node.width ?? 66) / 2 <= step.scene.width)
        assert.ok(node.y >= 33 && node.y + (node.height ?? 66) / 2 <= step.scene.height)
      }
    }
    TreeAssertions.invariants(plan.result)
  }
}

test('AVL insertion handles LL, RR, LR, and RL with explicit single/double rotation traces', () => {
  for (const values of [[30, 20, 10], [10, 20, 30], [30, 10, 20], [10, 30, 20]]) {
    const tree = TreeAssertions.create(AVLTree, values.slice(0, 2))
    const events = []
    tree.insert(values[2], { onTreeChange(event) { events.push(event) } })
    assert.equal(tree.getEntries()[0].value, 20)
    assert.equal(events.filter((event) => event.phase === 'rotate').length, values[0] === 30 && values[1] === 10 || values[0] === 10 && values[1] === 30 ? 2 : 1)
    TreeAssertions.invariants(tree)
  }
})

test('all new tree models preserve ordering, occupancy, balance, and colors throughout deterministic mixed operations', () => {
  for (const [Model] of features) {
    for (let seed = 1; seed <= 6; seed += 1) {
      const tree = new Model()
      const expected = new Set()
      let random = seed
      for (let operation = 0; operation < 220; operation += 1) {
        random = (random * 1664525 + 1013904223) >>> 0
        const value = (random >>> 8) % 61 - 30
        if (operation % 3 !== 0) {
          assert.equal(tree.insert(value), !expected.has(value))
          expected.add(value)
        } else {
          assert.equal(tree.deleteValue(value), expected.has(value))
          expected.delete(value)
        }
        TreeAssertions.invariants(tree)
        assert.deepEqual(TreeAssertions.keys(tree), [...expected].sort((a, b) => a - b))
        assert.equal(tree.find(value)?.value ?? null, expected.has(value) ? value : null)
      }
      for (const value of [...expected]) {
        assert.equal(tree.deleteValue(value), true)
        TreeAssertions.invariants(tree)
      }
      assert.equal(tree.length, 0)
    }
  }
})

test('red-black deletion repairs black-height deficits for roots, leaves, and successors', () => {
  for (const values of [[41, 38, 31, 12, 19, 8], Array.from({ length: 50 }, (_, index) => index), Array.from({ length: 50 }, (_, index) => 50 - index)]) {
    for (const reverse of [false, true]) {
      const tree = TreeAssertions.create(RedBlackTree, values)
      const events = []
      const deletion = reverse ? [...values].reverse() : values
      for (const value of deletion) {
        const before = new Map(tree.getEntries().map((entry) => [entry.value, entry.id]))
        tree.deleteValue(value, { onTreeChange(event) { events.push(event) } })
        TreeAssertions.invariants(tree)
        for (const entry of tree.getEntries()) assert.equal(entry.id, before.get(entry.value))
      }
      assert.equal(tree.length, 0)
      assert.ok(events.some((event) => event.phase === 'recolor'))
    }
  }
})

test('B-Tree and B+ Tree expose splits, borrowing in both directions, merging, and root contraction', () => {
  for (const Model of [BTree, BPlusTree]) {
    const events = []
    const observer = { onTreeChange(event) { events.push(event) } }
    for (const values of [[1, 2, 3, 4, 5], [5, 4, 3, 2, 1]]) {
      const tree = new Model()
      for (const value of values) tree.insert(value, observer)
      tree.deleteValue(values[0], observer)
      TreeAssertions.invariants(tree)
      for (const value of values.slice(1)) {
        tree.deleteValue(value, observer)
        TreeAssertions.invariants(tree)
      }
    }
    assert.ok(events.some((event) => event.phase === 'split'))
    assert.ok(events.some((event) => event.phase === 'borrow' && event.title.includes('left')))
    assert.ok(events.some((event) => event.phase === 'borrow' && event.title.includes('right')))
    assert.ok(events.some((event) => event.phase === 'merge'))
    const tree = Model.createDefault()
    const plan = Model === BTree ? new BInsert(tree, 99) : new PlusInsert(tree, 99)
    assert.ok(plan.steps.some((step) => step.title.includes('Split')))
    TreeAssertions.invariants(plan.result)
  }
})

test('B+ range scans return only leaf records, cross next links, and update separator minima after deletion', () => {
  const tree = TreeAssertions.create(BPlusTree, Array.from({ length: 40 }, (_, index) => index * 10))
  assert.deepEqual(tree.range(35, 105), [40, 50, 60, 70, 80, 90, 100])
  assert.deepEqual(tree.range(50, 50), [50])
  assert.deepEqual(tree.range(391, 500), [])
  assert.throws(() => tree.range(100, 99), RangeError)
  for (const value of [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200]) {
    tree.deleteValue(value)
    TreeAssertions.invariants(tree)
  }
  const plan = new RangeAnimation(tree, 150)
  assert.deepEqual(plan.values, TreeAssertions.keys(tree).filter((value) => value >= 150))
  assert.ok(plan.steps.some((step) => step.title === 'Follow the next leaf link'))
  assert.deepEqual(plan.result.getEntries(), tree.getEntries())
})

test('duplicates, misses, invalid values, snapshots, clones, and clear preserve model isolation and IDs', () => {
  for (const [Model] of features) {
    const tree = Model.createDefault()
    const before = tree.getEntries()
    assert.equal(tree.insert(50), false)
    assert.equal(tree.deleteValue(999), false)
    assert.deepEqual(tree.getEntries(), before)
    for (const value of [NaN, Infinity, -Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
      assert.throws(() => tree.insert(value), TypeError)
      assert.throws(() => tree.deleteValue(value), TypeError)
      assert.throws(() => tree.find(value), TypeError)
      assert.deepEqual(tree.getEntries(), before)
    }
    const clone = tree.clone()
    clone.deleteValue(50)
    clone.insert(55)
    TreeAssertions.invariants(clone)
    assert.deepEqual(tree.getEntries(), before)
    const snapshot = tree.getEntries()
    if ('value' in snapshot[0]) snapshot[0].value = 999
    else snapshot[0].keys[0] = 999
    assert.deepEqual(tree.getEntries(), before)
    tree.clear()
    tree.clear()
    assert.equal(tree.length, 0)
    assert.deepEqual(tree.getEntries(), [])
    tree.insert(500)
    assert.ok(!before.some((entry) => entry.id === tree.getEntries()[0].id))
    TreeAssertions.invariants(tree)
  }
})

test('all 17 new action plans handle empty, singleton, duplicate, hit, miss, and default inputs deterministically', () => {
  for (const [Model, kind, Layout, animations] of features) {
    for (const tree of [new Model(), TreeAssertions.create(Model, [50]), Model.createDefault()]) {
      for (const Animation of animations) {
        for (const value of [50, 99, -999]) {
          const before = tree.getEntries()
          const plan = new Animation(tree, value)
          TreeAssertions.scenes(plan, tree, kind)
          assert.deepEqual(new Animation(tree, value).steps, plan.steps)
          assert.deepEqual(tree.getEntries(), before)
          const frames = JSON.stringify(plan.steps)
          plan.result.insert(999)
          assert.equal(JSON.stringify(plan.steps), frames)
          assert.deepEqual(tree.getEntries(), before)
        }
      }
      const scene = new Layout().create(tree)
      assert.equal(scene.kind, kind)
      assert.equal(scene.count, tree.length)
    }
  }
})

test('playback commits only the final balanced result, restores the original on rewind, and does not repeat mutations', () => {
  for (const [Model, , , animations] of features) {
    for (const Animation of animations) {
      const original = Model.createDefault()
      const plan = new Animation(original, 50)
      const before = original.getEntries()
      const after = plan.result.getEntries()
      let committed = original
      const controller = new AnimationController(plan.steps, {
        onTimelineChange(index) { committed = index === plan.steps.length - 1 ? plan.result : original },
      }, { schedule() { return 1 }, cancel() {} })
      controller.seek(plan.steps.length - 1)
      assert.deepEqual(committed.getEntries(), after)
      controller.previous()
      assert.equal(committed, original)
      controller.seek(plan.steps.length - 1)
      controller.play()
      assert.equal(committed, original)
      controller.seek(plan.steps.length - 1)
      assert.deepEqual(committed.getEntries(), after)
      controller.dispose()
      assert.deepEqual(original.getEntries(), before)
    }
  }
})

test('Trees presents the existing BST and four new balanced tree choices with working actions and ten-key previews', () => {
  assert.equal(StructureCatalog.getName('binary-tree'), 'Binary search tree (BST)')
  for (const [Model, kind, , animations] of features) {
    assert.equal(StructureCatalog.getGroupForStructure(kind), 'trees')
    const actions = ActionCatalog.getActions(kind).map((action) => action.kind)
    assert.deepEqual(actions, ['insert', 'search-value', 'delete-value', 'clear', ...(Model === BPlusTree ? ['range-from-value'] : [])])
    const preview = StructureCatalog.createPreview(kind, LinkedList.createDefault())
    assert.equal(preview.kind, kind)
    assert.equal(preview.count, 10)
    if (Model === RedBlackTree) assert.ok(preview.nodes.every((node) => node.nodeColor && node.label.includes(node.nodeColor.toUpperCase())))
    if (Model === BTree || Model === BPlusTree) assert.ok(preview.nodes.every((node) => Array.isArray(node.keys)))
    TreeAssertions.invariants(Model.createDefault())
    for (const Animation of animations) {
      const info = Animation.describe(10)
      assert.match(info.terms[0].meaning, /n = 10\./)
      assert.match(info.memory.explanation, /Animation storage excluded/)
      assert.equal(new Set(info.terms.map((term) => term.symbol)).size, info.terms.length)
    }
  }
})
