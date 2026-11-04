import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HashMap } from '../src/components/FundamentalDataStructures/HashBased/HashMap/HashMap.ts'
import { HashSet } from '../src/components/FundamentalDataStructures/SetUnion/HashSet/HashSet.ts'
import { BloomFilter } from '../src/components/AdvancedDataStructures/Probabilistic/BloomFilter/BloomFilter.ts'
import { HashMapLayout } from '../src/components/FundamentalDataStructures/HashBased/HashMap/HashMapLayout.ts'
import { HashSetLayout } from '../src/components/FundamentalDataStructures/SetUnion/HashSet/HashSetLayout.ts'
import { BloomFilterLayout } from '../src/components/AdvancedDataStructures/Probabilistic/BloomFilter/BloomFilterLayout.ts'
import { InsertAnimation } from '../src/components/FundamentalDataStructures/HashBased/HashMap/Insert/InsertAnimation.ts'
import { SearchByKeyAnimation } from '../src/components/FundamentalDataStructures/HashBased/HashMap/SearchByKey/SearchByKeyAnimation.ts'
import { DeleteByKeyAnimation } from '../src/components/FundamentalDataStructures/HashBased/HashMap/DeleteByKey/DeleteByKeyAnimation.ts'
import { ClearAnimation as MapClear } from '../src/components/FundamentalDataStructures/HashBased/HashMap/Clear/ClearAnimation.ts'
import { AddAnimation as SetAdd } from '../src/components/FundamentalDataStructures/SetUnion/HashSet/Add/AddAnimation.ts'
import { ContainsAnimation } from '../src/components/FundamentalDataStructures/SetUnion/HashSet/Contains/ContainsAnimation.ts'
import { RemoveAnimation } from '../src/components/FundamentalDataStructures/SetUnion/HashSet/Remove/RemoveAnimation.ts'
import { ClearAnimation as SetClear } from '../src/components/FundamentalDataStructures/SetUnion/HashSet/Clear/ClearAnimation.ts'
import { AddAnimation as BloomAdd } from '../src/components/AdvancedDataStructures/Probabilistic/BloomFilter/Add/AddAnimation.ts'
import { CheckMembershipAnimation } from '../src/components/AdvancedDataStructures/Probabilistic/BloomFilter/CheckMembership/CheckMembershipAnimation.ts'
import { ClearAnimation as BloomClear } from '../src/components/AdvancedDataStructures/Probabilistic/BloomFilter/Clear/ClearAnimation.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'
import { LinkedList } from '../src/components/FundamentalDataStructures/Linear/LinkedList/LinkedList.ts'

test('hash map preserves collisions, updates in place, and unlinks all chain positions', () => {
  const map = new HashMap()
  for (const key of [5, 13, 21, -3]) map.put(key, key * 2)
  assert.equal(new Set(map.getEntries().map((entry) => entry.bucket)).size, 1)
  const originalId = map.get(13).id
  map.put(13, -900)
  assert.equal(map.length, 4)
  assert.equal(map.get(13).id, originalId)
  assert.equal(map.get(13).value, -900)
  assert.equal(map.delete(999), false)
  for (const key of [21, -3, 5, 13]) {
    assert.equal(map.delete(key), true)
    assert.equal(map.get(key), null)
  }
  assert.equal(map.length, 0)
  map.put(0, 0)
  assert.equal(map.get(-0).value, 0)
})

test('hash map growth preserves keys and IDs; clear keeps capacity and fresh IDs', () => {
  const map = new HashMap()
  for (let key = 0; key < 6; key += 1) map.put(key, -key)
  assert.equal(map.bucketCount, 8)
  const ids = new Map(map.getEntries().map((entry) => [entry.key, entry.id]))
  const plan = new InsertAnimation(map, 100, 500)
  assert.equal(map.bucketCount, 8, 'Planning does not mutate the committed source')
  assert.equal(plan.result.bucketCount, 16)
  assert.ok(plan.steps.some((step) => step.title === 'Grow and rehash'))
  for (const [key, id] of ids) assert.equal(plan.result.get(key).id, id)
  assert.equal(plan.result.get(100).value, 500)
  const grown = plan.result
  const oldIds = new Set(grown.getEntries().map((entry) => entry.id))
  grown.clear()
  assert.equal(grown.bucketCount, 16)
  assert.equal(grown.length, 0)
  grown.put(100, 0)
  assert.ok(!oldIds.has(grown.get(100).id))
})

test('hash map agrees with native Map through a deterministic sequence of updates and removals', () => {
  const map = new HashMap()
  const reference = new Map()
  let state = 123456
  for (let index = 0; index < 400; index += 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    const key = state % 91 - 45
    if (index % 3 === 0) assert.equal(map.delete(key), reference.delete(key))
    else {
      map.put(key, index)
      reference.set(key, index)
    }
    assert.equal(map.length, reference.size)
    for (const [storedKey, value] of reference) assert.equal(map.get(storedKey).value, value)
    const entries = map.getEntries()
    assert.equal(entries.length, map.length)
    assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length)
    for (const entry of entries) assert.ok(entry.bucket >= 0 && entry.bucket < map.bucketCount)
  }
  const clone = map.clone()
  clone.clear()
  assert.equal(map.length, reference.size)
})

