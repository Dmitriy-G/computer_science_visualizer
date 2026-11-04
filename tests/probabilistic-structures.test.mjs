import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync, existsSync } from 'node:fs'
import { ProbabilisticStructureCatalog } from '../src/visualization/ProbabilisticStructureCatalog.ts'
import { ProbabilisticStructureDefinitions } from '../src/visualization/ProbabilisticStructureDefinitions.ts'
import { ProbabilisticActionCatalog } from '../src/visualization/ProbabilisticActionCatalog.ts'
import { StructuredProbabilisticInput } from '../src/visualization/StructuredProbabilisticInput.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'
import { CountingBloomFilter } from '../src/components/AdvancedDataStructures/Probabilistic/CountingBloomFilter/CountingBloomFilter.ts'
import { CuckooFilter } from '../src/components/AdvancedDataStructures/Probabilistic/CuckooFilter/CuckooFilter.ts'
import { QuotientFilter } from '../src/components/AdvancedDataStructures/Probabilistic/QuotientFilter/QuotientFilter.ts'
import { CountMinSketch } from '../src/components/AdvancedDataStructures/Probabilistic/CountMinSketch/CountMinSketch.ts'
import { HyperLogLog } from '../src/components/AdvancedDataStructures/Probabilistic/HyperLogLog/HyperLogLog.ts'
import { ReservoirSamplingBuffer } from '../src/components/AdvancedDataStructures/Probabilistic/ReservoirSamplingBuffer/ReservoirSamplingBuffer.ts'

const snapshot = (model) => JSON.stringify(ProbabilisticStructureCatalog.createScene(model))
const add = (model, value, weight = 1) => model.execute('insert', { value, weight })
const contains = (model, value) => model.execute('search-value', { value }).value

const assertScene = (scene) => {
  const ids = new Set(scene.nodes.map((node) => node.id))
  assert.equal(ids.size, scene.nodes.length)
  if (scene.focusId) assert.ok(ids.has(scene.focusId))
  for (const edge of scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
  for (const node of scene.nodes) {
    assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y))
    assert.ok(node.x - node.width / 2 >= 0 && node.x + node.width / 2 <= scene.width)
    assert.ok(node.y >= 66 && node.y + 66 < scene.height)
    assert.ok(node.width >= (node.displayValue?.length ?? 0) * 12)
    assert.ok(node.width >= node.label.length * 6)
  }
}

