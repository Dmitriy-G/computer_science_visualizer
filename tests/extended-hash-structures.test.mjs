import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync, existsSync } from 'node:fs'
import { HashStructureCatalog } from '../src/visualization/HashStructureCatalog.ts'
import { HashStructureDefinitions } from '../src/visualization/HashStructureDefinitions.ts'
import { HashActionCatalog } from '../src/visualization/HashActionCatalog.ts'
import { HashTableHash } from '../src/visualization/HashTableHash.ts'
import { StructuredHashInput } from '../src/visualization/StructuredHashInput.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'
import { OpenAddressingHashTable } from '../src/components/DataStructuresOverview/HashBased/OpenAddressingHashTable/OpenAddressingHashTable.ts'
import { RobinHoodHashTable } from '../src/components/DataStructuresOverview/HashBased/RobinHoodHashTable/RobinHoodHashTable.ts'
import { CuckooHashTable } from '../src/components/DataStructuresOverview/HashBased/CuckooHashTable/CuckooHashTable.ts'
import { HopscotchHashing } from '../src/components/DataStructuresOverview/HashBased/HopscotchHashing/HopscotchHashing.ts'
import { ExtendibleHashing } from '../src/components/DataStructuresOverview/HashBased/ExtendibleHashing/ExtendibleHashing.ts'
import { LinearHashing } from '../src/components/DataStructuresOverview/HashBased/LinearHashing/LinearHashing.ts'
import { PerfectHashTable } from '../src/components/DataStructuresOverview/HashBased/PerfectHashTable/PerfectHashTable.ts'
import { ConsistentHashingRing } from '../src/components/DataStructuresOverview/HashBased/ConsistentHashingRing/ConsistentHashingRing.ts'

const create = (kind) => {
  const model = HashStructureCatalog.createDefault(kind)
  assert.ok(model)
  return model
}

const assertScene = (scene) => {
  const ids = new Set(scene.nodes.map((node) => node.id))
  assert.equal(ids.size, scene.nodes.length, 'every record and storage cell needs a unique scene ID')
  assert.equal(new Set(scene.edges.map((edge) => edge.id)).size, scene.edges.length)
  for (const edge of scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to), `dangling edge ${edge.id}`)
  for (const node of scene.nodes) {
    assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y))
    assert.ok(node.x >= 0 && node.x <= scene.width)
    assert.ok(node.y >= 0 && node.y <= scene.height)
  }
  if (scene.focusId) assert.ok(ids.has(scene.focusId))
}

const assertMap = (model, expected) => {
  const records = model.getRecords()
  assert.equal(model.length, expected.size)
  assert.equal(records.length, expected.size)
  assert.equal(new Set(records.map((record) => record.id)).size, records.length)
  assert.equal(new Set(records.map((record) => record.key)).size, records.length)
  for (const record of records) {
    assert.ok(expected.has(record.key))
    assert.equal(record.value, expected.get(record.key))
    assert.equal(model.execute('search-value', { key: record.key }).value, record.value)
  }
  assertScene(HashStructureCatalog.createScene(model))
}

