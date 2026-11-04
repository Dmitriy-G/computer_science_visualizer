import assert from 'node:assert/strict'
import { test } from 'node:test'
import { DisjointSet } from '../src/components/DataStructuresOverview/SetUnion/DisjointSet/DisjointSet.ts'
import { OrderedSet } from '../src/components/DataStructuresOverview/SetUnion/OrderedSet/OrderedSet.ts'
import { Multiset } from '../src/components/DataStructuresOverview/SetUnion/Multiset/Multiset.ts'
import { IntervalSet } from '../src/components/DataStructuresOverview/SetUnion/IntervalSet/IntervalSet.ts'
import { SetUnionStructureCatalog } from '../src/visualization/SetUnionStructureCatalog.ts'
import { SetUnionStructureDefinitions } from '../src/visualization/SetUnionStructureDefinitions.ts'
import { LinearStructureCatalog } from '../src/visualization/LinearStructureCatalog.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { MenuNavigation } from '../src/components/MainMenu/MenuNavigation.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'

const insert = (model, value) => model.execute('insert', { value })
const view = (model) => SetUnionStructureCatalog.createScene(model)

const assertForest = (model) => {
  const entries = model.getEntries()
  const byValue = new Map(entries.map((entry) => [entry.value, entry]))
  assert.equal(byValue.size, model.length)
  assert.equal(new Set(entries.map((entry) => entry.id)).size, model.length)
  for (const entry of entries) {
    let node = entry
    const seen = new Set()
    while (node.parent !== node.value) {
      assert.ok(!seen.has(node.value), 'Parent links must be acyclic')
      seen.add(node.value)
      const parent = byValue.get(node.parent)
      assert.ok(parent)
      assert.ok(parent.rank > node.rank, 'Ranks strictly increase toward the root')
      node = parent
    }
  }
}

const assertAVL = (model, expected) => {
  const entries = model.getEntries()
  const byId = new Map(entries.map((entry) => [entry.id, entry]))
  const ordered = []
  const seen = new Set()
  const visit = (id, low, high) => {
    if (id === null) return 0
    const node = byId.get(id)
    assert.ok(node && !seen.has(id))
    seen.add(id)
    assert.ok(node.value > low && node.value < high)
    const left = visit(node.leftId, low, node.value)
    ordered.push(node.value)
    const right = visit(node.rightId, node.value, high)
    assert.equal(node.height, 1 + Math.max(left, right))
    assert.ok(Math.abs(left - right) <= 1)
    return node.height
  }
  visit(entries[0]?.id ?? null, -Infinity, Infinity)
  assert.equal(seen.size, model.length)
  assert.deepEqual(ordered, [...expected].sort((a, b) => a - b))
}

const intervals = (model) => model.getIntervals().map((entry) => [entry.minimum, entry.maximum])
const assertIntervals = (model) => {
  const entries = model.getIntervals()
  assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length)
  for (let index = 0; index < entries.length; index += 1) {
    assert.ok(entries[index].minimum <= entries[index].maximum)
    if (index) assert.ok(BigInt(entries[index - 1].maximum) + 1n < BigInt(entries[index].minimum))
  }
}

test('union-find compresses real parent paths, preserves ranks, and validates both endpoints atomically', () => {
  const model = DisjointSet.createDefault()
  assertForest(model)
  const before = model.getEntries()
  assert.notEqual(before.find((entry) => entry.value === 80).parent, 10)
  const clone = model.clone()
  assert.equal(model.execute('find-set', { value: 80 }).value, 10)
  assert.equal(model.getEntries().find((entry) => entry.value === 80).parent, 10)
  assert.deepEqual(clone.getEntries(), before)
  assert.deepEqual(model.getEntries().map((entry) => entry.rank), before.map((entry) => entry.rank))
  assert.equal(model.execute('connected', { first: 20, second: 80 }).value, true)
  assert.equal(model.execute('connected', { first: 20, second: 100 }).value, false)
  const uncompressed = clone.getEntries()
  assert.equal(clone.execute('union', { first: 80, second: 999 }).status, 'REJECTED')
  assert.deepEqual(clone.getEntries(), uncompressed)
  assert.equal(clone.execute('connected', { first: 80, second: 999 }).status, 'REJECTED')
  assert.deepEqual(clone.getEntries(), uncompressed)
  model.execute('union', { first: 100, second: 80 })
  assert.equal(model.execute('connected', { first: 100, second: 80 }).value, true)
  assertForest(model)
  const priorClear = model.getEntries()
  model.execute('clear', {}, { onLinearChange: () => assertForest(model) })
  assert.equal(model.length, 0)
  insert(model, 80)
  assert.ok(!priorClear.some((entry) => entry.id === model.getEntries()[0].id))
  assert.equal(model.execute('find-set', { value: 999 }).status, 'REJECTED')
})