test('six probabilistic entries expose defaults, Overview actions, dialogs, and information', () => {
  assert.equal(ProbabilisticStructureDefinitions.structures.length, 6)
  const models = ProbabilisticStructureCatalog.createModels()
  for (const definition of ProbabilisticStructureDefinitions.structures) {
    const model = models.get(definition.kind)
    assert.equal(model.length, 10, definition.name)
    assert.equal(StructureCatalog.getGroupForStructure(definition.kind), 'probabilistic')
    assert.equal(ActionInputRequest.supportsStructure(definition.kind), true)
    assert.deepEqual(ActionCatalog.getScopedActions(definition.kind, 'overview'), ProbabilisticActionCatalog.getActions(definition.kind))
    assert.deepEqual(ActionCatalog.getScopedActions(definition.kind, 'sorting'), [])
    assert.deepEqual(ActionCatalog.getScopedActions(definition.kind, 'graph-traversal'), [])
    const info = StructureInformation.get(definition.kind)
    assert.equal(info.useCases.length, 4)
    for (const technology of info.technologies) assert.match(technology.url, /^https:\/\//)
    assertScene(ProbabilisticStructureCatalog.createScene(model))
    for (const choice of ActionCatalog.getActions(definition.kind)) {
      const request = ActionInputRequest.create(definition.kind, choice.kind, model.length)
      const needsInput = !['clear', 'estimate-cardinality', 'inspect-storage'].includes(choice.kind)
      assert.equal(request !== null, needsInput)
      if (request) assert.ok(request.structured)
    }
  }
})

test('probabilistic input preserves safe integers and requires positive sketch weights', () => {
  const input = StructuredProbabilisticInput.create('count-min-sketch', 'insert')
  assert.deepEqual(input.parse({ value: '-9007199254740991', weight: '9007199254740991' }), { value: Number.MIN_SAFE_INTEGER, weight: Number.MAX_SAFE_INTEGER })
  for (const weight of ['0', '-1', '', '1.5', '9007199254740992']) assert.ok(input.validate({ value: '10', weight }).weight)
  assert.ok(input.validate({ value: '9007199254740992', weight: '1' }).value)
  assert.equal(ActionInputRequest.create('hyperloglog', 'estimate-cardinality', 0), null)
  assert.equal(ActionInputRequest.create('reservoir-sampling-buffer', 'inspect-storage', 0), null)
})

test('counting Bloom aggregates duplicate positions and rejects overflow atomically', () => {
  const model = new CountingBloomFilter()
  let value = 0
  while (new Set(model.positions(value)).size === 3 && value < 10000) value += 1
  assert.ok(value < 10000, 'find a value whose hashes repeat a counter')
  const expected = new Array(32).fill(0)
  for (const position of model.positions(value)) expected[position] += 1
  add(model, value)
  assert.deepEqual(model.getCounters(), expected)
  assert.equal(contains(model, value), true)
  let before
  let result
  do {
    before = snapshot(model)
    result = add(model, value)
  } while (result.status !== 'REJECTED')
  assert.equal(snapshot(model), before)
  assert.ok(model.getCounters().every((counter) => counter <= 15))
  while (model.length > 0) {
    assert.equal(contains(model, value), true)
    model.execute('delete-value', { value })
  }
  assert.ok(model.getCounters().every((counter) => counter === 0))
  assert.equal(contains(model, value), false)
})

test('guarded filter deletion rejects false-positive values without creating false negatives', () => {
  for (const Model of [CountingBloomFilter, CuckooFilter]) {
    const model = Model.createDefault()
    const inserted = new Set(Array.from({ length: 10 }, (_, index) => (index + 1) * 10))
    let falsePositive = null
    for (let value = 0; value < 100000; value += 1) {
      if (!inserted.has(value) && contains(model, value)) { falsePositive = value; break }
    }
    assert.notEqual(falsePositive, null)
    const before = snapshot(model)
    assert.equal(model.execute('delete-value', { value: falsePositive }).status, 'REJECTED')
    assert.equal(snapshot(model), before)
    for (const value of inserted) assert.equal(contains(model, value), true)
    model.execute('delete-value', { value: 20 })
    inserted.delete(20)
    for (const value of inserted) assert.equal(contains(model, value), true)
  }
})

test('cuckoo alternate buckets are involutive and full-filter failure preserves residents', () => {
  const model = new CuckooFilter()
  for (let fingerprint = 1; fingerprint <= 255; fingerprint += 1) {
    for (let bucket = 0; bucket < 8; bucket += 1) {
      const alternate = model.alternate(bucket, fingerprint)
      assert.notEqual(alternate, bucket)
      assert.equal(model.alternate(alternate, fingerprint), bucket)
    }
  }
  const inserted = []
  let rejected = false
  for (let value = -30; value < 100; value += 1) {
    const before = snapshot(model)
    if (add(model, value).status === 'REJECTED') {
      assert.equal(snapshot(model), before)
      rejected = true
      break
    }
    inserted.push(value)
    for (const resident of inserted) assert.equal(contains(model, resident), true)
  }
  assert.ok(rejected)
  assert.equal(model.getBuckets().flat().filter((fingerprint) => fingerprint !== null).length, inserted.length)
  const copy = model.clone()
  for (const value of inserted) copy.execute('delete-value', { value })
  assert.equal(copy.length, 0)
  assert.ok(copy.getBuckets().flat().every((fingerprint) => fingerprint === null))
  assert.equal(model.length, inserted.length)
})

test('quotient metadata resolves wrapped clusters, sorted runs, and fingerprint collisions', () => {
  const model = new QuotientFilter()
  const groups = new Map([[15, []], [0, []], [1, []]])
  for (let value = 0; value < 10000; value += 1) {
    const quotient = Math.floor(model.fingerprint(value) / 256)
    const group = groups.get(quotient)
    if (group && group.length < 5) group.push(value)
    if ([...groups.values()].every((values) => values.length === 5)) break
  }
  assert.ok([...groups.values()].every((values) => values.length === 5))
  const values = [...groups.values()].flat()
  for (let rotation = 0; rotation < values.length; rotation += 1) {
    const filter = new QuotientFilter()
    const inserted = []
    for (let index = 0; index < values.length; index += 1) {
      const value = values[(index + rotation) % values.length]
      assert.notEqual(add(filter, value).status, 'REJECTED')
      inserted.push(value)
      for (const resident of inserted) assert.equal(contains(filter, resident), true, `resident ${resident}, rotation ${rotation}`)
    }
    const slots = filter.getSlots()
    assert.equal(slots.filter((slot) => slot.remainder !== null).length, 15)
    assert.equal(slots.filter((slot) => slot.occupied).length, 3)
    assert.ok(slots[0].shifted, 'quotient 15 run wraps across slot zero')
    const before = snapshot(filter)
    assert.equal(add(filter, -1).status, 'REJECTED')
    assert.equal(snapshot(filter), before)
  }
  const seen = new Map()
  let pair
  for (let value = 0; value <= 4096; value += 1) {
    const fingerprint = model.fingerprint(value)
    if (seen.has(fingerprint)) { pair = [seen.get(fingerprint), value]; break }
    seen.set(fingerprint, value)
  }
  assert.ok(pair)
  add(model, pair[0])
  assert.equal(contains(model, pair[1]), true, 'fingerprint collisions produce approximate positives')
})

test('Count-Min positive weighted estimates never undercount and BigInt counters stay exact', () => {
  const model = new CountMinSketch()
  const truth = new Map()
  for (let index = 0; index < 80; index += 1) {
    const value = index % 13 - 6
    const weight = index === 0 ? Number.MAX_SAFE_INTEGER : index + 1
    add(model, value, weight)
    truth.set(value, (truth.get(value) ?? 0n) + BigInt(weight))
    for (const [key, count] of truth) assert.ok(BigInt(contains(model, key)) >= count)
  }
  assert.ok(model.totalWeight > BigInt(Number.MAX_SAFE_INTEGER))
  for (const row of model.getCounters()) assert.equal(row.reduce((sum, counter) => sum + counter, 0n), model.totalWeight)
  const before = snapshot(model)
  contains(model, 100000)
  assert.equal(snapshot(model), before)
  assert.throws(() => add(model, 1, -1), RangeError)
  assert.equal(snapshot(model), before)
})

test('HyperLogLog keeps rank maxima and does not mistake duplicate adds for distinct values', () => {
  const model = new HyperLogLog()
  assert.equal(model.estimate(), 0)
  add(model, Number.MIN_SAFE_INTEGER)
  const registers = model.getRegisters()
  const estimate = model.estimate()
  for (let index = 0; index < 100; index += 1) add(model, Number.MIN_SAFE_INTEGER)
  assert.deepEqual(model.getRegisters(), registers)
  assert.equal(model.estimate(), estimate)
  assert.equal(model.length, 101)
  for (const value of [Number.MAX_SAFE_INTEGER, -1, 0, 1, 1234]) {
    const before = model.getRegisters()
    add(model, value)
    model.getRegisters().forEach((rank, index) => assert.ok(rank >= before[index] && rank <= 61))
  }
  const copy = model.clone()
  copy.execute('clear', {})
  assert.equal(copy.estimate(), 0)
  assert.ok(model.estimate() > 0)
})

test('reservoir retains stream occurrences, bounds storage, and clones generator state', () => {
  const model = new ReservoirSamplingBuffer()
  for (let value = 0; value < 5; value += 1) add(model, value)
  assert.deepEqual(model.getSample().map((entry) => entry.value), [0, 1, 2, 3, 4])
  const copy = model.clone()
  let skipped = 0
  let replacements = 0
  for (let value = 5; value < 300; value += 1) {
    const before = model.getSample()
    add(model, value)
    add(copy, value)
    assert.deepEqual(model.getSample(), copy.getSample())
    assert.equal(model.getSample().length, 5)
    assert.equal(model.length, value + 1)
    if (JSON.stringify(before) === JSON.stringify(model.getSample())) skipped += 1
    else replacements += 1
    for (const entry of model.getSample()) assert.equal(entry.value, entry.arrival - 1)
  }
  assert.ok(skipped > 0 && replacements > 0)
  const previousIds = new Set(model.getSample().map((entry) => entry.id))
  model.execute('clear', {})
  for (let index = 0; index < 5; index += 1) add(model, 7)
  assert.equal(model.getSample().filter((entry) => entry.value === 7).length, 5)
  assert.equal(new Set(model.getSample().map((entry) => entry.id)).size, 5)
  assert.ok(model.getSample().every((entry) => !previousIds.has(entry.id)))
  assert.equal(copy.length, 300)
})

test('all probabilistic actions own metadata and produce bounded immutable playback scenes', async () => {
  const featuresUrl = new URL('../src/components/StructureFeatures/ProbabilisticFeatures.tsx', import.meta.url)
  const source = readFileSync(featuresUrl, 'utf8')
  const imports = [...source.matchAll(/import \{ (\w+) as \w+Sequence \} from '([^']+)'/g)]
  assert.equal(imports.length, 20)
  for (const [, exported, path] of imports) {
    const [name, folder] = path.slice(2).split('/')
    const definition = ProbabilisticStructureDefinitions.structures.find((entry) => {
      const compact = entry.name.replace(/[^a-z]/gi, '').toLowerCase()
      return compact === name.toLowerCase()
    })
    assert.ok(definition, name)
    const { [exported]: Sequence } = await import(new URL(path, featuresUrl))
    const model = ProbabilisticStructureCatalog.createDefault(definition.kind)
    const before = snapshot(model)
    const input = { value: 20, weight: 7 }
    const sequence = new Sequence(model, input)
    assert.equal(snapshot(model), before, 'planning must leave the committed model untouched')
    assert.notEqual(sequence.result, model)
    assert.ok(sequence.steps.length >= 2 && sequence.steps.length <= 98)
    const bounds = sequence.steps[0].scene
    for (const step of sequence.steps) {
      assertScene(step.scene)
      assert.equal(step.scene.width, bounds.width)
      assert.equal(step.scene.height, bounds.height)
      assert.ok(step.description && step.code)
    }
    for (const step of sequence.steps.slice(0, -1)) assert.equal(step.scene.count, model.length)
    assert.equal(sequence.steps.at(-1).scene.count, sequence.result.length)
    assert.deepEqual(sequence.steps, new Sequence(model, input).steps, 'replaying the same seed and state must be deterministic')
    const firstScene = JSON.stringify(sequence.steps[0].scene)
    sequence.result.execute('clear', {})
    assert.equal(JSON.stringify(sequence.steps[0].scene), firstScene, 'snapshots must be independent of later mutations')
    const info = Sequence.describe(model.length)
    assert.ok(info.summary && info.time.explanation && info.memory.explanation)
    assert.ok(info.terms.length)
    const actionUrl = new URL(`./${name}/${folder}/${folder}.tsx`, featuresUrl)
    assert.ok(existsSync(actionUrl))
    assert.ok(existsSync(new URL(`./${name}/${folder}/${folder}.css`, featuresUrl)))
  }
})