test('nine new hash entries have ten-element defaults, menus, input routes, and structure information', () => {
  assert.equal(HashStructureDefinitions.structures.length, 9)
  const models = HashStructureCatalog.createModels()
  for (const definition of HashStructureDefinitions.structures) {
    const model = models.get(definition.kind)
    assert.equal(model.length, 10, definition.name)
    assert.equal(StructureCatalog.getGroupForStructure(definition.kind), 'hash-based')
    assert.equal(StructureCatalog.getName(definition.kind), definition.name)
    assert.equal(ActionInputRequest.supportsStructure(definition.kind), true)
    assert.deepEqual(ActionCatalog.getScopedActions(definition.kind, 'overview'), HashActionCatalog.getActions(definition.kind))
    assert.deepEqual(ActionCatalog.getScopedActions(definition.kind, 'sorting'), [])
    assert.deepEqual(ActionCatalog.getScopedActions(definition.kind, 'graph-traversal'), [])
    const information = StructureInformation.get(definition.kind)
    assert.equal(information.useCases.length, 4)
    for (const technology of information.technologies) assert.match(technology.url, /^https:\/\//)
    assertScene(HashStructureCatalog.createScene(model))
    assert.deepEqual(HashStructureCatalog.createScene(model.clone()), HashStructureCatalog.createScene(model))
  }
})

test('linear probing wraps, continues through tombstones, reuses them, and updates zero values', () => {
  const model = new OpenAddressingHashTable()
  const expected = new Map()
  for (const key of [15, 31, 47]) {
    model.execute('insert', { key, value: key })
    expected.set(key, key)
  }
  assert.equal(model.getSlots()[15].key, 15)
  assert.equal(model.getSlots()[0].key, 31)
  assert.equal(model.getSlots()[1].key, 47)
  model.execute('delete-value', { key: 31 })
  expected.delete(31)
  assert.equal(model.getSlots()[0], 'deleted')
  assert.equal(model.execute('search-value', { key: 47 }).value, 47)
  model.execute('insert', { key: 47, value: 0 })
  expected.set(47, 0)
  model.execute('insert', { key: 63, value: -1 })
  expected.set(63, -1)
  assert.equal(model.getSlots()[0].key, 63)
  assertMap(model, expected)
})

test('hash lookups report visible physical locations without changing stored entries', () => {
  const locations = {
    'open-addressing-hash-table': /slot \d+, home \d+/,
    'separate-chaining-hash-table': /bucket \d+, chain index \d+/,
    'robin-hood-hash-table': /slot \d+, displacement \d+/,
    'cuckoo-hash-table': /table T[01], slot \d+/,
    'hopscotch-hashing': /slot \d+, offset \d+ from home \d+/,
    'extendible-hashing': /directory entry \d+, bucket B\d+, record slot \d+/,
    'linear-hashing': /bucket \d+, (primary page|overflow page \d+), record slot \d+/,
    'perfect-hash-table': /primary bucket \d+, secondary slot \d+/,
  }
  for (const [kind, location] of Object.entries(locations)) {
    const model = create(kind)
    const before = structuredClone(model.getRecords())
    assert.match(model.execute('search-value', { key: 20 }).description, location)
    assert.deepEqual(model.getRecords(), before)
  }
})

test('Robin Hood displacement keeps evicted records visible and deletion closes gaps across wraparound', () => {
  const model = new RobinHoodHashTable()
  model.execute('insert', { key: 0, value: 10 })
  model.execute('insert', { key: 1, value: 20 })
  const originals = model.getRecords().map((record) => record.id)
  let swaps = 0
  model.execute('insert', { key: 16, value: 30 }, { onLinearChange(event) {
    if (event.status !== 'DISPLACE') return
    swaps += 1
    const records = model.getRecords()
    assert.equal(new Set(records.map((record) => record.id)).size, 3)
    for (const id of originals) assert.ok(records.some((record) => record.id === id))
    assert.ok(model.getHeld())
    assertScene(HashStructureCatalog.createScene(model))
  } })
  assert.equal(swaps, 1)
  assert.equal(model.getSlots()[1].key, 16)
  assert.equal(model.getSlots()[2].key, 1)
  model.execute('delete-value', { key: 0 })
  assertMap(model, new Map([[1, 20], [16, 30]]))
  const wrapped = new RobinHoodHashTable()
  for (const key of [15, 31, 47, 63]) wrapped.execute('insert', { key, value: key })
  wrapped.execute('delete-value', { key: 31 })
  assertMap(wrapped, new Map([[15, 15], [47, 47], [63, 63]]))
  assert.ok(wrapped.getSlots().every((slot) => slot !== 'deleted'))
})

test('cuckoo cycles restore trials before rehash and every final entry has one of two legal locations', () => {
  const model = new CuckooHashTable()
  const groups = new Map()
  let colliding = null
  for (let key = 0; key < 512 && !colliding; key += 1) {
    const pair = `${model.home(key, 0)},${model.home(key, 1)}`
    const keys = groups.get(pair) ?? []
    keys.push(key)
    groups.set(pair, keys)
    if (keys.length === 3) colliding = keys
  }
  assert.ok(colliding)
  const expected = new Map()
  for (const key of colliding.slice(0, 2)) {
    model.execute('insert', { key, value: key })
    expected.set(key, key)
  }
  let evictions = 0
  const result = model.execute('insert', { key: colliding[2], value: 99 }, { onLinearChange(event) {
    if (event.status === 'EVICT') {
      evictions += 1
      assert.ok(model.getHeld())
      assert.equal(new Set(model.getRecords().map((record) => record.id)).size, 3)
    }
    assertScene(HashStructureCatalog.createScene(model))
  } })
  assert.ok(evictions > 0)
  if (result.status !== 'REJECTED') expected.set(colliding[2], 99)
  assertMap(model, expected)
  for (const [table, slots] of model.getTables().entries()) for (const [index, record] of slots.entries()) if (record) assert.equal(model.home(record.key, table), index)
})

const assertHopBits = (model) => {
  const expected = new Array(model.capacity).fill(0)
  for (const [index, record] of model.getSlots().entries()) {
    if (!record) continue
    const home = model.home(record.key)
    const distance = (index - home + model.capacity) % model.capacity
    assert.ok(distance < HopscotchHashing.neighborhood)
    expected[home] |= 1 << distance
  }
  assert.deepEqual(model.getHopBits(), expected)
}

test('hopscotch legally moves a hole and impossible same-home neighborhoods reject without consuming IDs', () => {
  const model = new HopscotchHashing()
  for (const key of [0, 1, 2, 3]) model.execute('insert', { key, value: key })
  let hops = 0
  model.execute('insert', { key: 16, value: 99 }, { onLinearChange(event) {
    if (event.status === 'HOP') hops += 1
    assertHopBits(model)
  } })
  assert.ok(hops > 0)
  assert.equal(model.getSlots()[4].key, 1)
  assert.equal(model.getSlots()[1].key, 16)
  assertMap(model, new Map([[0, 0], [1, 1], [2, 2], [3, 3], [16, 99]]))
  model.execute('delete-value', { key: 1 })
  assertHopBits(model)
  const full = new HopscotchHashing()
  for (const key of [0, 256, 512, 768]) full.execute('insert', { key, value: key })
  const before = structuredClone({ slots: full.getSlots(), bits: full.getHopBits(), capacity: full.capacity, nextId: full.nextId })
  assert.equal(full.execute('insert', { key: 1024, value: 1 }).status, 'REJECTED')
  assert.deepEqual({ slots: full.getSlots(), bits: full.getHopBits(), capacity: full.capacity, nextId: full.nextId }, before)
  assertHopBits(full)
})

const assertDirectory = (model) => {
  const directory = model.getDirectory()
  const buckets = model.getBuckets()
  assert.equal(directory.length, 2 ** model.globalDepth)
  assert.equal(new Set(buckets.map((bucket) => bucket.id)).size, buckets.length)
  for (const bucket of buckets) {
    assert.ok(bucket.depth <= model.globalDepth)
    assert.ok(bucket.records.length <= ExtendibleHashing.bucketCapacity)
    assert.equal(directory.filter((id) => id === bucket.id).length, 2 ** (model.globalDepth - bucket.depth))
    for (const record of bucket.records) assert.equal(directory[model.address(record.key)], bucket.id)
  }
  assertScene(HashStructureCatalog.createScene(model))
}

test('extendible directory aliases survive clones, splits, deletion, and rejected depth exhaustion', () => {
  const model = new ExtendibleHashing()
  const expected = new Map()
  for (let key = 0; key < 36; key += 1) {
    const result = model.execute('insert', { key, value: -key }, { onLinearChange() { assertDirectory(model) } })
    if (result.status !== 'REJECTED') expected.set(key, -key)
    assertMap(model, expected)
  }
  const copy = model.clone()
  assertDirectory(copy)
  const directory = model.getDirectory()
  model.execute('delete-value', { key: 0 })
  assert.deepEqual(model.getDirectory(), directory)
  assert.equal(copy.execute('search-value', { key: 0 }).value, -0)
  const colliding = []
  for (let key = 0; key < 20000 && colliding.length < 4; key += 1) if (HashTableHash.index(key, 11, 256) === 0) colliding.push(key)
  assert.equal(colliding.length, 4)
  const bounded = new ExtendibleHashing()
  for (const key of colliding.slice(0, 3)) bounded.execute('insert', { key, value: key })
  const before = structuredClone({ directory: bounded.getDirectory(), buckets: bounded.getBuckets(), depth: bounded.globalDepth, nextId: bounded.nextId, nextBucketId: bounded.nextBucketId })
  assert.equal(bounded.execute('insert', { key: colliding[3], value: 1 }).status, 'REJECTED')
  assert.deepEqual({ directory: bounded.getDirectory(), buckets: bounded.getBuckets(), depth: bounded.globalDepth, nextId: bounded.nextId, nextBucketId: bounded.nextBucketId }, before)
  assertDirectory(bounded)
})

test('linear hashing grows exactly one bucket at each split and keeps real overflow pages routable', () => {
  const model = new LinearHashing()
  const expected = new Map()
  const colliding = []
  for (let key = 0; key < 20000 && colliding.length < 40; key += 1) if (HashTableHash.index(key, 17, 64) === 0) colliding.push(key)
  assert.equal(colliding.length, 40)
  for (const key of colliding) {
    const previousCount = model.bucketCount
    model.execute('insert', { key, value: key })
    expected.set(key, key)
    assert.ok(model.bucketCount === previousCount || model.bucketCount === previousCount + 1)
    assert.equal(model.bucketCount, model.roundBase + model.splitPointer)
    for (const page of model.getPages()) for (const record of page.records) assert.equal(model.address(record.key), page.bucket)
    assertMap(model, expected)
  }
  assert.ok(model.getPages().some((page) => page.overflow))
  const count = model.bucketCount
  for (const key of colliding.slice(0, 20)) {
    model.execute('delete-value', { key })
    expected.delete(key)
    assertMap(model, expected)
  }
  assert.equal(model.bucketCount, count)
})

test('mutable hash tables preserve zero and extreme integers, stable IDs, clone independence, and capacity limits', () => {
  const kinds = HashStructureDefinitions.structures.map((definition) => definition.kind).filter((kind) => kind !== 'perfect-hash-table' && kind !== 'consistent-hashing-ring')
  for (const kind of kinds) {
    const model = create(kind)
    const original = structuredClone(HashStructureCatalog.createScene(model))
    const copy = model.clone()
    copy.execute('clear', {})
    assert.deepEqual(HashStructureCatalog.createScene(model), original)
    const expected = new Map()
    for (const key of [0, -1, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 16, 32, 48]) {
      const result = copy.execute('insert', { key, value: 0 })
      if (result.status !== 'REJECTED') expected.set(key, 0)
      assertMap(copy, expected)
    }
    const ids = new Map(copy.getRecords().map((record) => [record.key, record.id]))
    for (const key of expected.keys()) {
      copy.execute('insert', { key, value: -123 })
      expected.set(key, -123)
      assert.equal(copy.getRecords().find((record) => record.key === key).id, ids.get(key))
    }
    assertMap(copy, expected)
    const before = structuredClone(copy.getRecords())
    assert.throws(() => copy.execute('insert', { key: 1.5, value: 1 }))
    assert.throws(() => copy.execute('insert', { key: 1, value: Number.MAX_SAFE_INTEGER + 1 }))
    assert.deepEqual(copy.getRecords(), before)
    copy.execute('delete-value', { key: 987654321 })
    assertMap(copy, expected)
    copy.execute('clear', {})
    assert.equal(copy.length, 0)
    assert.equal(copy.getRecords().length, 0)
    copy.execute('insert', { key: 7, value: 9 })
    assert.ok(!new Set(before.map((record) => record.id)).has(copy.getRecords()[0].id))
  }
  const model = new OpenAddressingHashTable()
  for (let key = 0; key < 64; key += 1) model.execute('insert', { key, value: key })
  const before = structuredClone(model.getSlots())
  assert.equal(model.execute('insert', { key: 999, value: 1 }).status, 'REJECTED')
  assert.deepEqual(model.getSlots(), before)
  model.execute('insert', { key: 63, value: -1 })
  assert.equal(model.length, 64)
  assert.equal(model.execute('search-value', { key: 63 }).value, -1)
})

test('static perfect hashing bounds secondary storage, verifies nonmembers, and preserves failed input builds', () => {
  const model = new PerfectHashTable()
  const keys = [0, -1, 10, 20, 30, 40, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
  const result = model.execute('build-values', { keys: keys.join(',') }, { onLinearChange() { assertScene(HashStructureCatalog.createScene(model)) } })
  assert.notEqual(result.status, 'REJECTED')
  let slots = 0
  for (const [index, bucket] of model.getBuckets().entries()) {
    slots += bucket.slots.length
    for (const [slot, record] of bucket.slots.entries()) if (record) {
      assert.equal(HashTableHash.index(record.key, model.primarySeed, keys.length), index)
      assert.equal(HashTableHash.index(record.key, bucket.seed, bucket.slots.length), slot)
    }
  }
  assert.ok(slots <= 4 * keys.length)
  for (const key of keys) assert.equal(model.execute('search-value', { key }).value, true)
  let checkedOccupiedNonmember = false
  for (let key = 1; key < 1000 && !checkedOccupiedNonmember; key += 1) {
    if (keys.includes(key)) continue
    const bucket = model.getBuckets()[HashTableHash.index(key, model.primarySeed, model.length)]
    if (!bucket.slots.length || !bucket.slots[HashTableHash.index(key, bucket.seed, bucket.slots.length)]) continue
    assert.equal(model.execute('search-value', { key }).value, false)
    checkedOccupiedNonmember = true
  }
  assert.equal(checkedOccupiedNonmember, true)
  const before = structuredClone(HashStructureCatalog.createScene(model))
  for (const text of ['1,1', '', '1,,2', '9007199254740992', '1.5']) assert.throws(() => model.execute('build-values', { keys: text }))
  assert.deepEqual(HashStructureCatalog.createScene(model), before)
  const copy = model.clone()
  copy.execute('clear', {})
  assert.equal(copy.execute('search-value', { key: 10 }).value, false)
  assert.equal(model.length, keys.length)
})

test('consistent ring owner lookup wraps correctly and membership changes move only the affected intervals', () => {
  const ring = new ConsistentHashingRing()
  for (const key of [10, 20]) ring.execute('insert', { key })
  const keys = [...Array.from({ length: 120 }, (_, index) => index - 60), Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
  const owners = () => keys.map((key) => ring.execute('search-value', { key }).value)
  const verify = () => {
    const tokens = ring.getTokens()
    assert.equal(tokens.length, 3 * ring.length)
    for (let index = 1; index < tokens.length; index += 1) assert.ok(tokens[index - 1].position <= tokens[index].position)
    for (const key of keys) {
      const expected = tokens.find((token) => token.position >= ring.hashPosition(key)) ?? tokens[0]
      assert.equal(ring.execute('search-value', { key }).value, expected?.server ?? null)
    }
    assertScene(HashStructureCatalog.createScene(ring))
  }
  verify()
  const before = owners()
  const positions = new Map(ring.getTokens().map((token) => [token.id, token.position]))
  ring.execute('insert', { key: 30 })
  const joined = owners()
  for (let index = 0; index < keys.length; index += 1) if (before[index] !== joined[index]) assert.equal(joined[index], 30)
  for (const token of ring.getTokens()) if (positions.has(token.id)) assert.equal(token.position, positions.get(token.id))
  const duplicate = ring.getTokens()
  ring.execute('insert', { key: 30 })
  assert.deepEqual(ring.getTokens(), duplicate)
  verify()
  ring.execute('delete-value', { key: 20 })
  const removed = owners()
  for (let index = 0; index < keys.length; index += 1) if (joined[index] !== 20) assert.equal(removed[index], joined[index])
  verify()
  const copy = ring.clone()
  copy.execute('clear', {})
  assert.equal(copy.execute('search-value', { key: 0 }).value, null)
  assert.equal(ring.length, 2)
  for (let key = 100; ring.length < 16; key += 1) ring.execute('insert', { key })
  const full = ring.getTokens()
  assert.equal(ring.execute('insert', { key: 9999 }).status, 'REJECTED')
  assert.deepEqual(ring.getTokens(), full)
})

test('hash dialogs separate key/value, static CSV keys, and server membership inputs', () => {
  for (const definition of HashStructureDefinitions.structures) {
    for (const action of HashActionCatalog.getActions(definition.kind)) {
      const request = ActionInputRequest.create(definition.kind, action.kind, 10)
      if (action.kind === 'clear' || action.kind === 'inspect-storage') assert.equal(request, null)
      else assert.ok(request?.structured)
    }
  }
  const pair = StructuredHashInput.create('open-addressing-hash-table', 'insert')
  assert.deepEqual(pair.parse({ key: '-10', value: '0' }), { key: -10, value: 0 })
  assert.ok(pair.validate({ key: '1', value: '' }).value)
  const build = StructuredHashInput.create('perfect-hash-table', 'build-values')
  assert.deepEqual(build.parse({ keys: '-1,0,2' }), { keys: '-1,0,2' })
  assert.ok(build.validate({ keys: '1,1' }).keys)
  assert.ok(build.validate({ keys: Array.from({ length: 65 }, (_, index) => index).join(',') }).keys)
  const server = StructuredHashInput.create('consistent-hashing-ring', 'insert')
  assert.deepEqual(server.fields.map((field) => field.name), ['key'])
  assert.equal(server.fields[0].label, 'Server ID')
})

test('all 36 hash action sequences own files and preserve deterministic independent final-commit playback', async () => {
  const features = readFileSync(new URL('../src/components/DataStructuresOverview/HashBased/HashFeatures.tsx', import.meta.url), 'utf8')
  const imports = [...features.matchAll(/import \{ (\w+)Animation as \w+Sequence \} from '\.\/(.*?)'/g)]
  assert.equal(imports.length, 36)
  for (const [, folder, relative] of imports) {
    const className = relative.split('/')[0]
    const source = readFileSync(new URL(`../src/components/DataStructuresOverview/HashBased/${className}/${className}.ts`, import.meta.url), 'utf8')
    const kind = /readonly kind = '([^']+)'/.exec(source)[1]
    const url = new URL(`../src/components/DataStructuresOverview/HashBased/${relative}`, import.meta.url)
    const { [folder + 'Animation']: Sequence } = await import(url.href)
    const action = /super\(model, new \w+Layout\(\), '([^']+)'/.exec(readFileSync(url, 'utf8'))[1]
    const model = create(kind)
    const before = structuredClone(HashStructureCatalog.createScene(model))
    const values = { key: action === 'insert' ? '999' : '20', value: '-7', keys: '-1,0,7,12,15' }
    const request = ActionInputRequest.create(kind, action, model.length)
    const drafts = {}
    if (request) {
      for (const field of request.structured.fields) drafts[field.name] = values[field.name]
      assert.deepEqual(request.structured.validate(drafts), {})
    }
    const input = request ? request.structured.parse(drafts) : {}
    const plan = new Sequence(model, input)
    assert.deepEqual(HashStructureCatalog.createScene(model), before)
    assert.equal(plan.steps.at(-1).scene.count, plan.result.length)
    assert.ok(plan.steps.length >= 2 && plan.steps.length <= 98)
    const first = structuredClone(plan.steps[0].scene)
    for (const [index, step] of plan.steps.entries()) {
      assertScene(step.scene)
      if (index < plan.steps.length - 1) assert.equal(step.scene.count, model.length)
      assert.ok(step.code && step.description)
    }
    assert.equal(new Set(plan.steps.map((step) => `${step.scene.width},${step.scene.height}`)).size, 1)
    assert.deepEqual(plan.steps[0].scene, first)
    assert.deepEqual(new Sequence(model, input).steps, plan.steps)
    const information = Sequence.describe(model.length)
    assert.ok(information.time.best && information.time.average && information.time.worst)
    assert.ok(information.memory.best && information.memory.average && information.memory.worst)
    assert.equal(new Set(information.terms.map((term) => term.symbol)).size, information.terms.length)
    assert.ok(existsSync(new URL(`./${folder}.tsx`, url)))
    assert.ok(existsSync(new URL(`./${folder}.css`, url)))
  }
})
