import assert from 'node:assert/strict'
import { test } from 'node:test'
import { DenseTensor } from '../src/components/DataStructuresOverview/Linear/DenseTensor/DenseTensor.ts'
import { Grid2D } from '../src/components/DataStructuresOverview/Linear/Grid2D/Grid2D.ts'
import { SparseCOO } from '../src/components/DataStructuresOverview/Linear/SparseCOO/SparseCOO.ts'
import { SparseCSC } from '../src/components/DataStructuresOverview/Linear/SparseCSC/SparseCSC.ts'
import { NumericalCSR } from '../src/components/DataStructuresOverview/Linear/NumericalCSR/NumericalCSR.ts'
import { NumericalStructureCatalog } from '../src/visualization/NumericalStructureCatalog.ts'
import { NumericalStructureDefinitions } from '../src/visualization/NumericalStructureDefinitions.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { LinearStructureCatalog } from '../src/visualization/LinearStructureCatalog.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { StructuredNumericalInput } from '../src/visualization/StructuredNumericalInput.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'
import { ReadAnimation as TensorRead } from '../src/components/DataStructuresOverview/Linear/DenseTensor/Read/ReadAnimation.ts'
import { SetAnimation as CSCSet } from '../src/components/DataStructuresOverview/Linear/SparseCSC/Set/SetAnimation.ts'
import { InspectStorageAnimation } from '../src/components/DataStructuresOverview/Linear/SparseCOO/InspectStorage/InspectStorageAnimation.ts'
import { MultiplyVectorAnimation } from '../src/components/DataStructuresOverview/Linear/NumericalCSR/MultiplyVector/MultiplyVectorAnimation.ts'
import { LinearAnimation } from '../src/visualization/LinearAnimation.ts'

const build = (model, shape, values) => model.execute('build-values', { shape: shape.join(','), values: values.join(',') })
const read = (model, coordinates) => model.execute('search-index', { coordinates: coordinates.join(',') }).value
const set = (model, coordinates, value) => model.execute('update-index', { coordinates: coordinates.join(','), value })
const state = (model) => JSON.stringify(model.getStorage())
const row = (model, name) => model.getStorage().find((entry) => entry.name === name).values
const sparseTypes = [SparseCOO, SparseCSC, NumericalCSR]

const assertCompressed = (model) => {
  const csc = model.kind === 'sparse-csc'
  const pointers = row(model, csc ? 'columnPointers' : 'rowPointers')
  const indices = row(model, csc ? 'rowIndices' : 'columnIndices')
  const data = row(model, 'data')
  assert.equal(pointers.length, model.shape[csc ? 1 : 0] + 1)
  assert.equal(pointers[0], 0)
  assert.equal(pointers.at(-1), data.length)
  assert.equal(indices.length, data.length)
  for (let major = 0; major + 1 < pointers.length; major += 1) {
    assert.ok(pointers[major] <= pointers[major + 1])
    for (let offset = pointers[major]; offset < pointers[major + 1]; offset += 1) {
      assert.ok(indices[offset] >= 0 && indices[offset] < model.shape[csc ? 0 : 1])
      assert.notEqual(data[offset], 0)
      if (offset > pointers[major]) assert.ok(indices[offset - 1] < indices[offset])
    }
  }
}

test('five numerical structures have ten-entry defaults, unique Linear menu entries and shared routing', () => {
  const models = LinearStructureCatalog.createModels()
  for (const definition of NumericalStructureDefinitions.structures) {
    const model = models.get(definition.kind)
    assert.equal(model.length, 10)
    assert.equal(StructureCatalog.getGroupForStructure(definition.kind), 'linear')
    assert.equal(StructureCatalog.structures.filter((entry) => entry.kind === definition.kind).length, 1)
    assert.deepEqual(LinearStructureCatalog.createScene(model), NumericalStructureCatalog.createScene(model))
    assert.equal(StructureInformation.get(definition.kind).useCases.length, 4)
    assert.ok(StructureInformation.getProducts(definition.kind).length)
    assert.deepEqual(ActionCatalog.getScopedActions(definition.kind, 'sorting'), [])
    assert.deepEqual(ActionCatalog.getScopedActions(definition.kind, 'graph-traversal'), [])
    for (const action of ActionCatalog.getActions(definition.kind)) {
      const request = ActionInputRequest.create(definition.kind, action.kind, model.length, undefined, model.shape)
      assert.equal(Boolean(request), !['clear', 'inspect-storage', 'coalesce'].includes(action.kind))
      if (request) assert.ok(request.structured)
    }
  }
})

