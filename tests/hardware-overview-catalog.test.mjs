import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HardwareOverviewCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareOverviewCatalog.ts'
import { CpuAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Cpu/CpuAlgorithmCatalog.ts'
import { RamAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ram/RamAlgorithmCatalog.ts'
import { HddAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Hdd/HddAlgorithmCatalog.ts'
import { SsdAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ssd/SsdAlgorithmCatalog.ts'
import { GpuAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Gpu/GpuAlgorithmCatalog.ts'
import { NetworkAdapterAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/NetworkAdapterAlgorithmCatalog.ts'

test('scoped hardware catalogs own disjoint lessons and shared routing delegates to each owner', () => {
  const owners = [
    ['hardware-cpu', CpuAlgorithmCatalog, ['cpu-non-atomic-increment', 'cpu-atomic-load']],
    ['hardware-ram', RamAlgorithmCatalog, ['ram-write-bit', 'ram-read-bit']],
    ['hardware-hdd', HddAlgorithmCatalog, ['hdd-sector']],
    ['hardware-ssd', SsdAlgorithmCatalog, ['nand-cell', 'ssd-ftl', 'ssd-garbage-collection', 'ssd-wear-leveling']],
    ['hardware-gpu', GpuAlgorithmCatalog, ['gpu-frame-rendering', 'gpu-hashcat-iteration']],
    ['hardware-network-adapter', NetworkAdapterAlgorithmCatalog, ['nic-server-to-network', 'nic-network-to-server']],
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
