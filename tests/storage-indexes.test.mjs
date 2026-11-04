import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { test } from 'node:test'
import { BRIN } from '../src/components/DataStructuresOverview/Trees/BRIN/BRIN.ts'
import { SSTable } from '../src/components/DataStructuresOverview/Trees/SSTable/SSTable.ts'
import { SparsePrimaryIndex } from '../src/components/DataStructuresOverview/Trees/SparsePrimaryIndex/SparsePrimaryIndex.ts'
import { SparseOffsetIndex } from '../src/components/DataStructuresOverview/Trees/SparseOffsetIndex/SparseOffsetIndex.ts'
import { TimeIndex } from '../src/components/DataStructuresOverview/Trees/TimeIndex/TimeIndex.ts'
import { IVFIndex } from '../src/components/DataStructuresOverview/Trees/IVFIndex/IVFIndex.ts'
import { ContentAddressedLayers } from '../src/components/DataStructuresOverview/HashBased/ContentAddressedLayers/ContentAddressedLayers.ts'
import { AppliedStructureCatalog } from '../src/visualization/AppliedStructureCatalog.ts'
import { AppliedActionCatalog } from '../src/visualization/AppliedActionCatalog.ts'
import { AppliedInput } from '../src/visualization/AppliedInput.ts'
import { MenuNavigation } from '../src/components/MainMenu/MenuNavigation.ts'
import { LinearAnimation } from '../src/visualization/LinearAnimation.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'

test('BRIN prunes summaries but rechecks false positives and preserves heap order', () => {
  const model = new BRIN()
  const values = [1, 9, 5, 100, 105, 110, -3, -2, -1, 9]
  for (const value of values) model.execute('insert-end', { value })
  const events = []
  assert.deepEqual(model.execute('search-overlap', { minimum: 4, maximum: 4 }, { onLinearChange: (event) => events.push(event) }).value, [])
  assert.ok(events.some((event) => event.description.includes('false positive')))
  assert.ok(events.some((event) => event.description.includes('Prune disjoint')))
  for (const [minimum, maximum] of [[-5, 0], [5, 100], [9, 9], [-100, 1000], [999, 1000]]) {
    assert.deepEqual(model.execute('search-overlap', { minimum, maximum }).value, values.filter((value) => value >= minimum && value <= maximum))
  }
  const before = model.getDiagram()
  assert.throws(() => model.execute('search-overlap', { minimum: 2, maximum: 1 }))
  assert.deepEqual(model.getDiagram(), before)
  const clone = model.clone()
  clone.execute('clear', {})
  assert.equal(clone.length, 0)
  assert.deepEqual(model.getDiagram(), before)
})

for (const Model of [SSTable, SparsePrimaryIndex]) {
  test(`${Model.name} sorts safe-integer keys, encodes byte positions, and preserves failed builds`, () => {
    const model = new Model()
    const entries = [[100, -2], [-15, 88], [0, 7], [Number.MAX_SAFE_INTEGER, 9], [5, 55], [-1, 1], [42, 17]]
    model.execute('build-values', { values: entries.map(([key, value]) => `${key}:${value}`).join(',') })
    assert.equal(model.length, entries.length)
    for (const [key, value] of entries) assert.equal(model.execute('search-value', { key }).value, value)
    for (const key of [-16, -14, 1, 6, 43, Number.MIN_SAFE_INTEGER]) assert.equal(model.execute('search-value', { key }).value, null)
    const records = model.getDiagram().rows.at(-1)
    const ordered = [...entries].sort((a, b) => a[0] < b[0] ? -1 : 1)
    let position = 0
    for (let index = 0; index < ordered.length; index++) {
      assert.equal(records[index].text, ordered[index].join(':'))
      assert.equal(records[index].label, `byte ${position}`)
      position += new TextEncoder().encode(`${ordered[index][0]}:${ordered[index][1]}\n`).length
    }
    const before = model.getDiagram()
    for (const values of ['1:2,1:3', '', '1.5:2', '1:9007199254740992', '1:2,']) {
      assert.throws(() => model.execute('build-values', { values }))
      assert.deepEqual(model.getDiagram(), before)
    }
    assert.throws(() => model.execute('insert', { key: 3, value: 4 }))
    model.execute('clear', {})
    assert.equal(model.length, 0)
    assert.equal(model.execute('search-value', { key: 0 }).value, null)
  })
}