test('tensor indexing handles ranks one through four, reshaping preserves values, invalid requests preserve state', () => {
  const tensor = new DenseTensor()
  for (const shape of [[8], [2, 5], [2, 2, 3], [2, 2, 2, 2]]) {
    const count = shape.reduce((product, dimension) => product * dimension, 1)
    const values = Array.from({ length: count }, (_, index) => index - 4)
    assert.notEqual(build(tensor, shape, values).status, 'REJECTED')
    for (let offset = 0; offset < count; offset += 1) {
      const coordinates = tensor.getCoordinates(offset)
      assert.equal(read(tensor, coordinates), values[offset])
      set(tensor, coordinates, -offset)
      assert.equal(read(tensor, coordinates), -offset)
    }
  }
  const values = tensor.getValues()
  tensor.execute('reshape', { shape: '4,4' })
  assert.deepEqual(tensor.strides, [4, 1])
  assert.deepEqual(tensor.getValues(), values)
  assert.equal(read(tensor, [3, 3]), -15)
  for (const [action, input] of [
    ['reshape', { shape: '2,3' }],
    ['build-values', { shape: '8,8,8', values: '1' }],
    ['update-index', { coordinates: '4,0', value: 9 }],
    ['update-index', { coordinates: '0', value: 9 }],
    ['update-index', { coordinates: '0,0', value: Number.MAX_SAFE_INTEGER + 1 }],
  ]) {
    const before = state(tensor)
    assert.equal(tensor.execute(action, input).status, 'REJECTED')
    assert.equal(state(tensor), before)
  }
  const clone = tensor.clone()
  tensor.execute('clear', {})
  assert.deepEqual(tensor.shape, [4, 4])
  assert.ok(tensor.getValues().every((value) => value === 0))
  assert.deepEqual(clone.getValues(), values)
})

test('grid keeps rectangular row-major indexing and occupied cells after zeroing', () => {
  const grid = Grid2D.createDefault()
  assert.equal(read(grid, [1, 4]), 100)
  set(grid, [0, 4], -7)
  assert.equal(grid.getValues()[4], -7)
  const scene = NumericalStructureCatalog.createScene(grid)
  const first = scene.nodes.find((node) => node.id === 'grid-2d-data-0')
  const nextRow = scene.nodes.find((node) => node.id === 'grid-2d-data-5')
  assert.equal(first.x, nextRow.x)
  assert.ok(first.y < nextRow.y)
  assert.equal(grid.execute('reshape', { shape: '5,2' }).status, 'REJECTED')
  grid.execute('clear', {})
  assert.equal(grid.length, 10)
  assert.equal(read(grid, [1, 4]), 0)
})

