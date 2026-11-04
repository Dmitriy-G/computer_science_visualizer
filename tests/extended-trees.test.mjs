import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createHash } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { ExtendedTreeCatalog } from '../src/visualization/ExtendedTreeCatalog.ts'
import { ExtendedTreeDefinitions } from '../src/visualization/ExtendedTreeDefinitions.ts'
import { ExtendedTreeActionCatalog } from '../src/visualization/ExtendedTreeActionCatalog.ts'
import { ExtendedTreeAnimation } from '../src/visualization/ExtendedTreeAnimation.ts'
import { ExtendedTreeInput } from '../src/visualization/ExtendedTreeInput.ts'
import { AdditionalTreeCatalog } from '../src/visualization/AdditionalTreeCatalog.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'
import { SHA256 } from '../src/components/AdvancedDataStructures/Integrity/MerkleTree/SHA256.ts'

const model = (kind) => {
  const value = ExtendedTreeCatalog.createDefault(kind)
  assert.ok(value, kind)
  return value
}

const layout = { create: (value, frame) => {
  return ExtendedTreeCatalog.createScene(value, frame)
} }

const assertScene = (scene) => {
  const ids = new Set(scene.nodes.map((node) => node.id))
  assert.equal(ids.size, scene.nodes.length, 'scene node IDs must be unique')
  assert.equal(new Set(scene.edges.map((edge) => edge.id)).size, scene.edges.length)
  for (const node of scene.nodes) {
    assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y))
    assert.ok(node.x >= 0 && node.x <= scene.width)
    assert.ok(node.y >= 0 && node.y <= scene.height)
  }
  for (const edge of scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to), `dangling edge ${edge.id}`)
}

