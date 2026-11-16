import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HddAccessModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Hdd/HddAccessModel.ts'
import { HddAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Hdd/HddAlgorithmCatalog.ts'
import { HddLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Hdd/HddLayout.ts'
import { HddMediaExample } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Hdd/HddMediaExample.ts'
import { HardwareSnapshot } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareSnapshot.ts'
import { ComponentFlowTrace } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/ComponentFlowTrace.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'
import { HddViewportLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Hdd/HddViewportLayout.ts'

class AccessPosition {
  static align(model) {
    model.startSpindle()
    model.seek()
    model.settle()
    while (!model.aligned()) model.rotate()
  }
}

test('one complete HDD sector is written only after encoding, seek, settling, and alignment', () => {
  const model = new HddAccessModel('write')
  const neighbor = model.neighborData()
  const old = model.storedData()
  const oldPolarity = model.recordedPolarity()
  const payload = HddAccessModel.payload()
  const expected = payload.slice()
  assert.throws(() => model.receive(payload.subarray(0, 1)), /512-byte logical sector/)
  assert.equal(model.phase, 'idle')
  assert.deepEqual(model.storedData(), old)
  model.receive(payload)
  payload.fill(0)
  assert.throws(() => model.write(), /Invalid HDD access/)
  model.encodeEcc()
  model.encodeRecording()
  assert.equal(model.recordedPolarity(), oldPolarity, 'buffering and encoding must not change recorded magnetization')
  assert.throws(() => model.write(), /alignment/)
  model.startSpindle()
  model.seek()
  assert.equal(model.rotation, 1)
  assert.throws(() => model.write(), /alignment/)
  model.settle()
  assert.equal(model.rotation, 2)
  assert.throws(() => model.write(), /alignment/)
  while (!model.aligned()) model.rotate()
  model.write()
  assert.notEqual(model.recordedPolarity(), oldPolarity, 'the illustrated interval changes when the new pattern is recorded')
  assert.deepEqual(model.storedData(), expected)
  assert.deepEqual(model.neighborData(), neighbor)
  const detached = model.storedData()
  detached.fill(0)
  assert.deepEqual(model.storedData(), expected)
})

test('HDD read recovers every byte from magnetic readback and corrects a one-bit codeword error', () => {
  const model = new HddAccessModel('read')
  const polarity = model.recordedPolarity()
  const old = model.storedData()
  const neighbor = model.neighborData()
  assert.throws(() => model.sense(), /alignment/)
  assert.throws(() => model.deliver(), /Invalid HDD access/)
  AccessPosition.align(model)
  model.sense()
  model.detect()
  model.decodeRecording()
  model.injectError(0)
  assert.equal(model.correct(), true)
  assert.equal(model.returnedData(), null)
  model.bufferRead()
  model.deliver()
  assert.equal(model.recordedPolarity(), polarity, 'readback and error correction do not rewrite the recording film')
  assert.deepEqual(model.returnedData(), HddAccessModel.payload())
  assert.equal(model.returnedData().length, 512)
  assert.deepEqual(model.storedData(), old)
  assert.deepEqual(model.neighborData(), neighbor)
  model.returnedData().fill(0)
  assert.deepEqual(model.returnedData(), old)
})

test('uncorrectable HDD codewords block caching and host delivery', () => {
  const model = new HddAccessModel('read')
  AccessPosition.align(model)
  model.sense()
  model.detect()
  model.decodeRecording()
  model.injectError(0)
  model.injectError(1)
  assert.equal(model.correct(), false)
  assert.equal(model.phase, 'uncorrectable')
  assert.throws(() => model.bufferRead(), /Invalid HDD access/)
  assert.throws(() => model.deliver(), /Invalid HDD access/)
  assert.equal(model.cacheData(), null)
  assert.equal(model.returnedData(), null)
})

test('HDD access lessons preserve map geometry, camera, and independent bounded snapshots', () => {
  const common = HddLayout.create()
  const preview = SystemOverviewLayout.create('hdd', null)
  for (const choice of HddAlgorithmCatalog.choices) {
    const source = new HardwareSnapshot()
    const before = source.clone()
    const definition = HddAlgorithmCatalog.definition(choice.kind)
    const plan = definition.create(source)
    assert.deepEqual(source, before)
    assert.deepEqual(plan, definition.create(source))
    assert.ok(plan.steps.length > 10 && plan.steps.length <= 96)
    assert.equal(plan.steps[0].phase, 0)
    assert.equal(plan.steps.at(-1).phase, 2)
    for (const step of plan.steps) {
      assert.equal(step.scene.width, common.width)
      assert.equal(step.scene.height, common.height)
      assert.ok(step.scene.paths.filter((path) => path.highlighted).length <= 1)
      assert.deepEqual(step.scene.regions, common.regions)
      const presented = ComponentFlowTrace.present(step.scene, preview, 'hdd-components')
      assert.equal(presented.camera, preview.camera)
      assert.equal(presented.layers.find((layer) => layer.id === 'hdd-components').scene, step.scene)
    }
    const index = (title) => plan.steps.findIndex((step) => step.title === title)
    const access = choice.kind === 'hdd-write-sector' ? 'Record the sector' : 'Sense magnetic readback'
    assert.ok(index('Seek while rotating') < index('Settle and track'))
    assert.ok(index('Settle and track') < index('Sector under head'))
    assert.ok(index('Sector under head') < index(access))
    const first = structuredClone(plan.steps[0].scene)
    const pattern = (scene) => scene.paths.filter((path) => path.id.startsWith('hdd-grain-interval-')).map((path) => path.caption.text).join('')
    const scans = plan.steps.filter((step) => step.title.startsWith('Sense interval '))
    plan.result.diagram.fixtures[0].value = 'changed result'
    assert.deepEqual(plan.steps[0].scene, first)
    if (choice.kind === 'hdd-read-sector') {
      for (const step of plan.steps) assert.equal(pattern(step.scene), pattern(first))
      assert.equal(scans.length, HddMediaExample.previewIntervals)
      for (let interval = 0; interval < scans.length; interval += 1) {
        const path = scans[interval].scene.paths.find((path) => path.id === `hdd-grain-interval-${interval}`)
        assert.match(path.label, /current read/)
        assert.equal(scans[interval].scene.nodes.find((node) => node.id === 'hdd-read-sensor-state').displayValue, `sense ${path.caption.text === '+' ? '+ / up' : '- / down'}`)
      }
      assert.ok(plan.steps.some((step) => step.scene.paths.some((path) => path.id === 'hdd-storage-read-field' && path.highlighted)))
      for (const step of plan.steps) assert.equal(step.scene.nodes.find((node) => node.id === 'hdd-media-state').displayValue, '512 B / A5 B2 ...')
      assert.ok(index('Check sector ECC') < index('Deliver sector data'))
      assert.ok(!plan.steps.some((step) => step.scene.paths.some((path) => path.id === 'preamp-head' && path.highlighted)))
      assert.equal(plan.steps.at(-1).scene.nodes.find((node) => node.id === 'hdd-sector-format-state').displayValue, 'ECC / checked clean')
      assert.match(plan.steps.at(-1).scene.nodes.find((node) => node.id === 'hdd-sector-payload-state').displayValue, /^Validated \/ 512 B/)
    } else {
      for (const step of plan.steps.slice(0, index('Magnetize interval 1/16'))) assert.equal(pattern(step.scene), pattern(first))
      const writes = plan.steps.filter((step) => step.title.startsWith('Magnetize interval '))
      assert.equal(writes.length, HddMediaExample.previewIntervals)
      const finalPattern = pattern(plan.steps.at(-1).scene)
      assert.notEqual(finalPattern, pattern(first))
      for (let interval = 0; interval < writes.length; interval += 1) {
        assert.equal(pattern(writes[interval].scene), finalPattern.slice(0, interval + 1) + pattern(first).slice(interval + 1))
        assert.match(writes[interval].scene.paths.find((path) => path.id === `hdd-grain-interval-${interval}`).label, /current write/)
      }
      assert.equal(scans.length, 0)
      assert.equal(first.nodes.find((node) => node.id === 'hdd-media-state').displayValue, '512 B / 11 11 ...')
      assert.equal(plan.steps.at(-1).scene.nodes.find((node) => node.id === 'hdd-media-state').displayValue, '512 B / A5 B2 ...')
      assert.ok(index('Record the sector') < index('Return write status'))
      assert.equal(plan.steps.at(-1).scene.nodes.find((node) => node.id === 'hdd-write-pole-state').displayValue, 'field OFF / data retained')
      assert.match(plan.steps.at(-1).scene.nodes.find((node) => node.id === 'hdd-sector-payload-state').displayValue, /^Stored \/ 512 B/)
    }
  }
})

test('HDD preview writes change only the next encoded interval until the sector pass completes', () => {
  const model = new HddAccessModel('write')
  const original = model.recordedPattern()
  const neighbor = model.neighborData()
  const payload = HddAccessModel.payload()
  assert.throws(() => model.writeNextInterval(), /Invalid HDD access/)
  model.receive(payload)
  model.encodeEcc()
  model.encodeRecording()
  const target = model.pendingPattern()
  assert.throws(() => model.writeNextInterval(), /alignment/)
  AccessPosition.align(model)
  for (let index = 0; index < HddMediaExample.previewIntervals; index += 1) {
    model.writeNextInterval()
    assert.deepEqual(model.recordedPattern(), [...target.slice(0, index + 1), ...original.slice(index + 1)])
    assert.deepEqual(model.neighborData(), neighbor)
  }
  assert.throws(() => model.writeNextInterval(), /All preview intervals/)
  model.write()
  assert.deepEqual(model.storedData(), payload)
  const detached = model.recordedPattern()
  detached.fill(0)
  assert.deepEqual(model.recordedPattern(), target)
})

test('HDD example capacity agrees with its complete surface/track/sector hierarchy', () => {
  const example = HddMediaExample
  const sectors = example.plattersPerDrive * example.surfacesPerPlatter * example.tracksPerSurface * example.sectorsPerTrack
  assert.equal(sectors, 2 ** 31)
  assert.equal(example.sectorsPerDrive, sectors)
  assert.equal(sectors * example.dataBytesPerSector, 2 ** 40)
  assert.equal(example.payloadBitsPerSector, example.dataBytesPerSector * 8)
  const scene = HddLayout.create()
  const regions = new Map(scene.regions.map((region) => [region.id, region]))
  for (const id of ['hdd-recording-surfaces', 'hdd-media-tracks', 'hdd-media-sectors', 'hdd-sector-payload', 'hdd-sector-format', 'hdd-storage-head', 'hdd-write-pole', 'hdd-read-sensor', 'hdd-recording-film', 'hdd-recorded-bit-area', 'hdd-magnetic-grains']) {
    const region = regions.get(id)
    const parent = regions.get(region.parentId)
    assert.ok(region.x >= parent.x && region.y >= parent.y)
    assert.ok(region.x + region.width <= parent.x + parent.width)
    assert.ok(region.y + region.height <= parent.y + parent.height)
  }
  const detail = regions.get('hdd-storage-detail')
  const enclosure = regions.get('hdd-enclosure')
  assert.ok(enclosure.x + enclosure.width < detail.x, 'the enlargement sits to the right of the mechanical assembly')
  assert.ok(detail.y + detail.height <= scene.height)
})

test('HDD viewport framing keeps its three-column layout at a readable width', () => {
  const preview = SystemOverviewLayout.still(SystemOverviewLayout.create('hdd', null))
  const original = structuredClone(preview)
  const presented = HddViewportLayout.present(preview)
  const layer = presented.layers.find((candidate) => candidate.id === 'hdd-components')
  const pcb = layer.scene.regions.find((region) => region.id === 'hdd-electronics')
  const mechanism = layer.scene.regions.find((region) => region.id === 'hdd-enclosure')
  const media = layer.scene.regions.find((region) => region.id === 'hdd-storage-detail')
  assert.ok(pcb.x + pcb.width < mechanism.x)
  assert.ok(mechanism.x + mechanism.width < media.x)
  assert.equal(pcb.y, mechanism.y)
  assert.equal(mechanism.y, media.y)
  assert.equal(presented.layers, preview.layers)
  assert.equal(presented.camera, preview.camera)
  assert.equal(presented.viewportFit, 'width')
  assert.equal(presented.width, layer.scene.width + 40)
  assert.equal(presented.height, layer.scene.height + 40)
  assert.deepEqual(preview, original)
  const ram = SystemOverviewLayout.create('ram', null)
  assert.equal(HddViewportLayout.present(ram), ram)
})

test('HDD width framing preserves playback geometry, states, highlights, and camera', () => {
  const preview = SystemOverviewLayout.still(SystemOverviewLayout.create('hdd', null))
  for (const kind of ['hdd-write-sector', 'hdd-read-sector']) {
    const plan = HddAlgorithmCatalog.definition(kind).create(new HardwareSnapshot())
    const field = kind === 'hdd-write-sector' ? 'hdd-storage-write-field' : 'hdd-storage-read-field'
    const active = plan.steps.find((step) => step.scene.paths.some((path) => path.id === field && path.highlighted))
    for (const step of [plan.steps[0], active, plan.steps.at(-1)]) {
      const original = structuredClone(step.scene)
      const presented = ComponentFlowTrace.present(step.scene, preview, 'hdd-components')
      const framed = HddViewportLayout.present(presented)
      assert.equal(framed.layers, presented.layers)
      assert.equal(framed.layers.find((layer) => layer.id === 'hdd-components').scene, step.scene)
      assert.equal(framed.camera, preview.camera)
      assert.equal(framed.viewportFit, 'width')
      assert.equal(framed.width, step.scene.width + 40)
      assert.equal(framed.height, step.scene.height + 40)
      assert.deepEqual(step.scene, original)
    }
  }
})