test('SSTable reads at most one indexed data block; sparse primary scans at most three records', () => {
  for (const Model of [SSTable, SparsePrimaryIndex]) {
    const model = Model.createDefault()
    for (const key of [1, 2, 5, 8, 9, 14, 26, 27, 35, 44, 54, 65, 66]) {
      const events = []
      model.execute('search-value', { key }, { onLinearChange: (event) => events.push(event) })
      if (Model === SSTable) assert.ok(events.filter((event) => event.description.startsWith('Simulated read:')).length <= 1)
      else assert.ok(events.filter((event) => event.description.startsWith('Scan key')).length <= 3)
    }
  }
})

test('sparse offset lookup distinguishes logical offsets from bytes and retains allocation across clear', () => {
  const model = new SparseOffsetIndex()
  const values = [1, -999, 32, 777777, -2, 0, 55]
  for (const value of values) model.execute('insert-end', { value })
  for (let index = 0; index < values.length; index++) {
    const events = []
    assert.equal(model.execute('search-index', { index }, { onLinearChange: (event) => events.push(event) }).value, values[index])
    assert.ok(events.filter((event) => event.description.startsWith('Read offset')).length <= 3)
  }
  assert.equal(model.execute('search-index', { index: 100 }).value, null)
  assert.throws(() => model.execute('search-index', { index: -1 }))
  assert.match(model.getDiagram().rows[1][1].label, /offset 1 \/ byte 5/)
  model.execute('clear', {})
  model.execute('insert-end', { value: 42 })
  assert.equal(model.execute('search-index', { index: 0 }).value, null)
  assert.equal(model.execute('search-index', { index: values.length }).value, 42)
})

test('time index returns the first qualifying physical offset despite duplicates and out-of-order timestamps', () => {
  const model = new TimeIndex()
  const times = [100, 5, 40, 100, 2, 90, 150, 20, 150, 4, 200]
  for (let index = 0; index < times.length; index++) model.execute('insert-end', { timestamp: times[index], value: index })
  for (let timestamp = 0; timestamp <= 210; timestamp++) {
    const expected = times.findIndex((value) => value >= timestamp)
    const events = []
    assert.equal(model.execute('search-value', { timestamp }, { onLinearChange: (event) => events.push(event) }).value, expected < 0 ? null : expected)
    assert.ok(events.filter((event) => event.description.startsWith('Read timestamp')).length <= 3)
  }
  const before = model.getDiagram()
  assert.throws(() => model.execute('insert-end', { timestamp: -1, value: 0 }))
  assert.deepEqual(model.getDiagram(), before)
  model.execute('clear', {})
  model.execute('insert-end', { timestamp: 7, value: 9 })
  assert.equal(model.execute('search-value', { timestamp: 7 }).value, times.length)
})

