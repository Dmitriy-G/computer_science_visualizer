import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HardwareSnapshot } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareSnapshot.ts'
import { HardwareOverviewCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareOverviewCatalog.ts'
import { RamLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ram/RamLayout.ts'
import { RamBitModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ram/RamBitModel.ts'
import { RamPlaybackLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ram/RamPlaybackLayout.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'
import { MenuSearchIndex } from '../src/components/MainMenu/Search/MenuSearchIndex.ts'

const activate = (model) => {
  model.activate()
  model.sense()
  model.restore()
}

const value = (step, id) => step.scene.nodes.find((node) => node.id === id).displayValue

test('RAM exposes exactly write/read bit overviews and removes the old search destinations', () => {
  const choices = HardwareOverviewCatalog.forGroup('hardware-ram')
  assert.deepEqual(choices.map((choice) => [choice.kind, choice.name]), [
    ['ram-write-bit', 'Write one bit'], ['ram-read-bit', 'Read one bit'],
  ])
  const index = new MenuSearchIndex(() => null)
  for (const choice of choices) {
    assert.equal(HardwareOverviewCatalog.groupFor(choice.kind), 'hardware-ram')
    const results = index.find('algorithms', choice.name).filter((result) => result.componentAlgorithm === choice.kind)
    assert.equal(results.length, 1)
    assert.equal(results[0].context, 'System Components Overview / Hardware Fundamental / RAM')
    const info = HardwareOverviewCatalog.describeOverview(choice.kind)
    assert.ok(info.steps.length <= 10)
    assert.match(info.implementationNote, /wider bursts/)
  }
  for (const query of ['A latch: capturing and holding one bit', 'SRAM cell: hold, read, and write', 'DRAM cell and row access']) {
    assert.ok(index.find('algorithms', query).every((result) => !['latch', 'sram-cell', 'dram-row'].includes(result.componentAlgorithm)))
  }
})

test('RAM writes either bit only on capacitor arrival and requires recovery before closure', () => {
  for (const bit of [0, 1]) {
    const model = new RamBitModel('write', bit)
    const before = structuredClone(model.rows)
    assert.throws(() => model.storeWrite())
    assert.throws(() => model.precharge())
    model.activate()
    assert.equal(model.wordline, true)
    assert.ok(model.capacitorCharge > 0 && model.capacitorCharge < 1)
    assert.throws(() => model.disconnect())
    model.sense()
    assert.deepEqual(model.buffer, before[0])
    model.restore()
    assert.equal(model.capacitorCharge, before[0][1])
    assert.throws(() => model.driveWriteBuffer())
    model.selectColumn()
    model.columnData = bit
    model.driveWriteBuffer()
    assert.equal(model.cell, before[0][1])
    assert.equal(model.buffer[1], bit)
    assert.throws(() => model.storeWrite())
    model.driveBitline()
    model.storeWrite()
    assert.equal(model.cell, bit)
    assert.equal(model.capacitorCharge, bit)
    assert.throws(() => model.disconnect())
    model.recoverWrite()
    model.disconnect()
    model.precharge()
    assert.equal(model.wordline, false)
    assert.equal(model.buffer, null)
    assert.equal(model.bitlineLevel, 0.5)
    assert.deepEqual(model.rows, [[before[0][0], bit, before[0][2]], before[1]])
  }
})

test('RAM reads either bit after sensing/restoration and returns it only on controller arrival', () => {
  for (const bit of [0, 1]) {
    const model = new RamBitModel('read', bit)
    const before = structuredClone(model.rows)
    assert.throws(() => model.readColumn())
    assert.throws(() => model.receiveRead())
    activate(model)
    assert.equal(model.restored, true)
    assert.throws(() => model.readColumn())
    model.selectColumn()
    assert.equal(model.readColumn(), bit)
    assert.equal(model.controllerData, null)
    assert.throws(() => model.disconnect())
    model.ioData = model.columnData
    model.socketData = model.ioData
    assert.equal(model.controllerData, null)
    model.receiveRead()
    assert.equal(model.controllerData, bit)
    model.disconnect()
    model.precharge()
    assert.deepEqual(model.rows, before)
    assert.equal(model.capacitorCharge, bit)
  }
})

test('both RAM animations retain common geometry/colors, fixed bounds, and independent snapshots', () => {
  const common = RamLayout.create()
  const commonPaths = new Set(common.paths.map((path) => path.id))
  for (const kind of ['ram-write-bit', 'ram-read-bit']) {
    const source = new HardwareSnapshot()
    const before = source.clone()
    const definition = HardwareOverviewCatalog.definition(kind)
    const plan = definition.create(source, 0)
    assert.deepEqual(source, before)
    assert.deepEqual(plan, definition.create(source, 0))
    assert.ok(plan.steps.length > 15 && plan.steps.length <= 96)
    assert.equal(plan.steps[0].phase, 0)
    assert.equal(plan.steps.at(-1).phase, 2)
    for (const step of plan.steps) {
      assert.equal(step.scene.kind, 'hardware-component')
      assert.equal(step.scene.width, common.width)
      assert.equal(step.scene.height, common.height)
      assert.equal(step.scene.regions.length, common.regions.length)
      for (const region of common.regions) {
        const expected = { ...region, shortLabel: region.shortLabel.replace(/\s*\(~[^)]*\)/g, '') }
        assert.deepEqual(step.scene.regions.find((candidate) => candidate.id === region.id), expected)
      }
      assert.ok(step.scene.regions.every((region) => !region.shortLabel.includes('(~')))
      for (const node of step.scene.nodes) {
        assert.ok(node.x - node.width / 2 >= 0 && node.x + node.width / 2 <= common.width)
        assert.ok(node.y - node.height / 2 >= 0 && node.y + node.height / 2 <= common.height)
      }
      const paths = new Set(step.scene.paths.map((path) => path.id))
      assert.equal(paths.size, step.scene.paths.length)
      for (const id of commonPaths) assert.ok(paths.has(id))
      assert.ok(step.scene.paths.filter((path) => commonPaths.has(path.id) && path.highlighted).length <= 1)
      assert.ok(!step.scene.paths.find((path) => path.id === 'ram-control-refresh').highlighted)
      assert.ok(!step.scene.paths.find((path) => path.id === 'ram-spd-sideband').highlighted)
      const nodes = new Set(step.scene.nodes.map((node) => node.id))
      assert.equal(nodes.size, step.scene.nodes.length)
      assert.ok(step.scene.focusId === null || nodes.has(step.scene.focusId))
    }
    const initial = structuredClone(plan.steps[0].scene)
    plan.result.diagram.fixtures[0].value = 'mutated result'
    plan.steps.at(-1).scene.nodes[0].displayValue = 'mutated final frame'
    assert.deepEqual(plan.steps[0].scene, initial)
    const restored = SystemOverviewLayout.create('ram', plan.steps.at(-1).scene)
    assert.deepEqual(restored.camera.from, restored.camera.to)
  }
})

test('RAM frame values follow write and read arrival order and preserve data across precharge', () => {
  const write = HardwareOverviewCatalog.definition('ram-write-bit').create(new HardwareSnapshot(), 0)
  const written = write.steps.find((step) => step.title === 'Drive the row-buffer bit')
  assert.equal(value(written, 'ram-state-sense'), '[1 1 1]')
  assert.equal(value(written, 'ram-state-capacitor'), '0 / low')
  assert.equal(value(written, 'ram-detail-row-0'), 'Row 0: [1 0 1]')
  const stored = write.steps.find((step) => step.title === 'Store capacitor charge')
  assert.equal(value(stored, 'ram-state-capacitor'), '1 / high')
  assert.equal(value(write.steps.at(-1), 'ram-detail-row-0'), 'Row 0: [1 1 1]')
  assert.equal(value(write.steps.at(-1), 'ram-state-sense'), 'equalized')
  assert.equal(value(write.steps.at(-1), 'ram-detail-wordline'), 'LOW')
  const read = HardwareOverviewCatalog.definition('ram-read-bit').create(new HardwareSnapshot(), 0)
  const returning = read.steps.find((step) => step.title === 'Return through the socket')
  assert.equal(value(returning, 'ram-state-socket-data'), '1')
  assert.equal(value(returning, 'ram-state-controller'), 'waiting')
  const received = read.steps.find((step) => step.title === 'Receive the read bit')
  assert.equal(value(received, 'ram-state-controller'), '1')
  assert.equal(received.scene.focusId, 'ram-state-controller')
  assert.equal(value(read.steps.at(-1), 'ram-detail-row-0'), 'Row 0: [0 1 0]')
  assert.equal(value(read.steps.at(-1), 'ram-state-capacitor'), '1 / high')
})

test('RAM playback replaces only the existing RAM layer without changing camera or canvas geometry', () => {
  const preview = SystemOverviewLayout.still(SystemOverviewLayout.create('ram', null))
  const initial = structuredClone(preview)
  const original = preview.layers.find((layer) => layer.id === 'ram-components')
  assert.ok(original.scene.regions.some((region) => region.shortLabel?.includes('(~')))
  for (const kind of ['ram-write-bit', 'ram-read-bit']) {
    const plan = HardwareOverviewCatalog.definition(kind).create(new HardwareSnapshot(), 0)
    for (const step of plan.steps) {
      const presented = RamPlaybackLayout.create(step.scene, preview)
      assert.equal(presented.camera, preview.camera)
      assert.equal(presented.width, preview.width)
      assert.equal(presented.height, preview.height)
      assert.equal(presented.kind, preview.kind)
      assert.equal(presented.layers.length, preview.layers.length)
      for (let index = 0; index < presented.layers.length; index += 1) {
        const layer = presented.layers[index]
        const expected = preview.layers[index]
        if (layer.id !== 'ram-components') assert.equal(layer, expected)
        else {
          assert.deepEqual({ ...layer, scene: undefined }, { ...expected, scene: undefined })
          assert.equal(layer.scene, step.scene)
          assert.equal(layer.scene.width, original.scene.width)
          assert.equal(layer.scene.height, original.scene.height)
        }
      }
    }
  }
  assert.deepEqual(preview, initial)
})