test('ordered set keeps AVL invariants through rotations, successor deletion, misses, and bounds', () => {
  const model = new OrderedSet()
  const expected = new Set()
  const keys = [30, 10, 20, 50, 40, 60, 5, 15, 25, 45, 55, 65, -2, 0]
  for (const value of keys) {
    insert(model, value)
    expected.add(value)
    assertAVL(model, expected)
  }
  const shape = model.getEntries()
  assert.equal(insert(model, 20).status, 'REJECTED')
  assert.deepEqual(model.getEntries(), shape)
  assert.equal(model.execute('lower-bound', { value: 21 }).value, 25)
  assert.equal(model.execute('lower-bound', { value: 25 }).value, 25)
  assert.equal(model.execute('lower-bound', { value: 100 }).value, null)
  assert.equal(model.execute('lower-bound', { value: -100 }).value, -2)
  assert.equal(model.execute('search-value', { value: 15 }).value, true)
  assert.equal(model.execute('search-value', { value: 16 }).value, false)
  const clone = model.clone()
  for (const value of [30, 10, 65, 20, 999, ...keys]) {
    model.execute('delete-value', { value })
    expected.delete(value)
    assertAVL(model, expected)
  }
  assert.deepEqual(clone.getEntries(), shape)
  assert.equal(model.execute('lower-bound', { value: 0 }).value, null)
  clone.execute('clear', {})
  assert.equal(clone.length, 0)
  insert(clone, Number.MIN_SAFE_INTEGER)
  insert(clone, Number.MAX_SAFE_INTEGER)
  assertAVL(clone, new Set([Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]))
})

test('bag counts duplicates, removes one at a time, and never stores a zero count', () => {
  const model = Multiset.createDefault()
  assert.equal(model.length, 10)
  assert.equal(model.distinctCount, 6)
  assert.equal(model.execute('count-value', { value: 30 }).value, 3)
  const clone = model.clone()
  const id = model.getEntries().find((entry) => entry.value === 30).id
  for (let count = 2; count >= 0; count -= 1) {
    model.execute('delete-value', { value: 30 })
    assert.equal(model.execute('count-value', { value: 30 }).value, count)
    if (count) assert.equal(model.getEntries().find((entry) => entry.value === 30).id, id)
  }
  assert.equal(model.length, 7)
  assert.equal(model.execute('delete-value', { value: 30 }).value, false)
  assert.equal(model.execute('count-value', { value: -100 }).value, 0)
  assert.equal(clone.execute('count-value', { value: 30 }).value, 3)
  insert(model, 30)
  assert.notEqual(model.getEntries().find((entry) => entry.value === 30).id, id)
  model.execute('clear', {})
  assert.equal(model.length, 0)
  assert.equal(model.distinctCount, 0)
  insert(model, Number.MIN_SAFE_INTEGER)
  assert.equal(model.execute('count-value', { value: Number.MIN_SAFE_INTEGER }).value, 1)
})

test('interval union coalesces adjacency and containment; difference splits exact closed endpoints', () => {
  const model = new IntervalSet()
  model.execute('insert', { minimum: 1, maximum: 5 })
  model.execute('insert', { minimum: 10, maximum: 15 })
  model.execute('insert', { minimum: 6, maximum: 9 })
  assert.deepEqual(intervals(model), [[1, 15]])
  const originalId = model.getIntervals()[0].id
  model.execute('insert', { minimum: 3, maximum: 4 })
  assert.deepEqual(intervals(model), [[1, 15]])
  assert.equal(model.getIntervals()[0].id, originalId)
  model.execute('delete-value', { minimum: 5, maximum: 10 })
  assert.deepEqual(intervals(model), [[1, 4], [11, 15]])
  assert.equal(model.getIntervals()[0].id, originalId)
  assertIntervals(model)
  const clone = model.clone()
  assert.equal(model.execute('search-value', { value: 4 }).value, true)
  assert.equal(model.execute('search-value', { value: 5 }).value, false)
  assert.equal(model.execute('search-overlap', { minimum: 4, maximum: 12 }).value, '[4, 4], [11, 12]')
  assert.deepEqual(intervals(model), intervals(clone))
  model.execute('delete-value', { minimum: 1, maximum: 1 })
  model.execute('delete-value', { minimum: 15, maximum: 15 })
  assert.deepEqual(intervals(model), [[2, 4], [11, 14]])
  model.execute('delete-value', { minimum: -100, maximum: 100 })
  assert.deepEqual(intervals(model), [])
  assert.deepEqual(intervals(clone), [[1, 4], [11, 15]])
})