test('sparse representations agree with a dense oracle through build, updates, removal, lookup, and products', () => {
  for (const Model of sparseTypes) {
    const model = new Model()
    const rows = 5
    const columns = 4
    const values = Array.from({ length: rows * columns }, (_, index) => index % 3 === 0 ? index - 10 : 0)
    build(model, [rows, columns], values)
    for (let iteration = 0; iteration < 35; iteration += 1) {
      const r = iteration % rows
      const c = (iteration * 3) % columns
      const value = iteration % 4 === 0 ? 0 : iteration - 20
      set(model, [r, c], value)
      values[r * columns + c] = value
      for (let rIndex = 0; rIndex < rows; rIndex += 1) {
        for (let cIndex = 0; cIndex < columns; cIndex += 1) assert.equal(BigInt(read(model, [rIndex, cIndex])), BigInt(values[rIndex * columns + cIndex]))
      }
      if (model.kind !== 'sparse-coo') assertCompressed(model)
    }
    const vector = [3, -2, 0, 5]
    const expected = []
    for (let r = 0; r < rows; r += 1) {
      let sum = 0n
      for (let c = 0; c < columns; c += 1) sum += BigInt(values[r * columns + c]) * BigInt(vector[c])
      expected.push(String(sum))
    }
    const before = state(model)
    assert.equal(model.execute('multiply-vector', { vector: vector.join(',') }).value, `[${expected.join(', ')}]`)
    assert.equal(state(model), before)
    assert.equal(model.execute('multiply-vector', { vector: '1' }).status, 'REJECTED')
    assert.equal(state(model), before)
    const clone = model.clone()
    model.execute('clear', {})
    assert.equal(model.length, 0)
    assert.deepEqual(model.shape, [rows, columns])
    assert.equal(BigInt(read(model, [4, 3])), 0n)
    assert.equal(state(clone), before)
    if (model.kind !== 'sparse-coo') assertCompressed(model)
  }
})

test('COO duplicates sum exactly, coalesce cancels zeros, Set replaces duplicates and overflow rejects unchanged', () => {
  const model = new SparseCOO()
  build(model, [2, 2], [0, 0, 0, 0])
  for (const [coordinates, value] of [['1,0', 7], ['0,1', 3], ['1,0', -7], ['0,1', 4], ['0,0', 0]]) model.execute('insert', { coordinates, value })
  assert.equal(model.length, 5)
  assert.equal(BigInt(read(model, [0, 1])), 7n)
  model.execute('coalesce', {})
  assert.deepEqual(model.getEntries(), [{ row: 0, column: 1, value: 7, offset: 0 }])
  model.execute('insert', { coordinates: '0,1', value: 2 })
  set(model, [0, 1], -9)
  assert.equal(model.length, 1)
  assert.equal(BigInt(read(model, [0, 1])), -9n)
  model.execute('insert', { coordinates: '1,1', value: Number.MAX_SAFE_INTEGER })
  model.execute('insert', { coordinates: '1,1', value: 1 })
  const before = state(model)
  assert.equal(model.execute('coalesce', {}).status, 'REJECTED')
  assert.equal(state(model), before)
  assert.equal(BigInt(read(model, [1, 1])), BigInt(Number.MAX_SAFE_INTEGER) + 1n)
  assert.equal(model.execute('multiply-vector', { vector: `0,${Number.MAX_SAFE_INTEGER}` }).value,
    `[${-9n * BigInt(Number.MAX_SAFE_INTEGER)}, ${(BigInt(Number.MAX_SAFE_INTEGER) + 1n) * BigInt(Number.MAX_SAFE_INTEGER)}]`)
})

test('COO capacity and invalid matrix rebuilds never alter canonical storage', () => {
  const model = new SparseCOO()
  for (let index = 0; index < 64; index += 1) model.execute('insert', { coordinates: '0,0', value: 1 })
  const before = state(model)
  assert.equal(model.execute('insert', { coordinates: '0,1', value: 1 }).status, 'REJECTED')
  assert.equal(state(model), before)
  assert.equal(set(model, [1, 1], 7).status, 'REJECTED')
  assert.equal(state(model), before)
  set(model, [0, 0], 9)
  assert.equal(model.length, 1)
  for (const Model of sparseTypes) {
    const matrix = Model.createDefault()
    const snapshot = state(matrix)
    for (const input of [
      { shape: '2,2', values: '1,2,3' },
      { shape: '9,2', values: '1' },
      { shape: '2,2,2', values: '1' },
      { shape: '0,2', values: '1' },
      { shape: '1,1', values: '1.5' },
    ]) {
      assert.equal(matrix.execute('build-values', input).status, 'REJECTED')
      assert.equal(state(matrix), snapshot)
    }
  }
})

