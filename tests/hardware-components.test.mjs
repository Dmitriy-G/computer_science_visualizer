import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HardwareOverviewCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareOverviewCatalog.ts'
import { HardwareSnapshot } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareSnapshot.ts'
import { LatchModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Latch/LatchModel.ts'
import { SramCellModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/SramCell/SramCellModel.ts'
import { DramRowModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/DramRow/DramRowModel.ts'
import { HddSectorModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HddSector/HddSectorModel.ts'
import { HddLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Hdd/HddLayout.ts'
import { HddEcc } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HddSector/HddEcc.ts'
import { HddRecordingCode } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HddSector/HddRecordingCode.ts'
import { NandCellModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/NandCell/NandCellModel.ts'
import { SsdFtlModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/SsdFtl/SsdFtlModel.ts'
import { SsdGarbageCollectionModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/SsdGarbageCollection/SsdGarbageCollectionModel.ts'
import { SsdWearLevelingModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/SsdWearLeveling/SsdWearLevelingModel.ts'
import { SsdLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ssd/SsdLayout.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'
import { MenuSearchIndex } from '../src/components/MainMenu/Search/MenuSearchIndex.ts'

const choices = HardwareOverviewCatalog.choices.filter((choice) => !choice.components.includes('CPU'))

test('seven component lessons retain independent deterministic scenes and fundamental search destinations', () => {
  assert.equal(choices.length, 7)
  const index = new MenuSearchIndex(() => null)
  for (const choice of choices) {
    const source = new HardwareSnapshot()
    const original = source.clone()
    const definition = HardwareOverviewCatalog.definition(choice.kind)
    const plan = definition.create(source, 0)
    assert.deepEqual(source, original)
    assert.deepEqual(plan, definition.create(source, 0))
    assert.ok(plan.steps.length > 2 && plan.steps.length <= 96)
    assert.equal(plan.result.events, plan.steps.length)
    assert.equal(plan.steps[0].phase, 0)
    assert.equal(plan.steps.at(-1).phase, 2)
    for (const step of plan.steps) {
      assert.equal(step.scene.kind, 'hardware-component')
      assert.equal(step.scene.width, plan.steps[0].scene.width)
      assert.equal(step.scene.height, plan.steps[0].scene.height)
      const ids = new Set(step.scene.nodes.map((node) => node.id))
      assert.equal(ids.size, step.scene.nodes.length)
      assert.ok(step.scene.focusId === null || ids.has(step.scene.focusId))
      assert.ok(step.scene.regions.length > 0)
      for (const edge of step.scene.edges) {
        assert.ok(ids.has(edge.from), `${choice.kind}: ${edge.from}`)
        assert.ok(ids.has(edge.to), `${choice.kind}: ${edge.to}`)
      }
    }
    const first = structuredClone(plan.steps[0].scene)
    plan.steps.at(-1).scene.nodes[0].displayValue = 'changed final snapshot'
    plan.result.diagram.fixtures[0].value = 'changed result'
    assert.deepEqual(plan.steps[0].scene, first)
    const information = HardwareOverviewCatalog.describeOverview(choice.kind)
    assert.ok(information.steps.length > 0 && information.steps.length <= 10)
    assert.ok(information.realWorldUsage.technologies.length > 0)
    const results = index.find('algorithms', choice.name).filter((result) => result.componentAlgorithm === choice.kind)
    assert.equal(results.length, 1)
    assert.deepEqual(results[0].components, choice.components)
    const category = choice.devices?.[0] ?? choice.components[0]
    assert.equal(results[0].context, `System Components Overview / Hardware Fundamental / ${category}`)
    assert.equal(results[0].symbol, category)
  }
})

test('all four SSD overviews retain the category schematic and return to its camera bounds', () => {
  const common = SsdLayout.create()
  for (const kind of ['nand-cell', 'ssd-ftl', 'ssd-garbage-collection', 'ssd-wear-leveling']) {
    const plan = HardwareOverviewCatalog.definition(kind).create(new HardwareSnapshot(), 0)
    for (const step of plan.steps) {
      assert.equal(step.scene.width, common.width)
      assert.ok(step.scene.height > common.height)
      for (const region of common.regions) {
        assert.deepEqual(step.scene.regions.find((candidate) => candidate.id === region.id), region)
      }
      const paths = new Set(step.scene.paths.map((path) => path.id))
      assert.equal(paths.size, step.scene.paths.length)
      for (const path of common.paths) assert.ok(paths.has(path.id), `${kind}: missing ${path.id}`)
      assert.ok(step.scene.nodes.some((node) => node.id === 'ssd-state-controller'))
      assert.equal(step.scene.paths.find((path) => path.id === 'ssd-channel-1').highlighted, false)
      assert.equal(step.scene.paths.find((path) => path.id === 'ssd-channel-0-package-1').highlighted, false)
    }
    assert.ok(plan.steps.some((step) => step.scene.paths.some((path) => path.highlighted)))
    const restored = SystemOverviewLayout.create('ssd', plan.steps.at(-1).scene)
    assert.deepEqual(restored.camera.from, restored.camera.to)
  }
  assert.deepEqual(SsdLayout.create(), common)
})

test('shared SSD data paths distinguish program, read, and metadata-only mapping publication', () => {
  const model = new SsdFtlModel()
  const destination = model.allocate()
  model.program(0, 'A2', destination)
  const programmed = model.snapshot().diagram
  assert.ok(programmed.paths.find((path) => path.id === 'ssd-buffer-encode').highlighted)
  assert.ok(programmed.paths.find((path) => path.id === 'ssd-encode-nand').highlighted)
  assert.equal(programmed.paths.find((path) => path.id === 'ssd-nand-decode').highlighted, false)
  assert.equal(programmed.fixtures.find((cell) => cell.id === 'ssd-state-ftl').value, 'CH0 / T0 / D0 / PL0 / B0 / P2')
  model.commit()
  const committed = model.snapshot().diagram
  assert.ok(committed.paths.find((path) => path.id === 'ssd-sram-ftl').highlighted)
  for (const id of ['ssd-ftl-nand', 'ssd-channel-0', 'ssd-buffer-encode', 'ssd-encode-nand']) {
    assert.equal(committed.paths.find((path) => path.id === id).highlighted, false)
  }
  model.read(0)
  const read = model.snapshot().diagram
  for (const id of ['ssd-nand-decode', 'ssd-decode-buffer', 'ssd-interface-dma', 'ssd-channel-0-package-0']) {
    assert.ok(read.paths.find((path) => path.id === id).highlighted)
  }
  assert.equal(read.paths.find((path) => path.id === 'ssd-encode-nand').highlighted, false)
  assert.notEqual(read.paths.find((path) => path.id === 'ssd-channel-0').d, programmed.paths.find((path) => path.id === 'ssd-channel-0').d)
  assert.equal(read.fixtures.find((cell) => cell.id === 'ssd-state-dma').value, 'A2')
  assert.equal(programmed.paths.find((path) => path.id === 'ssd-nand-decode').highlighted, false)
})

test('SSD relocation uses both ECC paths without host traffic and erase bypasses payload ECC', () => {
  const model = new SsdGarbageCollectionModel()
  const victim = model.chooseVictim()
  for (const page of model.livePages(victim)) {
    model.copy(page, model.destination(victim))
    const copying = model.snapshot().diagram
    for (const id of ['ssd-nand-decode', 'ssd-decode-buffer', 'ssd-buffer-encode', 'ssd-encode-nand']) {
      assert.ok(copying.paths.find((path) => path.id === id).highlighted)
    }
    assert.equal(copying.paths.find((path) => path.id === 'ssd-interface-dma').highlighted, false)
    assert.equal(copying.paths.find((path) => path.id === 'ssd-data-interface').highlighted, false)
    assert.ok(copying.paths.find((path) => path.id === 'ssd-channel-0').bidirectional)
    model.commit()
  }
  model.erase(victim)
  const erased = model.snapshot().diagram
  assert.ok(erased.paths.find((path) => path.id === 'ssd-ftl-nand').highlighted)
  assert.ok(erased.paths.find((path) => path.id === 'ssd-channel-0-package-0').highlighted)
  for (const id of ['ssd-buffer-encode', 'ssd-encode-nand', 'ssd-nand-decode', 'ssd-decode-buffer']) {
    assert.equal(erased.paths.find((path) => path.id === id).highlighted, false)
  }
})

test('NAND overview identifies ECC encoding before programs and physical access without FTL lookup', () => {
  const plan = HardwareOverviewCatalog.definition('nand-cell').create(new HardwareSnapshot(), 0)
  let programs = 0
  for (let index = 0; index < plan.steps.length; index += 1) {
    const scene = plan.steps[index].scene
    const operation = scene.nodes.find((node) => node.id === 'buffer').status
    assert.equal(scene.paths.find((path) => path.id === 'ssd-host-ftl').highlighted, false)
    assert.equal(scene.paths.find((path) => path.id === 'ssd-cpu-ftl').highlighted, false)
    if (operation === 'program') {
      programs += 1
      assert.equal(plan.steps[index - 1].scene.nodes.find((node) => node.id === 'buffer').status, 'ECC encode')
      assert.ok(scene.paths.find((path) => path.id === 'ssd-cpu-nand').highlighted)
      assert.ok(scene.paths.find((path) => path.id === 'ssd-encode-nand').highlighted)
    }
    if (operation === 'sense') {
      assert.ok(scene.paths.find((path) => path.id === 'ssd-nand-decode').highlighted)
      assert.equal(scene.paths.find((path) => path.id === 'ssd-decode-buffer').highlighted, false)
    }
    if (operation === 'ECC check') assert.ok(scene.paths.find((path) => path.id === 'ssd-decode-buffer').highlighted)
  }
  assert.equal(programs, 3)
})

test('a transparent latch follows multiple input changes, holds when closed, and preserves state with output disconnected', () => {
  const model = new LatchModel()
  model.apply(1, true)
  assert.equal(model.stored, 1)
  model.apply(0, true)
  assert.equal(model.stored, 0)
  model.apply(1, true)
  model.apply(1, false)
  model.apply(0, false)
  assert.equal(model.stored, 1)
  model.outputEnabled = false
  const snapshot = model.snapshot()
  assert.equal(snapshot.diagram.fixtures.find((cell) => cell.id === 'pin').value, 'Z')
  assert.equal(model.stored, 1)
  model.apply(0, true)
  assert.equal(model.stored, 0)
  assert.equal(snapshot.diagram.fixtures.find((cell) => cell.id === 'stored').value, '1')
})

test('SRAM read is nondestructive and a driven write changes only the selected cell state', () => {
  const model = new SramCellModel()
  assert.throws(() => model.selectRead())
  assert.throws(() => model.write())
  model.precharge()
  model.selectRead()
  model.sense()
  assert.equal(model.sensed, 1)
  assert.equal(model.stored, 1)
  model.isolate()
  model.driveWrite(0)
  assert.equal(model.stored, 1)
  model.write()
  model.isolate()
  assert.equal(model.stored, 0)
  assert.equal(model.wordLine, false)
  assert.equal(model.sensed, 1)
})

test('DRAM enforces activation, restoration, write recovery, and precharge around row changes', () => {
  const model = new DramRowModel()
  assert.throws(() => model.read(0))
  model.activate(0)
  assert.throws(() => model.precharge())
  assert.throws(() => model.activate(1))
  model.sense()
  model.restore()
  assert.equal(model.read(0), 1)
  assert.equal(model.read(2), 1)
  model.write(1, 1)
  assert.throws(() => model.precharge())
  model.recover()
  model.precharge()
  assert.equal(model.buffer, null)
  assert.deepEqual(model.rows[0], [1, 1, 1])
  model.activate(1)
  model.sense()
  model.restore()
  assert.equal(model.read(0), 0)
})

test('RAM read delivery and HDD completion show explicit data transfers', () => {
  const dram = HardwareOverviewCatalog.definition('ram-read-bit').create(new HardwareSnapshot(), 0)
  const delivery = dram.steps.find((step) => step.title === 'Receive the read bit')
  assert.ok(delivery.scene.paths.some((path) => path.id === 'ram-controller-data' && path.highlighted))
  assert.equal(delivery.scene.nodes.find((node) => node.id === 'ram-state-controller').displayValue, '1')
  const hdd = HardwareOverviewCatalog.definition('hdd-sector').create(new HardwareSnapshot(), 0)
  assert.ok(hdd.steps.at(-1).scene.edges.some((edge) => edge.id === 'transfer' && edge.highlighted))
})

test('HDD write waits for positioning and its illustrative channel round trips data', () => {
  const model = new HddSectorModel()
  assert.throws(() => model.write())
  assert.throws(() => model.encodeRecording(), /ECC/)
  model.encodeEcc()
  model.encodeRecording()
  model.seek()
  assert.throws(() => model.write())
  model.settle()
  while (!model.aligned()) model.rotate()
  model.write()
  assert.equal(model.eccCodeword.length, 8)
  assert.equal(model.recordingBits.length, 16)
  assert.equal(model.magneticRegions.length, model.recordingBits.length)
  for (let sample = 0; sample < 8; sample += 1) model.rotate()
  model.sense()
  model.detect()
  model.decodeRecording()
  model.decode()
  assert.equal(model.checked, true)
  assert.deepEqual(model.decoded, model.data)
})

test('HDD head follows a fixed-length pivoting arm and the target sector arrives under it', () => {
  for (let track = 0; track < HddLayout.trackRadii.length; track += 1) {
    const head = HddLayout.headPosition(track)
    assert.ok(Math.abs(Math.hypot(head.x - HddLayout.pivot.x, head.y - HddLayout.pivot.y) - HddLayout.armLength) < 1e-8)
    assert.ok(Math.abs(Math.hypot(head.x - HddLayout.spindle.x, head.y - HddLayout.spindle.y) - HddLayout.trackRadii[track]) < 1e-8)
  }
  const model = new HddSectorModel()
  model.seek()
  model.settle()
  const head = HddLayout.headPosition(model.targetTrack)
  for (let rotation = 0; rotation < 8; rotation += 1) {
    const sector = HddLayout.sectorPosition(model)
    const separation = Math.hypot(head.x - sector.x, head.y - sector.y)
    if (model.aligned()) assert.ok(separation < 1e-8)
    else assert.ok(separation > 1)
    model.rotate()
  }
})

test('HDD sector playback shares the category schematic and its connected components', () => {
  const common = HddLayout.diagram()
  const lesson = new HddSectorModel().snapshot().diagram
  assert.deepEqual(lesson.regions.slice(0, common.regions.length), common.regions)
  for (const id of ['head-preamp', 'write-preamp', 'preamp-read', 'cache-ecc', 'host-cache', 'controller-map', 'map-servo', 'servo-driver', 'servo-feedback', 'driver-actuator', 'driver-spindle', 'power-driver']) {
    assert.equal(common.paths.find((path) => path.id === id).directed, true)
    assert.ok(lesson.paths.some((path) => path.id === id))
  }
  const copy = common.clone()
  const original = common.paths.find((path) => path.id === 'platter')
  copy.paths.find((path) => path.id === 'platter').caption.text = 'changed caption'
  assert.equal(original.caption.text, 'Platter')
})

test('HDD teaching ECC corrects every single-bit error and detects every double-bit error for all payloads', () => {
  for (let value = 0; value < 16; value += 1) {
    const data = [value >> 3 & 1, value >> 2 & 1, value >> 1 & 1, value & 1]
    const encoded = HddEcc.encode(data)
    assert.deepEqual(HddEcc.decode(encoded).data, data)
    assert.equal(HddEcc.decode(encoded).status, 'clean')
    for (let first = 0; first < 8; first += 1) {
      const single = [...encoded]
      single[first] ^= 1
      const result = HddEcc.decode(single)
      assert.equal(result.status, 'corrected')
      assert.equal(result.overallParity, 1)
      assert.equal(result.correctedBit, first + 1)
      assert.deepEqual(result.codeword, encoded)
      assert.deepEqual(result.data, data)
      for (let second = first + 1; second < 8; second += 1) {
        const double = [...single]
        double[second] ^= 1
        const rejected = HddEcc.decode(double)
        assert.equal(rejected.status, 'uncorrectable')
        assert.equal(rejected.overallParity, 0)
        assert.deepEqual(rejected.data, [])
      }
    }
    const symbols = HddRecordingCode.encode(encoded)
    const levels = HddRecordingCode.magnetize(symbols)
    const detected = HddRecordingCode.detect(HddRecordingCode.sense(levels))
    assert.deepEqual(detected, symbols)
    assert.deepEqual(HddRecordingCode.decode(detected), encoded)
  }
  assert.throws(() => HddRecordingCode.decode([0, 0]), /Invalid/)
})

test('HDD firmware mapping is internal and failed ECC prevents buffering or returning data', () => {
  const model = new HddSectorModel()
  const location = model.translate(7)
  assert.deepEqual(location, { head: 0, track: 1, sector: 3 })
  location.track = 2
  assert.equal(model.translate(7).track, 1)
  assert.throws(() => model.translate(99), /mapping/)
  model.encodeEcc()
  model.encodeRecording()
  model.seek()
  assert.equal(model.rotation, 1)
  model.settle()
  assert.equal(model.rotation, 2)
  while (!model.aligned()) model.rotate()
  model.write()
  model.sense()
  model.detect()
  model.decodeRecording()
  model.injectReadError(2)
  model.injectReadError(5)
  assert.equal(model.decode(), false)
  assert.equal(model.eccStatus, 'uncorrectable')
  assert.throws(() => model.bufferRead(), /ECC/)
  assert.throws(() => model.transfer(), /validated/)
  assert.deepEqual(model.transferred, [])
})

test('HDD lesson separates controller/servo and read/write processing and corrects its injected error before return', () => {
  const plan = HardwareOverviewCatalog.definition('hdd-sector').create(new HardwareSnapshot(), 0)
  const units = new Map(plan.steps[0].scene.regions.map((region) => [region.id, region]))
  for (const id of ['controller', 'firmware-map', 'servo-controller', 'cache', 'ecc', 'read-channel', 'write-channel']) assert.ok(units.has(`hdd-${id}`))
  const index = (title) => plan.steps.findIndex((step) => step.title === title)
  assert.ok(index('Seek while the platter rotates') < index('Settle and begin track following'))
  assert.ok(index('Settle and begin track following') < index('Wait for rotational latency'))
  assert.ok(index('Wait for rotational latency') < index('Drive the write head'))
  const corrected = plan.steps[index('Correct the read error with ECC')].scene
  assert.equal(corrected.nodes.find((node) => node.id === 'decoded').displayValue, '1011')
  assert.equal(corrected.nodes.find((node) => node.id === 'ecc-status').displayValue, 'bit 3 corrected')
  const last = plan.steps.at(-1).scene
  assert.equal(last.nodes.find((node) => node.id === 'host-result').displayValue, '1011')
  assert.ok(last.edges.some((edge) => edge.id === 'transfer' && edge.highlighted))
})

test('NAND rejects an arbitrary overwrite and erases neighboring pages together', () => {
  const model = new NandCellModel()
  model.program(0)
  model.buffer = [0, 0, 0, 0]
  model.program(1)
  assert.equal(model.program(0), false)
  assert.deepEqual(model.pages[0], [1, 0, 1, 0])
  model.eraseBlock()
  assert.deepEqual(model.pages, [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]])
  assert.deepEqual(model.programmed, [false, false, false])
  assert.equal(model.erases, 1)
})

test('FTL stages a replacement before publishing, then preserves the successful mapping on failure', () => {
  const model = new SsdFtlModel()
  const original = model.mapping.get(0)
  const destination = model.allocate()
  model.program(0, 'A2', destination)
  assert.equal(model.mapping.get(0), original)
  assert.equal(model.read(0), 'A')
  assert.equal(model.pages[destination].state, 'staged')
  assert.equal(model.pages[original].state, 'valid')
  assert.throws(() => model.erase(0))
  model.commit()
  assert.equal(model.read(0), 'A2')
  assert.equal(model.pages[original].state, 'invalid')
  const failed = model.allocate()
  assert.equal(model.program(0, 'A3', failed, true, false), false)
  assert.throws(() => model.commit())
  assert.equal(model.pages[failed].state, 'failed')
  assert.equal(model.mapping.get(0), destination)
  assert.equal(model.read(0), 'A2')
  assert.equal(model.hostWrites, 3)
  assert.equal(model.flashWrites, 3)
})

test('GC preserves every logical value before erase and accounts for relocation write amplification', () => {
  const model = new SsdGarbageCollectionModel()
  const victim = model.chooseVictim()
  assert.equal(victim, 0)
  assert.throws(() => model.erase(victim))
  for (const page of model.livePages(victim)) {
    model.copy(page, model.destination(victim))
    assert.throws(() => model.erase(victim))
    model.commit()
  }
  model.erase(victim)
  assert.ok(model.freeBlock(victim))
  assert.deepEqual([model.read(0), model.read(1), model.read(2)], ['A2', 'B', 'C2'])
  assert.equal(model.erases[0], 1)
  assert.equal(model.hostWrites, 5)
  assert.equal(model.flashWrites, 6)
})

test('dynamic wear allocation skips occupied low-wear blocks; static relocation makes one reusable', () => {
  const model = new SsdWearLevelingModel()
  model.compareAllocations()
  assert.deepEqual(model.concentrated, [10, 4, 0])
  assert.deepEqual(model.distributed, [5, 5, 4])
  assert.deepEqual(model.erases, [0, 4, 6])
  assert.equal(model.chooseLowWearFreeBlock(), 1)
  model.write(1, 'hot', 3)
  assert.deepEqual(model.erases, [0, 4, 6])
  assert.equal(model.coldDestination(), 6)
  model.copy(0, 6)
  assert.equal(model.read(0), 'cold')
  assert.throws(() => model.erase(0))
  model.commit()
  model.erase(0)
  assert.equal(model.read(0), 'cold')
  assert.equal(model.mapping.get(0), 6)
  assert.equal(model.chooseLowWearFreeBlock(), 0)
  assert.deepEqual(model.erases, [1, 4, 6])
  assert.equal(model.flashWrites - model.hostWrites, 1)
})