test('IVF full probing matches exhaustive nearest search with stable ties and rejected retraining is atomic', () => {
  const model = new IVFIndex()
  const points = [[0, 0], [100, 100], [50, 0], [1, 1], [99, 98], [49, 2], [10, 4], [88, 87], [55, -3], [0, 0]]
  model.execute('build-values', { values: points.map((point) => point.join(':')).join(','), clusters: 3 })
  for (const [x, y] of [[0, 0], [52, 1], [99, 100], [-1024, 1024], [70, 30]]) {
    let best = 0
    for (let index = 1; index < points.length; index++) {
      const distance = (points[index][0] - x) ** 2 + (points[index][1] - y) ** 2
      const previous = (points[best][0] - x) ** 2 + (points[best][1] - y) ** 2
      if (distance < previous) best = index
    }
    assert.equal(model.execute('nearest-neighbor', { x, y, probes: 3 }).value, best + 1)
    const events = []
    const approximate = model.execute('nearest-neighbor', { x, y, probes: 1 }, { onLinearChange: (event) => events.push(event) })
    assert.match(approximate.description, /Approximate/)
    assert.equal(events.filter((event) => event.description.startsWith('Probe inverted list')).length, 1)
    const selected = events.find((event) => event.description.startsWith('Probe inverted list')).activeId
    const allowed = new Set(model.getDiagram().rows[0].find((entry) => entry.id === selected).children)
    assert.ok(events.filter((event) => event.activeId?.startsWith('ivf-vector')).every((event) => allowed.has(event.activeId)))
  }
  const before = model.getDiagram()
  assert.equal(model.execute('build-values', { values: '1:1,1:1', clusters: 2 }).status, 'REJECTED')
  assert.equal(model.execute('nearest-neighbor', { x: 0, y: 0, probes: 4 }).status, 'REJECTED')
  assert.deepEqual(model.getDiagram(), before)
  model.execute('build-values', { values: '1:1', clusters: 1 })
  assert.equal(model.execute('nearest-neighbor', { x: 1, y: 1, probes: 1 }).value, 11)
  model.execute('clear', {})
  assert.equal(model.execute('nearest-neighbor', { x: 0, y: 0, probes: 1 }).value, null)
})

test('content-addressed references match SHA-256 ChainIDs, share blobs, and reuse identical chains', () => {
  const digest = (text) => `sha256:${createHash('sha256').update(text).digest('hex')}`
  const model = new ContentAddressedLayers()
  assert.equal(model.execute('insert', { parent: 0, value: 12 }).value, 1)
  assert.equal(model.execute('insert', { parent: 1, value: 34 }).value, 2)
  assert.equal(model.execute('insert', { parent: 1, value: 34 }).value, 2)
  assert.equal(model.length, 2)
  assert.equal(model.execute('insert', { parent: 0, value: 34 }).value, 3)
  assert.equal(model.getDiagram().rows[1].length, 2, 'Different chains share the same payload blob')
  const root = digest('12')
  const diff = digest('34')
  const chain = digest(`${root} ${diff}`)
  assert.deepEqual(model.execute('browse-node', { index: 2 }).value, [2, 1])
  assert.ok(model.execute('browse-node', { index: 2 }).description.includes(chain))
  assert.equal(model.execute('search-value', { value: 34 }).value, diff)
  assert.equal(model.execute('search-value', { value: 35 }).value, null)
  assert.equal(model.execute('verify-proof', {}).value, true)
  const before = model.getDiagram()
  assert.equal(model.execute('insert', { parent: 999, value: 4 }).status, 'REJECTED')
  assert.deepEqual(model.getDiagram(), before)
  const clone = model.clone()
  clone.execute('clear', {})
  assert.equal(clone.length, 0)
  assert.deepEqual(model.getDiagram(), before)
  assert.equal(clone.execute('insert', { parent: 0, value: 1 }).value, 4)
})

test('new structured inputs reject duplicate keys, invalid cluster counts, and unsafe integers', () => {
  for (const kind of ['sstable', 'sparse-primary-index']) {
    const request = AppliedInput.create(kind, 'build-values')
    assert.deepEqual(request.parse({ values: '-5:20,99:-12' }), { values: '-5:20,99:-12' })
    for (const values of ['1:2,1:3', '', '1:2,', '9007199254740992:0']) assert.ok(request.validate({ values }).values)
  }
  const ivf = AppliedInput.create('ivf-index', 'build-values')
  assert.ok(ivf.validate({ values: '1:1,1:1', clusters: '2' }).clusters)
  assert.ok(ivf.validate({ values: '1025:0', clusters: '1' }).values)
  assert.ok(AppliedInput.create('time-index', 'insert-end').validate({ timestamp: '-1', value: '1' }).timestamp)
})