test('numerical dialogs validate complete shapes, values, coordinates, vector lengths, and reshape products', () => {
  const input = StructuredNumericalInput.create('dense-tensor', 'build-values')
  assert.deepEqual(input.parse({ shape: '2,2', values: '1, -2, 0, 4' }), { shape: '2,2', values: '1, -2, 0, 4' })
  for (const shape of ['0,2', '9', '8,8,2', '1,1,1,1,1', '2,', '']) assert.ok(input.validate({ shape, values: '1' }).shape)
  assert.ok(input.validate({ shape: '2,2', values: '1,2,3' }).values)
  const coordinates = StructuredNumericalInput.create('numerical-csr', 'update-index', [2, 5])
  assert.deepEqual(coordinates.parse({ coordinates: '1,4', value: '-5' }), { coordinates: '1,4', value: -5 })
  for (const value of ['2,0', '-1,0', '0,5', '0', '0,0,0']) assert.ok(coordinates.validate({ coordinates: value, value: '3' }).coordinates)
  assert.ok(coordinates.validate({ coordinates: '0,0', value: '1,2' }).value)
  assert.ok(StructuredNumericalInput.create('dense-tensor', 'reshape', [2, 5]).validate({ shape: '2,4' }).shape)
  assert.deepEqual(StructuredNumericalInput.create('dense-tensor', 'reshape', [2, 5]).validate({ shape: '5,2' }), {})
  assert.ok(StructuredNumericalInput.create('sparse-csc', 'multiply-vector', [2, 5]).validate({ vector: '1,2' }).vector)
  const request = ActionInputRequest.create('grid-2d', 'search-index', 10, undefined, [2, 5])
  assert.ok(request.structured.validate({ coordinates: '2,0' }).coordinates)
})

test('playback clones preserve sources, fixed bounds, independent snapshots, query results and bounded recording', () => {
  const tensor = DenseTensor.createDefault()
  const readPlan = new TensorRead(tensor, { coordinates: '1,4' })
  assert.equal(readPlan.steps.at(-1).code, 'return 100')
  assert.equal(readPlan.steps.at(-1).scene.focusId, 'dense-tensor-data-9')
  const matrix = SparseCSC.createDefault()
  const before = state(matrix)
  const plan = new CSCSet(matrix, { coordinates: '0,1', value: 42 })
  assert.equal(state(matrix), before)
  assert.equal(Number(read(plan.result, [0, 1])), 42)
  const firstScene = JSON.stringify(plan.steps[0].scene)
  set(plan.result, [0, 1], -11)
  assert.equal(JSON.stringify(plan.steps[0].scene), firstScene)
  for (const step of plan.steps) {
    assert.equal(step.scene.width, plan.steps[0].scene.width)
    assert.equal(step.scene.height, plan.steps[0].scene.height)
    const ids = new Set(step.scene.nodes.map((node) => node.id))
    assert.equal(ids.size, step.scene.nodes.length)
    if (step.scene.focusId) assert.ok(ids.has(step.scene.focusId))
    assertCompressed(matrix)
  }
  const coo = new SparseCOO()
  for (let index = 0; index < 64; index += 1) coo.execute('insert', { coordinates: '0,0', value: index })
  const inspect = new InspectStorageAnimation(coo)
  assert.equal(inspect.steps.length, LinearAnimation.maximumDetailedFrames + 2)
  assert.match(inspect.steps.at(-1).description, /98 intermediate trace events/)
  assert.match(inspect.steps.at(-1).code, /^return /)
  assert.equal(state(inspect.result), state(coo))
  const product = new MultiplyVectorAnimation(NumericalCSR.createDefault(), { vector: '1,1,1,1,1' })
  assert.match(product.steps.at(-1).code, /^return /)
  assert.match(product.steps.at(-1).description, /\[6, 9, 21, 19\]/)
})