test('interval endpoints remain exact across the full safe-integer domain without enumerating coverage', () => {
  const model = new IntervalSet()
  const minimum = Number.MIN_SAFE_INTEGER
  const maximum = Number.MAX_SAFE_INTEGER
  model.execute('insert', { minimum, maximum })
  assert.deepEqual(intervals(model), [[minimum, maximum]])
  model.execute('delete-value', { minimum: minimum + 1, maximum: maximum - 1 })
  assert.deepEqual(intervals(model), [[minimum, minimum], [maximum, maximum]])
  model.execute('insert', { minimum: minimum + 1, maximum: maximum - 1 })
  assert.deepEqual(intervals(model), [[minimum, maximum]])
  assertIntervals(model)
  const before = view(model)
  assert.throws(() => model.execute('insert', { minimum: 2, maximum: 1 }), RangeError)
  assert.throws(() => model.execute('delete-value', { minimum: 0.5, maximum: 1 }), TypeError)
  assert.deepEqual(view(model), before)
})

test('deterministic interval edit sequences agree with an independent finite-domain membership set', () => {
  const model = new IntervalSet()
  const expected = new Set()
  for (let step = 0; step < 80; step += 1) {
    const minimum = step * 17 % 41 - 20
    const maximum = Math.min(20, minimum + step % 9)
    const action = step % 3 ? 'insert' : 'delete-value'
    model.execute(action, { minimum, maximum })
    for (let value = minimum; value <= maximum; value += 1) {
      if (action === 'insert') expected.add(value)
      else expected.delete(value)
    }
    assertIntervals(model)
    for (let value = -21; value <= 21; value += 1) assert.equal(model.execute('search-value', { value }).value, expected.has(value))
  }
})

test('all capacity rejections preserve shape, counters, and subsequent stable identities', () => {
  for (const Model of [DisjointSet, OrderedSet, Multiset]) {
    const model = new Model()
    for (let value = 0; value < 64; value += 1) insert(model, value)
    const before = view(model)
    const control = model.clone()
    assert.equal(insert(model, 100).status, 'REJECTED')
    assert.deepEqual(view(model), before)
    model.execute('clear', {})
    control.execute('clear', {})
    insert(model, 100)
    insert(control, 100)
    assert.deepEqual(view(model), view(control))
  }
  const model = new IntervalSet()
  for (let index = 0; index < 64; index += 1) model.execute('insert', { minimum: index * 10, maximum: index * 10 + 4 })
  const before = view(model)
  const control = model.clone()
  assert.equal(model.execute('insert', { minimum: 1000, maximum: 1001 }).status, 'REJECTED')
  assert.deepEqual(view(model), before)
  assert.equal(model.execute('delete-value', { minimum: 2, maximum: 2 }).status, 'REJECTED')
  assert.deepEqual(view(model), before)
  model.execute('clear', {})
  control.execute('clear', {})
  model.execute('insert', { minimum: 2, maximum: 2 })
  control.execute('insert', { minimum: 2, maximum: 2 })
  assert.deepEqual(view(model), view(control))
})

const actions = {
  'disjoint-set': ['MakeSet', 'FindRepresentative', 'Union', 'Connected', 'Clear'],
  'ordered-set': ['Add', 'Contains', 'LowerBound', 'Remove', 'Clear'],
  multiset: ['Add', 'Count', 'RemoveOne', 'Clear'],
  'interval-set': ['AddInterval', 'SubtractInterval', 'Contains', 'Intersection', 'Clear'],
}
const folders = { 'disjoint-set': 'DisjointSet', 'ordered-set': 'OrderedSet', multiset: 'Multiset', 'interval-set': 'IntervalSet' }

