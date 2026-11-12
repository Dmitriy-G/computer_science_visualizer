import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HardwareAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/HardwareAlgorithmCatalog.ts'
import { HardwareModel } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/HardwareModel.ts'
import { HardwareLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/HardwareLayout.ts'
import { HardwareTrace } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/HardwareLesson.ts'
import { HardwareDiagram } from '../src/visualization/HardwareDiagram.ts'
import { StoreBufferModel } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/StoreBuffering/StoreBufferModel.ts'
import { MemoryFenceModel } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/MemoryFences/MemoryFenceModel.ts'
import { DmbModel } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/Dmb/DmbModel.ts'
import { DsbModel } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/Dsb/DsbModel.ts'
import { AcquireReleaseModel } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/AcquireRelease/AcquireReleaseModel.ts'
import { ExclusiveMonitorModel } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/ExclusiveLoop/ExclusiveMonitorModel.ts'
import { LseAtomicModel } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/LseAtomics/LseAtomicModel.ts'
import { LockedAtomicModel } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/LockedAtomics/LockedAtomicModel.ts'
import { MoesiModel } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/Moesi/MoesiModel.ts'
import { MesifModel } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/Mesif/MesifModel.ts'
import { TranslationModel } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/Translation/TranslationModel.ts'
import { InstructionSyncModel } from '../src/components/RealSystemsAlgorithms/Hardware/Complex/InstructionSync/InstructionSyncModel.ts'
import { MenuNavigation } from '../src/components/MainMenu/MenuNavigation.ts'
import { MenuSearchIndex } from '../src/components/MainMenu/Search/MenuSearchIndex.ts'

test('all twelve Complex lessons have deterministic independent scenes with fixed bounds', () => {
  assert.equal(HardwareAlgorithmCatalog.choices.length, 12)
  for (const choice of HardwareAlgorithmCatalog.choices) {
    const source = new HardwareModel()
    const before = source.clone()
    const definition = HardwareAlgorithmCatalog.definition(choice.kind)
    const plan = definition.create(source, 0)
    assert.deepEqual(source, before)
    assert.deepEqual(plan, definition.create(source, 0))
    assert.ok(plan.steps.length > 2 && plan.steps.length <= 256)
    assert.equal(plan.result.events, plan.steps.length)
    assert.equal(plan.steps[0].phase, 0)
    assert.equal(plan.steps.at(-1).phase, 2)
    for (const step of plan.steps) {
      assert.equal(step.scene.kind, 'hardware-system')
      assert.equal(step.scene.width, plan.steps[0].scene.width)
      assert.equal(step.scene.height, plan.steps[0].scene.height)
      const ids = new Set(step.scene.nodes.map((node) => node.id))
      assert.equal(ids.size, step.scene.nodes.length)
      assert.ok(step.scene.focusId === null || ids.has(step.scene.focusId))
      assert.ok(step.scene.hint.description.length > 0)
      assert.ok(step.scene.regions.some((region) => region.role === 'cpu'), choice.name)
      assert.ok(step.scene.regions.some((region) => region.role === 'memory'), choice.name)
      assert.ok(step.scene.edges.length > 0, choice.name)
      const cpuBlock = step.scene.regions.find((region) => region.id === 'system-cpu')
      const busBlock = step.scene.regions.find((region) => region.id === 'system-bus')
      const memoryBlock = step.scene.regions.find((region) => region.id === 'system-memory')
      assert.equal(cpuBlock.level, 'system')
      assert.equal(busBlock.level, 'system')
      assert.equal(memoryBlock.level, 'system')
      assert.ok(cpuBlock.x + cpuBlock.width <= busBlock.x)
      assert.ok(busBlock.y + busBlock.height <= memoryBlock.y)
      assert.ok(ids.has('system-cpu-port'))
      for (const region of step.scene.regions) {
        if (region.id === 'system-cpu' || region.role !== 'cpu' && region.role !== 'cache') continue
        assert.ok(region.x >= cpuBlock.x && region.x + region.width <= cpuBlock.x + cpuBlock.width)
        assert.ok(region.y >= cpuBlock.y && region.y + region.height <= cpuBlock.y + cpuBlock.height)
      }
      for (const edge of step.scene.edges) {
        assert.ok(ids.has(edge.from), `${choice.kind}: missing ${edge.from}`)
        assert.ok(ids.has(edge.to), `${choice.kind}: missing ${edge.to}`)
        assert.ok(edge.label.length > 0)
        assert.equal(edge.directed, true)
      }
    }
    const firstValue = plan.steps[0].scene.nodes[0].displayValue
    plan.steps.at(-1).scene.nodes[0].displayValue = 'mutated final frame'
    assert.equal(plan.steps[0].scene.nodes[0].displayValue, firstValue)
    assert.notEqual(plan.result.banks[0].cells[0].value, 'mutated final frame')
    assert.ok(HardwareAlgorithmCatalog.describe(choice.kind).realWorldUsage.technologies[0].url.startsWith('https://'))
    assert.ok(plan.steps.some((step) => step.scene.edges.some((edge) => edge.highlighted)), choice.name)
    const internal = new Set()
    const crossings = new Set()
    for (const step of plan.steps) {
      const owner = new Map()
      for (const region of step.scene.regions) {
        if (region.level !== 'system') continue
        for (const node of step.scene.nodes) {
          if (node.x >= region.x && node.x <= region.x + region.width && node.y >= region.y && node.y <= region.y + region.height) owner.set(node.id, region.id)
        }
      }
      for (const edge of step.scene.edges) {
        if (!edge.highlighted) continue
        const from = owner.get(edge.from)
        const to = owner.get(edge.to)
        if (from === to && from) internal.add(from)
        else if (from && to) crossings.add([from, to].sort().join(':'))
      }
    }
    for (const id of ['system-cpu', 'system-bus', 'system-memory']) assert.ok(internal.has(id), `${choice.kind}: no flow inside ${id}`)
    assert.ok(crossings.has('system-bus:system-cpu'), choice.name)
    assert.ok(crossings.has('system-bus:system-memory'), choice.name)
  }
})

test('each Complex event displays one transfer segment or one local state update', () => {
  for (const choice of HardwareAlgorithmCatalog.choices) {
    const plan = HardwareAlgorithmCatalog.definition(choice.kind).create(new HardwareModel(), 0)
    for (let index = 0; index < plan.steps.length; index += 1) {
      const step = plan.steps[index]
      const active = step.scene.edges.filter((edge) => edge.highlighted)
      const visible = step.scene.edges.filter((edge) => edge.opacity > 0)
      assert.ok(active.length <= 1, `${choice.kind}: ${step.title} bundles transfers`)
      assert.deepEqual(visible, active)
      assert.equal(step.scene.count, index + 1)
      if (step.phase === 0) {
        assert.equal(active.length, 0)
        continue
      }
      const previous = new Map(plan.steps[index - 1].scene.nodes.map((node) => [node.id, node]))
      const changed = step.scene.nodes.filter((node) => {
        const old = previous.get(node.id)
        return !old || old.displayValue !== node.displayValue || old.status !== node.status
      })
      const current = step.scene.nodes.filter((node) => node.tone === 'active')
      if (active.length) {
        const edge = active[0]
        assert.match(edge.message, /^(Data|Request|Response|Control): /, `${choice.kind}: missing transfer contents`)
        assert.equal(edge.flow, true)
        assert.equal(step.scene.focusId, edge.to)
        assert.deepEqual(new Set(current.map((node) => node.id)), new Set([edge.from, edge.to]))
        assert.ok(changed.every((node) => node.id === edge.from || node.id === edge.to), `${choice.kind}: unrelated value changes during a transfer`)
      } else {
        assert.equal(changed.length, 1, `${choice.kind}: ${step.title} has no single visible update`)
        assert.deepEqual(current.map((node) => node.id), [changed[0].id])
      }
    }
  }
})

test('a publication follows the interfaces in order and changes memory only on arrival', () => {
  const model = new DmbModel(false)
  const trace = new HardwareTrace()
  trace.record(model.view(), 'Initial', 'Initial values', '', 0)
  model.publishData()
  trace.record(model.view(), 'Publish data', 'Publish 42', '', 2)
  const transfers = trace.steps.slice(1)
  const route = ['producer-data', 'system-cpu-port', 'system-bus-port', 'system-bus-memory-port', 'system-memory-port', 'data']
  assert.equal(transfers.length, route.length - 1)
  for (let index = 0; index < transfers.length; index += 1) {
    const scene = transfers[index].scene
    const edge = scene.edges.find((candidate) => candidate.highlighted)
    assert.deepEqual([edge.from, edge.to], route.slice(index, index + 2))
    assert.equal(edge.message, 'Data: write data = 42')
    assert.equal(scene.nodes.find((node) => node.id === 'data').displayValue, index === transfers.length - 1 ? '42' : '0')
  }
  transfers.at(-1).scene.regions[0].label = 'changed region'
  assert.notEqual(transfers[0].scene.regions[0].label, 'changed region')
  assert.equal(trace.result.banks[0].cells.find((cell) => cell.id === 'data').value, '42')
})

test('transactions with unchanged payloads remain visible and narration adds no idle frame', () => {
  const model = new DmbModel(false)
  const trace = new HardwareTrace()
  trace.record(model.view(), 'Initial', 'Initial', '', 0)
  model.readFlag(false)
  trace.record(model.view(), 'First read', 'Read zero', '')
  const count = trace.steps.length
  model.readFlag(false)
  trace.record(model.view(), 'Read again', 'Read the same zero again', '')
  assert.equal(trace.steps.length, count + 5)
  assert.equal(trace.steps.at(-1).scene.edges.filter((edge) => edge.highlighted).length, 1)
  const beforeExplanation = trace.steps.length
  trace.explain('The flag is still zero.', 2)
  assert.equal(trace.steps.length, beforeExplanation)
  assert.equal(trace.steps.at(-1).phase, 2)
  assert.match(trace.steps.at(-1).description, /The flag is still zero/)

  const diagram = new HardwareDiagram().region('core', 'CPU', 'cpu', 0, 0, 300, 300).place('value', 100, 100)
  const idle = new HardwareModel([{ name: 'Core', cells: [{ id: 'value', label: 'register', value: '0' }] }], '', null, 0, diagram)
  const local = new HardwareTrace()
  local.record(idle, 'Initial', 'Initial', '', 0)
  local.record(idle, 'No operation', 'Explanation only', '', 2)
  assert.equal(local.steps.length, 1)
  assert.equal(local.steps[0].phase, 2)
})

test('locked-update presentation retains ownership until the result has returned', () => {
  const plan = HardwareAlgorithmCatalog.definition('locked-atomics').create(new HardwareModel(), 0)
  const update = plan.steps.filter((step) => step.title === 'Core 0 commits XADD')
  assert.ok(update.length > 2)
  for (const step of update.slice(0, -1)) {
    assert.equal(step.scene.nodes.find((node) => node.id === 'owner').displayValue, 'Core 0')
  }
  const last = update.at(-1).scene
  assert.equal(last.nodes.find((node) => node.id === 'owner').displayValue, 'available')
  assert.equal(last.nodes.find((node) => node.id === 'counter').displayValue, '1')
  assert.equal(last.nodes.find((node) => node.id === 'old-0').displayValue, '0')
})

test('store buffering explores all outcomes and only MFENCE rules out both-zero', () => {
  const all = ['0,0', '0,1', '1,0', '1,1']
  for (const fence of ['none', 'SFENCE', 'LFENCE']) assert.deepEqual(new StoreBufferModel(fence).outcomes(), all)
  assert.deepEqual(new StoreBufferModel('MFENCE').outcomes(), ['0,1', '1,0', '1,1'])
  const model = new StoreBufferModel('MFENCE')
  assert.equal(model.advance(0), true)
  assert.equal(model.load(0, 'x'), 1)
  assert.equal(model.load(1, 'x'), 0)
  assert.equal(model.advance(0), false)
  assert.equal(model.pc[0], 1)
  model.drain(0)
  assert.equal(model.advance(0), true)
  assert.equal(model.memory.x, 1)
  const clone = model.clone()
  clone.memory.x = 99
  assert.equal(model.memory.x, 1)
})

test('SFENCE gates WC publication and LFENCE gates later local execution', () => {
  const plain = new MemoryFenceModel()
  assert.equal(plain.publishFlag(false), true)
  assert.equal(plain.payload, 0)
  const fenced = new MemoryFenceModel()
  assert.equal(fenced.publishFlag(true), false)
  assert.equal(fenced.flag, 0)
  fenced.completeWc()
  assert.equal(fenced.publishFlag(true), true)
  assert.equal(fenced.payload, 42)
  fenced.issueLoad()
  assert.equal(fenced.executeLater(true), false)
  fenced.completeLoad()
  assert.equal(fenced.executeLater(true), true)
})

test('DSB shows request, dirty-data transfer, completion response, then CPU execution', () => {
  const model = new DsbModel()
  const active = (snapshot, id) => snapshot.diagram.edges.find((edge) => edge.id === id).highlighted
  model.issueClean()
  const requested = model.snapshot()
  assert.equal(active(requested, 'request'), true)
  assert.equal(model.pouValue, 0)
  assert.equal(model.continueAfter('DSB ISH'), false)
  assert.equal(active(model.snapshot(), 'resume'), false)
  model.reachPou()
  assert.equal(active(model.snapshot(), 'clean'), true)
  assert.equal(model.pouValue, 42)
  assert.equal(model.cleanPending, true)
  assert.equal(model.continued, false)
  model.completeClean()
  assert.equal(active(model.snapshot(), 'ack'), true)
  assert.equal(model.continued, false)
  assert.equal(model.continueAfter('DSB ISH'), true)
  assert.equal(active(model.snapshot(), 'resume'), true)
  const scene = HardwareLayout.create(requested)
  requested.diagram.regions[0].label = 'mutated source region'
  assert.notEqual(scene.regions[0].label, 'mutated source region')
  assert.equal(scene.nodes.find((node) => node.id === 'pou').displayValue, '0')
})

test('every CPU region has a visible route to memory in each lesson', () => {
  for (const choice of HardwareAlgorithmCatalog.choices) {
    const plan = HardwareAlgorithmCatalog.definition(choice.kind).create(new HardwareModel(), 0)
    for (const step of plan.steps) {
      const contains = (region, node) => node.x >= region.x && node.x <= region.x + region.width && node.y >= region.y && node.y <= region.y + region.height
      const memory = new Set()
      for (const region of step.scene.regions) {
        if (region.role === 'memory') for (const node of step.scene.nodes) if (contains(region, node)) memory.add(node.id)
      }
      for (const region of step.scene.regions) {
        if (region.role !== 'cpu') continue
        const reachable = new Set()
        const queue = []
        for (const node of step.scene.nodes) if (contains(region, node)) queue.push(node.id)
        while (queue.length) {
          const id = queue.pop()
          if (reachable.has(id)) continue
          reachable.add(id)
          for (const edge of step.scene.edges) {
            if (edge.from === id) queue.push(edge.to)
            if (edge.to === id) queue.push(edge.from)
          }
        }
        assert.ok([...memory].some((id) => reachable.has(id)), `${choice.kind}: ${region.label} lacks a memory path`)
      }
    }
  }
})

test('DMB publication ordering differs from DSB maintenance completion', () => {
  const unordered = new DmbModel(false)
  unordered.publish()
  unordered.consume()
  assert.deepEqual([unordered.observedFlag, unordered.observedData], [1, 0])
  const ordered = new DmbModel(true)
  assert.equal(ordered.publish(), false)
  assert.throws(() => ordered.consume(), /flag/)
  ordered.publishData()
  ordered.publish()
  ordered.consume()
  assert.deepEqual([ordered.observedFlag, ordered.observedData], [1, 42])
  const dmb = new DsbModel()
  dmb.issueClean()
  assert.equal(dmb.continueAfter('DMB ISH'), true)
  assert.equal(dmb.cleanComplete, false)
  const dsb = new DsbModel()
  dsb.issueClean()
  assert.equal(dsb.continueAfter('DSB ISH'), false)
  assert.equal(dsb.continued, false)
  dsb.completeClean()
  assert.equal(dsb.continueAfter('DSB ISH'), true)
})

test('acquiring a release prevents reuse of a data load from before synchronization', () => {
  const model = new AcquireReleaseModel()
  model.speculateData()
  assert.equal(model.stlr(), false)
  assert.equal(model.ldar(), 0)
  assert.equal(model.earlyData, 0)
  model.publishData()
  model.stlr()
  assert.equal(model.ldar(), 1)
  assert.equal(model.earlyData, null)
  assert.equal(model.readData(), 42)
})

test('exclusive interference fails without writing, consumes the attempt, and retries', () => {
  const model = new ExclusiveMonitorModel()
  assert.equal(model.stxr(0, 99), 1)
  assert.equal(model.value, 0)
  model.ldxr(0)
  model.ldxr(1)
  assert.equal(model.stxr(0, 1), 0)
  assert.equal(model.local[1], true)
  assert.equal(model.global[1], null)
  assert.equal(model.stxr(1, 1), 1)
  assert.equal(model.value, 1)
  assert.equal(model.local[1], false)
  assert.equal(model.ldxr(1), 1)
  assert.equal(model.stxr(1, 2), 0)
  assert.equal(model.value, 2)
  assert.equal(model.stxr(1, 3), 1)
  assert.equal(model.value, 2)
})

test('LSE operations return old values and CAS mismatch preserves the counter', () => {
  const model = new LseAtomicModel()
  assert.equal(model.ldadd(0, 1), 0)
  assert.equal(model.ldadd(1, 1), 1)
  assert.equal(model.value, 2)
  assert.equal(model.cas(0, 0, 9), false)
  assert.equal(model.old[0], 2)
  assert.equal(model.value, 2)
  assert.equal(model.cas(0, 2, 9), true)
  assert.equal(model.swp(1, 5), 9)
  assert.equal(model.value, 5)
  assert.equal(model.snapshot().diagram.edges.find((edge) => edge.id === 'return-1').message, 'Data: return old counter = 9')
  model.cas(0, 5, 12)
  const snapshot = model.snapshot()
  assert.equal(snapshot.diagram.edges.find((edge) => edge.id === 'rmw-0').message, 'Request: CASAL counter, expected = 5, new = 12')
  assert.equal(snapshot.diagram.edges.find((edge) => edge.id === 'return-0').message, 'Data: return old counter = 5')
})

test('x86 locked updates exclude competing ownership and preserve failed comparisons', () => {
  const model = new LockedAtomicModel()
  assert.throws(() => model.xadd(0, 1), /exclusive/)
  assert.equal(model.acquire(0), true)
  assert.equal(model.acquire(1), false)
  assert.throws(() => model.xadd(1, 1), /exclusive/)
  assert.equal(model.xadd(0, 1), 0)
  model.acquire(1)
  assert.equal(model.xadd(1, 1), 1)
  model.acquire(0)
  assert.equal(model.cmpxchg(0, 0, 8), false)
  assert.equal(model.old[0], 2)
  assert.equal(model.value, 2)
  assert.equal(model.zeroFlag[0], false)
  model.acquire(0)
  assert.equal(model.cmpxchg(0, 2, 8), true)
  assert.equal(model.value, 8)
})

test('MOESI forwards dirty data, invalidates false sharing, and writes back Owned eviction', () => {
  const model = new MoesiModel()
  model.read(0)
  assert.equal(model.caches[0].state, 'E')
  model.write(0, 'x', 1)
  assert.equal(model.read(1), 1)
  assert.equal(model.memory.x, 0)
  assert.deepEqual(model.caches.map((cache) => cache.state), ['O', 'S', 'I'])
  model.read(2)
  assert.equal(model.transfer, 'C0 -> C2')
  model.write(1, 'y', 2)
  assert.deepEqual(model.caches.map((cache) => cache.state), ['I', 'M', 'I'])
  assert.equal(model.read(2), 1)
  assert.equal(model.caches[1].state, 'O')
  model.evict(1)
  assert.deepEqual(model.memory, { x: 1, y: 2 })
  assert.equal(model.read(2, 'y'), 2)
})

test('MESIF keeps a clean forwarder and a writer invalidates all shared peers', () => {
  const model = new MesifModel()
  for (let core = 0; core < 3; core += 1) model.read(core)
  assert.deepEqual(model.caches.map((cache) => cache.state), ['F', 'S', 'S'])
  assert.equal(model.transfer, 'C0 -> C2')
  model.evict(0)
  assert.deepEqual(model.caches.map((cache) => cache.state), ['I', 'F', 'S'])
  model.write(2, 'x', 7)
  assert.deepEqual(model.caches.map((cache) => cache.state), ['I', 'I', 'M'])
  assert.equal(model.read(0), 7)
  assert.equal(model.memory.x, 7)
  assert.deepEqual(model.caches.map((cache) => cache.state), ['S', 'I', 'F'])
})

test('TLB hits avoid table reads and remapping requires completed translation maintenance', () => {
  const model = new TranslationModel()
  assert.equal(model.begin(), false)
  while (model.walking) model.walkNext()
  assert.equal(model.reads, 4)
  const first = model.physical
  assert.equal(first % 4096, model.va % 4096)
  assert.equal(model.begin(), true)
  assert.equal(model.reads, 4)
  model.breakMapping()
  assert.equal(model.tlb.size, 1)
  assert.throws(() => model.begin(), /quiesced/)
  assert.throws(() => model.tlbi(), /Publish/)
  assert.throws(() => model.makeMapping(0x90000), /break-before-make/)
  model.publishBreak()
  model.tlbi()
  assert.equal(model.tlb.size, 1)
  model.completeTlbi()
  assert.equal(model.tlb.size, 0)
  model.makeMapping(0x90000)
  assert.equal(model.begin(), false)
  while (model.walking) model.walkNext()
  assert.equal(model.reads, 8)
  assert.equal(model.physical, 0x90000 * 4096 + model.va % 4096)
  assert.notEqual(model.physical, first)
})

test('code maintenance synchronizes caches but each executing core still needs its own ISB', () => {
  const model = new InstructionSyncModel()
  model.write()
  assert.equal(model.execute(0), 1)
  assert.throws(() => model.icIvau(), /clean/)
  model.dcCvau()
  assert.equal(model.pou, 1)
  assert.throws(() => model.icIvau(), /clean/)
  model.dsb()
  model.icIvau()
  assert.throws(() => model.isb(0), /maintenance/)
  model.dsb()
  assert.deepEqual(model.instruction, [null, null])
  assert.equal(model.execute(0), 1)
  model.isb(0)
  assert.equal(model.execute(0), 2)
  assert.equal(model.execute(1), 1)
  model.isb(1)
  assert.equal(model.execute(1), 2)
})

test('Complex exposes twelve lessons directly, with reversible navigation and search destinations', () => {
  const hardware = new MenuNavigation().selectCategory('advanced-algorithms').selectAdvancedAlgorithmGroup('hardware')
  const complex = hardware.selectAdvancedAlgorithmGroup('hardware-complex')
  assert.deepEqual(complex.getAdvancedAlgorithmGroups(), [])
  assert.equal(complex.getHardwareAlgorithms().length, 12)
  assert.deepEqual(complex.getPath(), ['System Components Overview', 'Hardware', 'Complex'])
  assert.deepEqual(complex.back(), hardware)
  assert.equal(hardware.getHardwareAlgorithms().length, 0)
  const network = new MenuNavigation().selectCategory('advanced-algorithms').selectAdvancedAlgorithmGroup('network').selectAdvancedAlgorithmGroup('network-complex')
  assert.equal(network.getHardwareAlgorithms().length, 0)
  const index = new MenuSearchIndex(() => null)
  for (const choice of HardwareAlgorithmCatalog.choices) {
    const result = index.find('algorithms', choice.name).find((entry) => entry.hardwareAlgorithm === choice.kind)
    assert.ok(result, choice.name)
    assert.equal(result.context, 'System Components Overview / Hardware / Complex')
    assert.deepEqual(result.components, ['CPU', 'RAM', 'Bus'])
  }
  assert.ok(index.find('algorithms', 'Neoverse N1').some((entry) => entry.hardwareAlgorithm === 'lse-atomics'))
  assert.equal(index.find('structures', 'MFENCE').length, 0)
  assert.equal(index.find('algorithms', 'bounded independent scene snapshots').length, 0)
})
