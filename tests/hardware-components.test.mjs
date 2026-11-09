import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CpuAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/CpuAlgorithmCatalog.ts'
import { CpuModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/CpuModel.ts'
import { LatchModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Latch/LatchModel.ts'
import { SramCellModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/SramCell/SramCellModel.ts'
import { DramRowModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/DramRow/DramRowModel.ts'
import { HddSectorModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HddSector/HddSectorModel.ts'
import { NandCellModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/NandCell/NandCellModel.ts'
import { SsdFtlModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/SsdFtl/SsdFtlModel.ts'
import { SsdGarbageCollectionModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/SsdGarbageCollection/SsdGarbageCollectionModel.ts'
import { SsdWearLevelingModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/SsdWearLeveling/SsdWearLevelingModel.ts'
import { MenuSearchIndex } from '../src/components/MainMenu/Search/MenuSearchIndex.ts'

const choices = CpuAlgorithmCatalog.choices.filter((choice) => !choice.components.includes('CPU'))

test('eight component lessons retain independent deterministic scenes and fundamental search destinations', () => {
  assert.equal(choices.length, 8)
  const index = new MenuSearchIndex(() => null)
  for (const choice of choices) {
    const source = new CpuModel()
    const original = source.clone()
    const definition = CpuAlgorithmCatalog.definition(choice.kind)
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
    const information = CpuAlgorithmCatalog.describeOverview(choice.kind)
    assert.ok(information.steps.length > 0 && information.steps.length <= 10)
    assert.ok(information.realWorldUsage.technologies.length > 0)
    const results = index.find('algorithms', choice.name).filter((result) => result.cpuAlgorithm === choice.kind)
    assert.equal(results.length, 1)
    assert.deepEqual(results[0].components, choice.components)
    assert.equal(results[0].context, 'System Components Overview / Hardware / Fundamental')
    assert.equal(results[0].symbol, choice.components[0])
  }
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

test('equal-valued DRAM row-hit reads and HDD completion still show explicit transfers', () => {
  const dram = CpuAlgorithmCatalog.definition('dram-row').create(new CpuModel(), 0)
  const hit = dram.steps.find((step) => step.title === 'Another column is a row hit')
  assert.ok(hit.scene.edges.some((edge) => edge.id === 'column-io' && edge.highlighted))
  const hdd = CpuAlgorithmCatalog.definition('hdd-sector').create(new CpuModel(), 0)
  assert.ok(hdd.steps.at(-1).scene.edges.some((edge) => edge.id === 'transfer' && edge.highlighted))
})

test('HDD write waits for positioning and its illustrative channel round trips data', () => {
  const model = new HddSectorModel()
  assert.throws(() => model.write())
  model.seek()
  assert.throws(() => model.write())
  model.settle()
  while (!model.aligned()) model.rotate()
  model.write()
  assert.equal(model.magneticRegions.length, (model.data.length + 1) * 2)
  for (let sample = 0; sample < 8; sample += 1) model.rotate()
  model.sense()
  model.decode()
  assert.equal(model.checked, true)
  assert.deepEqual(model.decoded, model.data)
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
