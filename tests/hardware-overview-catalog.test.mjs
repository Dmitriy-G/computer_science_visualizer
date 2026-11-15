import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HardwareOverviewCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareOverviewCatalog.ts'
import { CpuAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Cpu/CpuAlgorithmCatalog.ts'
import { RamAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ram/RamAlgorithmCatalog.ts'
import { HddAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Hdd/HddAlgorithmCatalog.ts'
import { SsdAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ssd/SsdAlgorithmCatalog.ts'
import { GpuAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Gpu/GpuAlgorithmCatalog.ts'
import { NetworkAdapterAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/NetworkAdapterAlgorithmCatalog.ts'
import { BusAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Bus/BusAlgorithmCatalog.ts'
import { MenuSearchIndex } from '../src/components/MainMenu/Search/MenuSearchIndex.ts'

test('scoped hardware catalogs own disjoint lessons and shared routing delegates to each owner', () => {
  const owners = [
    ['hardware-cpu', CpuAlgorithmCatalog, ['cpu-non-atomic-increment', 'cpu-atomic-load']],
    ['hardware-ram', RamAlgorithmCatalog, ['ram-write-bit', 'ram-read-bit']],
    ['hardware-hdd', HddAlgorithmCatalog, ['hdd-write-sector', 'hdd-read-sector']],
    ['hardware-ssd', SsdAlgorithmCatalog, ['ssd-write-page', 'ssd-read-page']],
    ['hardware-gpu', GpuAlgorithmCatalog, ['gpu-frame-rendering', 'gpu-hashcat-iteration']],
    ['hardware-network-adapter', NetworkAdapterAlgorithmCatalog, ['nic-server-to-network', 'nic-network-to-server']],
    ['hardware-bus', BusAlgorithmCatalog, []],
  ]
  const seen = new Set()
  for (const [group, owner, expected] of owners) {
    assert.deepEqual(owner.choices.map((choice) => choice.kind), expected)
    assert.equal(HardwareOverviewCatalog.forGroup(group), owner.choices)
    for (const choice of owner.choices) {
      assert.ok(!seen.has(choice.kind))
      seen.add(choice.kind)
      assert.equal(HardwareOverviewCatalog.groupFor(choice.kind), group)
      assert.equal(HardwareOverviewCatalog.definition(choice.kind).constructor, owner.definition(choice.kind).constructor)
      assert.deepEqual(HardwareOverviewCatalog.describeOverview(choice.kind), owner.describeOverview(choice.kind))
      assert.deepEqual(HardwareOverviewCatalog.describe(choice.kind), owner.describe(choice.kind))
    }
  }
  assert.deepEqual(new Set(HardwareOverviewCatalog.choices.map((choice) => choice.kind)), seen)
})

test('motherboard exposes no overviews and rejects its removed lesson', () => {
  assert.deepEqual(HardwareOverviewCatalog.forGroup('hardware-bus'), [])
  assert.ok(!HardwareOverviewCatalog.choices.some((choice) => choice.kind === 'bus-network-byte-to-ssd'))
  assert.throws(() => HardwareOverviewCatalog.definition('bus-network-byte-to-ssd'), /Unknown hardware component overview/)
})

test('HDD offers separate write/read lessons and rejects its removed combined sector lesson', () => {
  assert.deepEqual(HardwareOverviewCatalog.forGroup('hardware-hdd').map((choice) => choice.kind), ['hdd-write-sector', 'hdd-read-sector'])
  assert.ok(!HardwareOverviewCatalog.choices.some((choice) => choice.kind === 'hdd-sector'))
  for (const method of ['definition', 'describeOverview', 'describe', 'groupFor']) {
    assert.throws(() => HardwareOverviewCatalog[method]('hdd-sector'), /Unknown hardware component overview/)
  }
  const index = new MenuSearchIndex(() => null)
  for (const choice of HddAlgorithmCatalog.choices) {
    const results = index.find('algorithms', choice.name)
    assert.ok(results.some((result) => result.componentAlgorithm === choice.kind && result.context === 'System Components Overview / Hardware Fundamental'))
    assert.ok(!results.some((result) => result.componentAlgorithm === 'hdd-sector'))
  }
})

test('SSD offers page write/read and rejects its removed legacy lessons', () => {
  assert.deepEqual(HardwareOverviewCatalog.forGroup('hardware-ssd').map((choice) => choice.kind), ['ssd-write-page', 'ssd-read-page'])
  const index = new MenuSearchIndex(() => null)
  for (const choice of SsdAlgorithmCatalog.choices) {
    assert.ok(index.find('algorithms', choice.name).some((result) => result.componentAlgorithm === choice.kind && result.context === 'System Components Overview / Hardware Fundamental'))
  }
  for (const kind of ['nand-cell', 'ssd-ftl', 'ssd-garbage-collection', 'ssd-wear-leveling']) {
    assert.ok(!HardwareOverviewCatalog.choices.some((choice) => choice.kind === kind))
    assert.throws(() => HardwareOverviewCatalog.definition(kind), /Unknown hardware component overview/)
    assert.throws(() => HardwareOverviewCatalog.describeOverview(kind), /Unknown hardware component overview/)
    assert.throws(() => HardwareOverviewCatalog.describe(kind), /Unknown hardware component overview/)
    assert.throws(() => HardwareOverviewCatalog.groupFor(kind), /Unknown hardware component overview/)
  }
})