const fixtures = [
  ['brin', 'Trees', 'BRIN', 'storage-database-indexes', { 'insert-end': ['Append', { value: 7 }], 'search-overlap': ['SearchRange', { minimum: 4, maximum: 30 }] }],
  ['sstable', 'Trees', 'SSTable', 'storage-database-indexes', { 'build-values': ['Build', { values: '3:30,1:10,2:20' }], 'search-value': ['SearchByKey', { key: 20 }] }],
  ['sparse-primary-index', 'Trees', 'SparsePrimaryIndex', 'storage-database-indexes', { 'build-values': ['Build', { values: '3:30,1:10,2:20' }], 'search-value': ['SearchByKey', { key: 20 }] }],
  ['sparse-offset-index', 'Trees', 'SparseOffsetIndex', 'storage-database-indexes', { 'insert-end': ['Append', { value: 77 }], 'search-index': ['ReadOffset', { index: 4 }] }],
  ['time-index', 'Trees', 'TimeIndex', 'storage-database-indexes', { 'insert-end': ['Append', { timestamp: 1, value: 77 }], 'search-value': ['SearchTimestamp', { timestamp: 39 }] }],
  ['ivf-index', 'Trees', 'IVFIndex', 'spatial-similarity-indexes', { 'build-values': ['Build', { values: '0:0,10:10,1:2', clusters: 2 }], 'nearest-neighbor': ['NearestNeighbor', { x: 1, y: 2, probes: 2 }] }],
  ['content-addressed-layers', 'HashBased', 'ContentAddressedLayers', 'integrity-verification', { insert: ['AddLayer', { parent: 1, value: 45 }], 'search-value': ['LookupContent', { value: 2 }], 'browse-node': ['ReadChain', { index: 7 }], 'verify-proof': ['Verify', {}] }],
]

for (const [kind, group, folder, subject, actions] of fixtures) {
  test(`${kind}: menu, information, action-owned playback, and clear remain integrated`, async () => {
    const model = AppliedStructureCatalog.createDefault(kind)
    assert.equal(model.length, 10)
    const picker = MenuNavigation.forStructure(kind)
    assert.equal(picker.category, 'advanced')
    assert.equal(picker.group, subject)
    const information = StructureInformation.get(kind)
    assert.equal(information.useCases.length, 4)
    assert.ok(information.technologies.length)
    assert.ok(StructureInformation.getProducts(kind).length)
    const before = model.getDiagram()
    for (const action of AppliedActionCatalog.getActions(kind)) {
      const [actionFolder, input] = actions[action.kind] ?? [action.kind === 'clear' ? 'Clear' : 'InspectStorage', {}]
      const module = await import(`../src/components/DataStructuresOverview/${group}/${folder}/${actionFolder}/${actionFolder}Animation.ts`)
      const Sequence = module[`${actionFolder}Animation`]
      assert.ok(Sequence.prototype instanceof LinearAnimation)
      const plan = new Sequence(model, input)
      assert.deepEqual(model.getDiagram(), before)
      assert.ok(plan.steps.length <= 98)
      for (const step of plan.steps) {
        const ids = new Set(step.scene.nodes.map((node) => node.id))
        assert.equal(ids.size, step.scene.nodes.length)
        for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
        assert.equal(step.scene.width, plan.steps[0].scene.width)
        assert.equal(step.scene.height, plan.steps[0].scene.height)
      }
      if (action.kind === 'clear') assert.equal(plan.result.length, 0)
    }
    const full = model.clone()
    if (['brin', 'sparse-offset-index', 'time-index', 'content-addressed-layers'].includes(kind)) {
      while (full.length < 64) {
        if (kind === 'content-addressed-layers') full.execute('insert', { parent: full.length, value: full.length + 100 })
        else full.execute('insert-end', { value: 1, timestamp: 1 })
      }
      const snapshot = full.getDiagram()
      const result = kind === 'content-addressed-layers' ? full.execute('insert', { parent: 64, value: 999 }) : full.execute('insert-end', { value: 2, timestamp: 2 })
      assert.equal(result.status, 'REJECTED')
      assert.deepEqual(full.getDiagram(), snapshot)
    }
  })
}