for (const definition of SetUnionStructureDefinitions.structures) {
  test(`${definition.name}: menu paths, inputs, independent bounded playback, and real action results`, async () => {
    const model = LinearStructureCatalog.createModels().get(definition.kind)
    assert.equal(model.length, 10)
    assert.equal(StructureCatalog.getGroupForStructure(definition.kind), 'set-union')
    const picker = MenuNavigation.forStructure(definition.kind)
    const advanced = definition.kind === 'interval-set'
    assert.equal(picker.group, advanced ? 'range-queries-persistence' : 'set-union')
    assert.deepEqual(picker.getPath(), advanced ? ['Advanced Data Structures', 'Range Queries'] : ['Fundamental Data Structures', 'Set / Union'])
    assert.ok(StructureInformation.get(definition.kind).useCases.length >= 4)
    assert.ok(StructureInformation.get(definition.kind).technologies.every((technology) => technology.url.startsWith('https://')))
    const choices = ActionCatalog.getScopedActions(definition.kind, 'overview')
    const source = view(model)
    for (let index = 0; index < choices.length; index += 1) {
      const action = choices[index]
      const folder = actions[definition.kind][index]
      const module = await import(`../src/components/DataStructuresOverview/SetUnion/${folders[definition.kind]}/${folder}/${folder}Animation.ts`)
      const Sequence = module[`${folder}Animation`]
      const first = new Sequence(model)
      const second = new Sequence(model)
      assert.deepEqual(first.steps, second.steps)
      assert.deepEqual(view(model), source)
      assert.notEqual(first.result, model)
      assert.ok(first.steps.length >= 2 && first.steps.length <= 98)
      const final = first.steps.at(-1)
      assert.equal(final.scene.count, first.result.length)
      for (const step of first.steps) {
        assert.equal(step.scene.width, final.scene.width)
        assert.equal(step.scene.height, final.scene.height)
        const ids = new Set(step.scene.nodes.map((node) => node.id))
        assert.equal(ids.size, step.scene.nodes.length)
        if (step.scene.focusId) assert.ok(ids.has(step.scene.focusId))
        for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
      }
      for (const step of first.steps.slice(0, -1)) assert.equal(step.scene.count, model.length)
      const description = Sequence.describe(model.length)
      for (const cost of [description.time, description.memory]) assert.ok(cost.best && cost.average && cost.worst && cost.explanation)
      assert.equal(ActionInputRequest.requiresInput(model.kind, action.kind), action.kind !== 'clear')
      if (action.kind !== 'clear') {
        const request = ActionInputRequest.create(model.kind, action.kind, model.length).structured
        assert.ok(Object.keys(request.validate({})).length)
        const values = Object.fromEntries(request.fields.map((field) => [field.name, '20']))
        assert.deepEqual(request.validate(values), {})
        assert.ok(Object.values(request.parse(values)).every(Number.isSafeInteger))
        assert.ok(!request.acceptsDraft(request.fields[0], '1.5'))
        values[request.fields[0].name] = '9007199254740992'
        assert.ok(Object.keys(request.validate(values)).length)
      }
      if (['find-set', 'connected', 'lower-bound', 'count-value', 'search-value', 'search-overlap'].includes(action.kind)) assert.match(final.code, /^return /)
    }
    const empty = model.clone()
    empty.execute('clear', {})
    for (const action of choices) {
      if (action.kind === 'clear') continue
      const request = ActionInputRequest.create(model.kind, action.kind, empty.length).structured
      assert.equal(request.available, true)
    }
  })
}

test('interval input validates paired inclusive bounds before parsing', () => {
  const input = ActionInputRequest.create('interval-set', 'insert', 0).structured
  assert.ok(input.validate({ minimum: '5', maximum: '4' }).maximum)
  assert.deepEqual(input.parse({ minimum: '-5', maximum: '-5' }), { minimum: -5, maximum: -5 })
})

test('trace caps omit snapshots without skipping releases and keep previously recorded scenes independent', async () => {
  const { ClearAnimation } = await import('../src/components/DataStructuresOverview/SetUnion/DisjointSet/Clear/ClearAnimation.ts')
  const model = new DisjointSet()
  for (let value = 0; value < 64; value += 1) insert(model, value)
  const animation = new ClearAnimation(model)
  assert.equal(animation.steps.length, 98)
  assert.equal(animation.result.length, 0)
  assert.equal(model.length, 64)
  assert.match(animation.steps.at(-1).description, /omitted/)
  const originalScene = structuredClone(animation.steps[0].scene)
  animation.result.execute('insert', { value: 999 })
  model.execute('clear', {})
  assert.deepEqual(animation.steps[0].scene, originalScene)
})