test('hash set rejects duplicates without allocating IDs or growing and supports clear/reinsert', () => {
  const set = new HashSet()
  for (let value = 0; value < 6; value += 1) set.add(value)
  const before = set.getEntries()
  set.add(5)
  assert.deepEqual(set.getEntries(), before)
  assert.equal(set.bucketCount, 8)
  set.add(6)
  assert.equal(set.bucketCount, 16)
  assert.equal(set.length, 7)
  for (let value = 0; value < 7; value += 1) assert.equal(set.has(value), true)
  assert.equal(set.delete(3), true)
  assert.equal(set.has(3), false)
  assert.equal(set.delete(3), false)
  const clone = set.clone()
  clone.clear()
  assert.equal(set.length, 6)
  clone.add(-5)
  assert.equal(clone.has(-5), true)
})

test('hash models accept extreme safe integers and reject invalid numbers before mutation', () => {
  const map = new HashMap()
  for (const value of [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]) {
    map.put(value, value)
    assert.equal(map.get(value).value, value)
  }
  for (const Model of [HashMap, HashSet, BloomFilter]) {
    const model = Model.createDefault()
    for (const invalid of [NaN, Infinity, -Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
      const before = JSON.stringify(model)
      assert.throws(() => model.apply('insert', invalid, 10), /safe integers/)
      assert.equal(JSON.stringify(model), before)
    }
  }
  const before = map.getEntries()
  assert.throws(() => map.put(5, NaN), /safe integers/)
  assert.deepEqual(map.getEntries(), before)
})

test('Bloom filter has no false negatives, counts add calls, and clears without mutating clones', () => {
  const filter = new BloomFilter()
  assert.equal(filter.mightContain(0), false)
  const values = [0, -0, -10, 10, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
  for (const value of values) filter.add(value)
  for (const value of values) assert.equal(filter.mightContain(value), true)
  assert.equal(filter.length, values.length)
  const bits = filter.getBits()
  filter.add(10)
  assert.deepEqual(filter.getBits(), bits)
  assert.equal(filter.length, values.length + 1)
  const clone = filter.clone()
  clone.clear()
  assert.ok(clone.getBits().every((bit) => bit === 0))
  assert.equal(clone.length, 0)
  assert.equal(filter.mightContain(10), true)
  assert.throws(() => filter.apply('delete-value', 10, 0), /cannot delete/)
})

test('Bloom filter reports possible membership for a deterministic hash collision', () => {
  const filter = new BloomFilter()
  const seen = new Map()
  let collision = null
  // There are at most 32^3 ordered triples, so this bound guarantees a pair.
  for (let value = 0; value <= filter.bitCount ** filter.hashCount; value += 1) {
    const signature = filter.getIndices(value).join(',')
    if (seen.has(signature)) {
      collision = [seen.get(signature), value]
      break
    }
    seen.set(signature, value)
  }
  assert.ok(collision)
  filter.add(collision[0])
  assert.notEqual(collision[0], collision[1])
  assert.equal(filter.mightContain(collision[1]), true)
  const plan = new CheckMembershipAnimation(filter, collision[1])
  assert.match(plan.steps.at(-1).description, /possibly present.*false positive/)
})

test('every hash action produces independent scenes and commits its count only in the last frame', () => {
  const features = [
    [HashMap, HashMapLayout, 'hash-map', [InsertAnimation, SearchByKeyAnimation, DeleteByKeyAnimation, MapClear]],
    [HashSet, HashSetLayout, 'hash-set', [SetAdd, ContainsAnimation, RemoveAnimation, SetClear]],
    [BloomFilter, BloomFilterLayout, 'bloom-filter', [BloomAdd, CheckMembershipAnimation, BloomClear]],
  ]
  for (const [Model, Layout, kind, actions] of features) {
    for (const populated of [false, true]) {
      const model = populated ? Model.createDefault() : new Model()
      for (const Action of actions) {
        for (const key of [10, -999]) {
          const source = JSON.stringify(model)
          const plan = new Action(model, key, -500)
          assert.equal(JSON.stringify(model), source)
          assert.ok(plan.steps.length >= 3)
          for (const [index, step] of plan.steps.entries()) {
            assert.equal(step.scene.kind, kind)
            assert.equal(step.scene.count, index === plan.steps.length - 1 ? plan.result.length : model.length)
            assert.ok(step.title && step.description && step.code && step.duration > 0)
            const ids = new Set(step.scene.nodes.map((node) => node.id))
            assert.equal(ids.size, step.scene.nodes.length)
            if (step.scene.focusId !== null) assert.ok(ids.has(step.scene.focusId))
            for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
            for (const node of step.scene.nodes) {
              assert.ok(node.x - (node.width ?? 66) / 2 >= 0)
              assert.ok(node.x + (node.width ?? 66) / 2 <= step.scene.width)
              assert.ok(node.y - (node.height ?? 66) / 2 >= 0)
              assert.ok(node.y + (node.height ?? 66) / 2 <= step.scene.height)
            }
          }
          const finalScene = plan.steps.at(-1).scene
          const expectedScene = new Layout().create(plan.result)
          const search = Action === SearchByKeyAnimation || Action === ContainsAnimation || Action === CheckMembershipAnimation
          if (search) {
            assert.match(plan.steps.at(-1).code, /^return /)
            assert.ok(!plan.steps.some((step) => step.code === 'commit completed result'))
            assert.deepEqual(finalScene.nodes.map(({ tone, status, ...node }) => node), expectedScene.nodes.map(({ tone, status, ...node }) => node))
            assert.deepEqual(finalScene.edges.map(({ highlighted, ...edge }) => edge), expectedScene.edges.map(({ highlighted, ...edge }) => edge))
            assert.deepEqual(finalScene.hint, expectedScene.hint)
          } else {
            assert.equal(plan.steps.at(-1).code, 'commit completed result')
            assert.deepEqual(finalScene, expectedScene)
          }
          const snapshots = JSON.stringify(plan.steps)
          plan.result.clear()
          assert.equal(JSON.stringify(plan.steps), snapshots)
          const information = Action.describe(model.length)
          for (const cost of [information.time, information.memory]) assert.ok(cost.best && cost.average && cost.worst && cost.explanation)
        }
      }
    }
  }
})

test('searches finish on their located result while mutation completion is preserved', () => {
  const map = new HashMap()
  for (const key of [5, 13, 21]) map.put(key, key * 10)
  const search = new SearchByKeyAnimation(map, 13)
  const found = search.steps.at(-1)
  assert.equal(found.title, 'Element found')
  assert.match(found.description, /bucket 5, chain position 1/)
  assert.match(found.description, /Stored value: 130/)
  assert.equal(found.scene.focusId, map.get(13).id)
  assert.equal(found.scene.nodes.find((node) => node.id === found.scene.focusId).status, 'FOUND')
  assert.match(found.code, /^return matchingEntry/)
  const miss = new SearchByKeyAnimation(map, 29).steps.at(-1)
  assert.match(miss.description, /29 was not found in bucket 5/)
  assert.match(miss.code, /^return notFound/)
  const set = new HashSet()
  set.add(13)
  assert.match(new ContainsAnimation(set, 13).steps.at(-1).description, /Found value 13 in bucket 5/)
  const emptyFilter = new BloomFilter()
  const bit = emptyFilter.getIndices(17)[0]
  const absent = new CheckMembershipAnimation(emptyFilter, 17).steps.at(-1)
  assert.match(absent.description, /definitely absent/)
  assert.ok(absent.description.includes(`bit ${bit} is zero`))
  assert.equal(absent.scene.focusId, `bloom-bit-${bit}`)
  assert.equal(new InsertAnimation(map, 13, 99).steps.at(-1).code, 'commit completed result')
  assert.equal(new MapClear(map).steps.at(-1).code, 'commit completed result')
})

test('hash actions expose validated inputs, suitable menus, previews, and complete information', () => {
  const mapInput = ActionInputRequest.create('hash-map', 'insert', 10)
  assert.equal(mapInput.label, 'Key')
  assert.equal(mapInput.secondLabel, 'Value')
  assert.equal(mapInput.pairInput, true)
  assert.equal(mapInput.rangeInput, false)
  assert.equal(mapInput.validateUpperBound('100', '-500'), null)
  assert.match(mapInput.validateUpperBound('100', ''), /whole number/)
  assert.match(mapInput.validateUpperBound('100', '1.5'), /whole number/)
  for (const kind of ['hash-map', 'hash-set', 'bloom-filter']) {
    assert.equal(StructureCatalog.getGroupForStructure(kind), kind === 'bloom-filter' ? 'probabilistic' : kind === 'hash-set' ? 'set-union' : 'hash-based')
    const preview = StructureCatalog.createPreview(kind, new LinkedList())
    assert.equal(preview.kind, kind)
    assert.equal(preview.count, 10)
    const information = StructureInformation.get(kind)
    assert.ok(information.summary)
    assert.ok(information.useCases.length >= 4)
    for (const technology of information.technologies) {
      assert.ok(technology.name && technology.usage && technology.url.startsWith('https://'))
    }
    for (const action of ActionCatalog.getActions(kind)) {
      const request = ActionInputRequest.create(kind, action.kind, 0)
      if (action.kind === 'clear') assert.equal(request, null)
      else {
        assert.ok(request)
        assert.equal(request.available, true)
        assert.equal(request.validate('-5'), null)
      }
    }
  }
  assert.deepEqual(ActionCatalog.getActions('bloom-filter').map((action) => action.kind), ['insert', 'search-value', 'clear'])
  assert.equal(ActionInputRequest.create('bloom-filter', 'delete-value', 10), null)
})