test('all 24 new trees have ten-element previews, Overview actions, input routing, and information', () => {
  assert.equal(ExtendedTreeDefinitions.structures.length, 24)
  const stored = AdditionalTreeCatalog.createModels()
  for (const definition of ExtendedTreeDefinitions.structures) {
    const value = stored.get(definition.kind)
    assert.ok(value)
    assert.equal(value.length, 10, definition.name)
    assert.equal(StructureCatalog.getGroupForStructure(definition.kind), ['radix-tree', 'ternary-search-tree', 'suffix-tree'].includes(definition.kind) ? 'string-text' : 'trees')
    assert.equal(StructureCatalog.getName(definition.kind), definition.name)
    assert.equal(ActionInputRequest.supportsStructure(definition.kind), true)
    const actions = ExtendedTreeActionCatalog.getActions(definition.kind)
    assert.ok(actions.length >= 3)
    assert.deepEqual(ActionCatalog.getScopedActions(definition.kind, 'overview'), actions)
    assert.deepEqual(ActionCatalog.getScopedActions(definition.kind, 'sorting'), [])
    const info = StructureInformation.get(definition.kind)
    assert.equal(info.useCases.length, 4)
    for (const technology of info.technologies) assert.match(technology.url, /^https:\/\//)
    assertScene(AdditionalTreeCatalog.createScene(value))
    assert.deepEqual(value.clone().getDiagram(), value.getDiagram())
  }
  assert.equal(StructureCatalog.getName('binary-tree'), 'Binary search tree (BST)')
  assert.equal(StructureCatalog.getName('unordered-binary-tree'), 'Binary Tree')
})

const validateSearchTree = (tree, kind) => {
  const visit = (node, parent, low, high) => {
    if (!node) return { size: 0, height: 0 }
    assert.equal(node.parent, parent)
    assert.ok(low < node.key && node.key < high, `${kind}: BST order`)
    const left = visit(node.left, node, low, node.key)
    const right = visit(node.right, node, node.key, high)
    assert.equal(node.size, 1 + left.size + right.size, `${kind}: subtree count`)
    if (kind === 'treap') {
      if (node.left) assert.ok(node.priority <= node.left.priority)
      if (node.right) assert.ok(node.priority <= node.right.priority)
    }
    if (kind === 'aa-tree') {
      assert.equal(node.left?.level ?? 0, node.level - 1)
      assert.ok((node.right?.level ?? 0) === node.level || (node.right?.level ?? 0) === node.level - 1)
      assert.ok((node.right?.right?.level ?? 0) < node.level)
      if (node.level > 1) assert.ok(node.left && node.right)
    }
    if (kind === 'order-statistic-tree') {
      assert.ok(Math.abs(left.height - right.height) <= 1)
      assert.equal(node.height, 1 + Math.max(left.height, right.height))
    }
    return { size: 1 + left.size + right.size, height: 1 + Math.max(left.height, right.height) }
  }
  const result = visit(tree.root, null, -Infinity, Infinity)
  assert.equal(result.size, tree.length)
  if (kind === 'scapegoat-tree' && tree.length) assert.ok(result.height - 1 <= Math.log(tree.upperSize) / Math.log(1.5) + 1e-9)
}

test('splay, treap, scapegoat, AA, and order-statistic policies survive monotone insertions and mixed deletions', () => {
  for (const kind of ['splay-tree', 'treap', 'scapegoat-tree', 'aa-tree', 'order-statistic-tree']) {
    const tree = model(kind)
    tree.execute('clear', {})
    for (let key = 0; key < 48; key += 1) {
      tree.execute('insert', { key })
      validateSearchTree(tree, kind)
    }
    const duplicate = tree.getDiagram()
    tree.execute('insert', { key: 20 })
    assert.deepEqual(tree.getDiagram(), duplicate)
    const copy = tree.clone()
    for (const key of [0, 47, 20, 1, 46, 23, 24, 10, 35, 2, 45]) {
      assert.equal(tree.execute('search-value', { key }).returnValue, true)
      if (kind === 'splay-tree') assert.equal(tree.root.key, key)
      tree.execute('delete-value', { key })
      validateSearchTree(tree, kind)
      assert.equal(tree.execute('search-value', { key }).returnValue, false)
      validateSearchTree(tree, kind)
    }
    assert.equal(copy.length, 48)
    assert.equal(tree.execute('search-value', { key: 999 }).returnValue, false)
    tree.execute('clear', {})
    assert.equal(tree.length, 0)
    tree.execute('insert', { key: -7 })
    validateSearchTree(tree, kind)
  }
})

test('rank/select use cached subtree sizes with absent and boundary keys', () => {
  const tree = model('order-statistic-tree')
  for (let rank = 0; rank < 10; rank += 1) assert.equal(tree.execute('select-rank', { rank }).returnValue, (rank + 1) * 10)
  for (const [key, expected] of [[-1, 0], [10, 0], [15, 1], [50, 4], [101, 10]]) assert.equal(tree.execute('rank', { key }).returnValue, expected)
  assert.throws(() => tree.execute('select-rank', { rank: 10 }))
})

test('unordered, general, and complete binary trees keep their distinct shape semantics', () => {
  const general = model('general-tree')
  const before = general.length
  general.execute('delete-value', { key: 20 })
  assert.ok(general.length < before - 1, 'general deletion removes descendants')
  const binary = model('unordered-binary-tree')
  assert.equal(binary.execute('search-value', { key: 90 }).returnValue, true, '90 is in the left subtree of 50')
  assert.throws(() => binary.execute('insert', { key: 999, parent: 50, side: 0 }))
  const unchanged = binary.getDiagram()
  assert.throws(() => binary.execute('insert', { key: 999, parent: -1, side: 0 }))
  assert.deepEqual(binary.getDiagram(), unchanged)
  const complete = model('complete-binary-tree')
  complete.execute('insert', { key: 50 })
  assert.equal(complete.length, 11, 'duplicates are values rather than unique keys')
  complete.execute('delete-value', { key: 80 })
  const entries = complete.getDiagram()
  for (let index = 0; index < entries.length; index += 1) assert.equal(entries[index].children.length, Math.max(0, Math.min(2, entries.length - (2 * index + 1))))
})

test('threaded traversal uses actual successor links and clone-independent insertions', () => {
  const tree = model('threaded-binary-tree')
  assert.deepEqual(tree.execute('traverse-inorder', {}).returnValue, [10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
  const copy = tree.clone()
  copy.execute('insert', { key: 35 })
  assert.equal(tree.length, 10)
  assert.equal(copy.length, 11)
  const values = copy.execute('traverse-inorder', {}).returnValue
  assert.deepEqual(values, [...values].sort((a, b) => a - b))
  assert.ok(copy.getThreads().length > 0)
  assertScene(ExtendedTreeCatalog.createScene(copy))
})

test('2-3 and 2-3-4 pages have legal occupancy and equal leaf depths', () => {
  for (const kind of ['two-three-tree', 'two-three-four-tree']) {
    const tree = model(kind)
    tree.execute('clear', {})
    for (let key = 0; key < 48; key += 1) tree.execute('insert', { key })
    const entries = tree.getDiagram()
    const byId = new Map(entries.map((entry) => [entry.id, entry]))
    const childIds = new Set(entries.flatMap((entry) => entry.children))
    const depths = new Set()
    const visit = (entry, depth, low, high) => {
      const keys = entry.text.split(' | ').map(Number)
      assert.ok(keys.length >= 1 && keys.length <= (kind === 'two-three-tree' ? 2 : 3))
      for (let index = 0; index < keys.length; index += 1) assert.ok((index ? keys[index - 1] : low) < keys[index] && keys[index] < high)
      if (!entry.children.length) depths.add(depth)
      else {
        assert.equal(entry.children.length, keys.length + 1)
        for (let index = 0; index < entry.children.length; index += 1) visit(byId.get(entry.children[index]), depth + 1, index ? keys[index - 1] : low, index < keys.length ? keys[index] : high)
      }
    }
    visit(entries.find((entry) => !childIds.has(entry.id)), 0, -Infinity, Infinity)
    assert.equal(depths.size, 1)
    for (let key = 0; key < 48; key += 1) assert.equal(tree.execute('search-value', { key }).returnValue, true)
  }
})

test('radix compression and ternary branches preserve words after deleting a shared prefix', () => {
  for (const kind of ['radix-tree', 'ternary-search-tree']) {
    const tree = model(kind)
    tree.execute('clear', {})
    for (const word of ['app', 'apple', 'apt', 'bat', 'bar', 'bark']) tree.execute('insert', { word })
    tree.execute('delete-value', { word: 'app' })
    assert.equal(tree.execute('search-value', { word: 'app' }).returnValue, false)
    assert.equal(tree.execute('search-value', { word: 'apple' }).returnValue, true)
    assert.equal(tree.execute('search-value', { word: 'ap' }).returnValue, false)
    if (kind === 'radix-tree') {
      assert.equal(tree.execute('starts-with', { word: 'ap' }).returnValue, true)
      assert.equal(tree.execute('starts-with', { word: 'b' }).returnValue, true, 'prefix can end inside compressed edge')
    }
    assertScene(ExtendedTreeCatalog.createScene(tree))
  }
})

test('compressed suffix queries agree with direct substring occurrence scans', () => {
  const tree = model('suffix-tree')
  for (const text of ['banana', 'aaaaaa', 'mississippi', 'abcdefghij']) {
    tree.execute('build-text', { text })
    for (const word of ['a', 'ana', 'issi', 'z', text, text + 'a']) {
      const expected = []
      for (let index = 0; index < text.length; index += 1) if (text.startsWith(word, index)) expected.push(index)
      assert.deepEqual([...tree.execute('search-value', { word }).returnValue].sort((a, b) => a - b), expected)
    }
    assertScene(ExtendedTreeCatalog.createScene(tree))
  }
})

test('Cartesian and sparse-table range minima agree on every valid subrange', () => {
  const values = [9, 3, 7, 1, 8, 2, 6, 4, 10, 5]
  for (const kind of ['cartesian-tree', 'sparse-table']) {
    const tree = model(kind)
    for (let minimum = 0; minimum < values.length; minimum += 1) for (let maximum = minimum; maximum < values.length; maximum += 1) assert.equal(tree.execute('range-min', { minimum, maximum }).returnValue, Math.min(...values.slice(minimum, maximum + 1)))
    assert.throws(() => tree.execute('range-min', { minimum: 5, maximum: 3 }))
  }
})

test('sparse-table cells occupy distinct level rows and correctly indexed columns', () => {
  const tree = model('sparse-table')
  tree.execute('build-values', { values: '0,1,2,3,4,5,6,7,8,9,10,11' })
  const scene = ExtendedTreeCatalog.createScene(tree)
  const origin = scene.nodes.find((node) => node.label === 'k=0; [0, 0]')
  const nextLevel = scene.nodes.find((node) => node.label === 'k=1; [0, 1]')
  const lastColumn = scene.nodes.find((node) => node.label === 'k=0; [11, 11]')
  assert.ok(origin && nextLevel && lastColumn)
  assert.equal(origin.x, nextLevel.x)
  assert.equal(origin.y, lastColumn.y)
  assert.ok(nextLevel.y > origin.y)
  assert.ok(lastColumn.x > origin.x)
  assert.equal(new Set(scene.nodes.map((node) => `${node.x},${node.y}`)).size, scene.nodes.length)
  assertScene(scene)
})

test('interval maxima prune correctly, including endpoint touching and extreme safe integers', () => {
  const tree = model('interval-tree')
  tree.execute('clear', {})
  const intervals = [[-10, -5], [0, 0], [5, 8], [7, 20], [Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER]]
  for (const [low, high] of intervals) tree.execute('insert', { low, high })
  for (const [low, high] of [[-5, -4], [1, 4], [20, 20], [21, 22], [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]]) {
    const expected = intervals.some(([a, b]) => a <= high && low <= b)
    assert.equal(tree.execute('search-overlap', { low, high }).returnValue !== null, expected)
  }
})

test('persistent updates branch from old roots and physically share untouched subtrees', () => {
  const tree = model('persistent-segment-tree')
  const before = tree.getDiagram()
  tree.execute('update-index', { version: 0, index: 0, value: -100 })
  tree.execute('update-index', { version: 0, index: 9, value: 100 })
  assert.equal(tree.versionCount, 3)
  assert.equal(tree.execute('range-sum', { version: 0, minimum: 0, maximum: 9 }).returnValue, 55n)
  assert.equal(tree.execute('range-sum', { version: 1, minimum: 0, maximum: 9 }).returnValue, -46n)
  assert.equal(tree.execute('range-sum', { version: 2, minimum: 0, maximum: 9 }).returnValue, 145n)
  assert.equal(tree.roots[0].right, tree.roots[1].right)
  assert.equal(tree.roots[0].left, tree.roots[2].left)
  const copy = tree.clone()
  copy.execute('update-index', { version: 1, index: 1, value: 500 })
  assert.equal(tree.versionCount, 3)
  assert.equal(copy.versionCount, 4)
  assert.ok(tree.getDiagram().length > before.length)
  assertScene(ExtendedTreeCatalog.createScene(tree))
  assert.throws(() => tree.execute('range-sum', { version: 7, minimum: 0, maximum: 1 }))
})

test('point partitions and BVH inclusive bounds return expected records', () => {
  for (const kind of ['kd-tree', 'quadtree', 'octree']) {
    const tree = model(kind)
    tree.execute('clear', {})
    const points = [[-2, -2, -2], [0, 0, 0], [1, 2, 3], [1, 3, 2], [10, 10, 10]]
    for (const [x, y, z] of points) tree.execute('insert', { x, y, z })
    tree.execute('insert', { x: 0, y: 0, z: 0 })
    assert.equal(tree.length, 5)
    assert.equal(tree.execute('search-overlap', { minX: 0, minY: 0, minZ: 0, maxX: 1, maxY: 2, maxZ: 3 }).returnValue.length, 2)
    assert.equal(tree.execute('search-overlap', { minX: 11, minY: 11, minZ: 11, maxX: 12, maxY: 12, maxZ: 12 }).returnValue.length, 0)
    assertScene(ExtendedTreeCatalog.createScene(tree))
  }
  const bvh = model('bvh')
  bvh.execute('clear', {})
  bvh.execute('insert', { minX: -2, minY: -2, maxX: 0, maxY: 0 })
  bvh.execute('insert', { minX: 5, minY: 5, maxX: 10, maxY: 10 })
  assert.equal(bvh.execute('search-overlap', { minX: 0, minY: 0, maxX: 0, maxY: 0 }).returnValue.length, 1)
  assert.equal(bvh.execute('search-overlap', { minX: 1, minY: 1, maxX: 2, maxY: 2 }).returnValue.length, 0)
})

test('SHA-256 matches Node crypto and Merkle proofs reject changed leaf values', () => {
  for (const text of ['', 'abc', 'a'.repeat(55), 'a'.repeat(56), 'a'.repeat(64), 'a'.repeat(1000)]) assert.equal(SHA256.digest(new TextEncoder().encode(text)), createHash('sha256').update(text).digest('hex'))
  const tree = model('merkle-tree')
  const original = tree.rootHash
  for (let index = 0; index < 10; index += 1) {
    assert.equal(tree.execute('verify-proof', { index, value: index + 1 }).returnValue, true)
    assert.equal(tree.execute('verify-proof', { index, value: index + 100 }).returnValue, false)
  }
  const copy = tree.clone()
  copy.execute('update-index', { index: 4, value: -100 })
  assert.equal(tree.rootHash, original)
  assert.notEqual(copy.rootHash, original)
  assert.equal(copy.execute('verify-proof', { index: 4, value: -100 }).returnValue, true)
  assert.equal(copy.execute('verify-proof', { index: 4, value: 5 }).returnValue, false)
})

test('vEB membership, strict successors, and deletion match a sorted integer set', () => {
  const tree = model('van-emde-boas-tree')
  tree.execute('clear', {})
  const keys = [0, 1, 2, 3, 7, 15, 16, 17, 31, 63, 64, 127, 128, 200, 254, 255]
  for (const key of keys) tree.execute('insert', { key })
  const remaining = new Set(keys)
  const verify = () => {
    const sorted = [...remaining].sort((a, b) => a - b)
    assert.equal(tree.length, sorted.length)
    for (let key = 0; key < 256; key += 1) {
      assert.equal(tree.execute('search-value', { key }).returnValue, remaining.has(key))
      assert.equal(tree.execute('successor', { key }).returnValue, sorted.find((value) => value > key) ?? null)
    }
  }
  verify()
  for (const key of [0, 255, 16, 128, 1, 254, 2, 3, 7, 15, 17, 31, 63, 64, 127, 200]) {
    tree.execute('delete-value', { key })
    remaining.delete(key)
    verify()
  }
  assert.throws(() => tree.execute('insert', { key: 256 }))
})

test('new tree dialogs validate text, CSV, axes, rank, index, and ordered bounds', () => {
  for (const definition of ExtendedTreeDefinitions.structures) {
    for (const action of ActionCatalog.getActions(definition.kind)) {
      const request = ActionInputRequest.create(definition.kind, action.kind, 10)
      if (action.kind === 'clear' || action.kind === 'traverse-inorder') assert.equal(request, null)
      else assert.ok(request?.structured, `${definition.kind}/${action.kind}`)
    }
  }
  assert.ok(Object.keys(ExtendedTreeInput.create('sparse-table', 'build-values', 10).validate({ values: '1,,2' })).length)
  assert.deepEqual(ExtendedTreeInput.create('sparse-table', 'build-values', 10).parse({ values: '-1, 0, 42' }), { values: '-1, 0, 42' })
  assert.ok(ExtendedTreeInput.create('interval-tree', 'insert', 10).validate({ low: '9', high: '2' }).high)
  assert.ok(ExtendedTreeInput.create('octree', 'insert', 10).validate({ x: '0', y: '0', z: '1024' }).z)
  assert.ok(ExtendedTreeInput.create('van-emde-boas-tree', 'insert', 10).validate({ key: '-1' }).key)
  assert.equal(ExtendedTreeInput.create('sparse-table', 'range-min', 0).available, false)
})

test('new tree playback bounds traces, preserves originals, and rolls back rejected clones', () => {
  const original = model('splay-tree')
  const before = original.getDiagram()
  const sequence = new ExtendedTreeAnimation(original, layout, 'insert', { key: 999 }, 'Insert', 'Insert a key')
  assert.deepEqual(original.getDiagram(), before)
  assert.equal(sequence.result.length, 11)
  assert.ok(sequence.steps.length > 2)
  assert.equal(new Set(sequence.steps.map((step) => `${step.scene.width},${step.scene.height}`)).size, 1)
  for (const step of sequence.steps) assertScene(step.scene)
  const invalid = new ExtendedTreeAnimation(original, layout, 'insert', { key: 1.5 }, 'Insert', 'Insert a key')
  assert.deepEqual(invalid.result.getDiagram(), before)
  assert.equal(invalid.steps.length, 2)
  assert.match(invalid.steps.at(-1).description, /unchanged/)
  const big = model('sparse-table')
  const bounded = new ExtendedTreeAnimation(big, layout, 'build-values', { values: Array.from({ length: 64 }, (_, index) => String(64 - index)).join(',') }, 'Build', 'Build values')
  assert.ok(bounded.steps.length <= 98)
  assert.match(bounded.steps.at(-1).description, /omitted/)
  assert.equal(bounded.result.execute('range-min', { minimum: 0, maximum: 63 }).returnValue, 1)
})

test('every new action owns its component, stylesheet, sequence, and complexity description', () => {
  const featuresUrl = new URL('../src/components/StructureFeatures/ExtendedTreeFeatures.tsx', import.meta.url)
  const features = readFileSync(featuresUrl, 'utf8')
  const imports = [...features.matchAll(/import \{ (\w+)Animation as \w+Sequence \} from '([^']+)'/g)]
  assert.equal(imports.length, 89)
  for (const [, name, relative] of imports) {
    const base = new URL(relative, featuresUrl)
    const source = readFileSync(base, 'utf8')
    assert.match(source, /static describe\(size: number\)/)
    assert.match(source, /time: \{ best: .*average: .*worst:/)
    assert.match(source, /memory: \{ best: .*average: .*worst:/)
    assert.ok(existsSync(new URL(`./${name}.tsx`, base)))
    assert.ok(existsSync(new URL(`./${name}.css`, base)))
  }
})

test('all 89 action sequences accept their dialogs, snapshot independently, and commit only the final result', async () => {
  const featuresUrl = new URL('../src/components/StructureFeatures/ExtendedTreeFeatures.tsx', import.meta.url)
  const features = readFileSync(featuresUrl, 'utf8')
  const imports = [...features.matchAll(/import \{ (\w+)Animation as \w+Sequence \} from '([^']+)'/g)]
  let inspected = 0
  for (const [, folder, relative] of imports) {
    const moduleUrl = new URL(relative, featuresUrl)
    const className = moduleUrl.pathname.split('/').at(-3)
    const source = readFileSync(new URL(`../${className}.ts`, moduleUrl), 'utf8')
    const kind = /readonly kind = '([^']+)'/.exec(source)[1]
    const tree = model(kind)
    const { [folder + 'Animation']: Sequence } = await import(moduleUrl.href)
    const sequenceSource = readFileSync(moduleUrl, 'utf8')
    const action = /super\(model, new \w+Layout\(\), '([^']+)'/.exec(sequenceSource)[1]
    const values = { key: 33, parent: kind === 'unordered-binary-tree' ? 100 : 10, side: 0, word: 'ana', text: 'banana', value: 4, values: '9,-2,3,1', low: 2, high: 7, index: 3, minimum: 2, maximum: 7, rank: 3, version: 0, x: 2, y: 3, z: 4, minX: 0, minY: 0, minZ: 0, maxX: 10, maxY: 10, maxZ: 10 }
    const request = ActionInputRequest.create(kind, action, tree.length)
    const drafts = {}
    if (request) {
      for (const field of request.structured.fields) drafts[field.name] = String(values[field.name])
      assert.deepEqual(request.structured.validate(drafts), {}, `${kind}/${action}`)
    }
    const input = request ? request.structured.parse(drafts) : {}
    const original = structuredClone(tree.getDiagram())
    const plan = new Sequence(tree, input)
    assert.deepEqual(tree.getDiagram(), original)
    assert.equal(plan.steps.at(-1).scene.count, plan.result.length)
    assert.ok(plan.steps.length >= 2 && plan.steps.length <= 98)
    assert.doesNotMatch(plan.steps.at(-1).description, /committed structure is unchanged/, `${kind}/${action} unexpectedly rejected`)
    const first = structuredClone(plan.steps[0].scene)
    let phase = 0
    for (const [index, step] of plan.steps.entries()) {
      assertScene(step.scene)
      assert.ok(step.phase >= phase)
      phase = step.phase
      if (index < plan.steps.length - 1) assert.equal(step.scene.count, tree.length)
    }
    assert.equal(new Set(plan.steps.map((step) => `${step.scene.width},${step.scene.height}`)).size, 1)
    assert.deepEqual(plan.steps[0].scene, first)
    assert.deepEqual(new Sequence(tree, input).steps, plan.steps)
    const info = Sequence.describe(tree.length)
    assert.equal(new Set(info.terms.map((term) => term.symbol)).size, info.terms.length)
    inspected += 1
  }
  assert.equal(inspected, 89)
})
