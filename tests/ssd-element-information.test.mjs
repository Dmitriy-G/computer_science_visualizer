import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HardwareElementCatalog } from '../src/visualization/HardwareElementCatalog.ts'
import { SceneRegionInteraction } from '../src/visualization/SceneRegionInteraction.ts'
import { SsdLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ssd/SsdLayout.ts'
import { SsdAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ssd/SsdAlgorithmCatalog.ts'
import { HardwareSnapshot } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareSnapshot.ts'

test('every SSD region has independent information, with images for the board, host connector, DRAM, and NAND', () => {
  const scene = SsdLayout.create()
  const photos = new Map([
    ['ssd-pcb', '/hardware/ssd/annotated-m2-nvme-ssd.svg'],
    ['ssd-connectors', '/hardware/ssd/annotated-m2-edge-connector.svg'],
    ['ssd-dram', '/hardware/ssd/dram.svg'],
    ['ssd-nand', '/hardware/ssd/nand.svg'],
  ])
  for (const region of scene.regions) {
    assert.equal(region.interactive, true, region.id)
    const information = HardwareElementCatalog.get(region.id)
    assert.ok(information, region.id)
    for (const field of ['overview', 'problem', 'characteristicNote']) assert.ok(information[field].trim(), `${region.id}: ${field}`)
    assert.ok(information.characteristics.length >= 2, region.id)
    assert.ok(information.documentation.length > 0, region.id)
    for (const document of information.documentation) assert.equal(new URL(document.url).protocol, 'https:')
    if (photos.has(region.id)) {
      assert.equal(information.photos.length, 1)
      assert.equal(information.photos[0].src, photos.get(region.id))
    } else assert.deepEqual(information.photos, [], region.id)
  }
  const regions = new Set(scene.regions.map((region) => region.id))
  for (const path of scene.paths) {
    assert.ok(path.fromRegionId || path.toRegionId, `${path.id}: interaction endpoints`)
    for (const id of [path.fromRegionId, path.toRegionId]) {
      if (id !== undefined) assert.ok(regions.has(id), `${path.id}: ${id}`)
    }
  }
  assert.equal(HardwareElementCatalog.get(null), null)
  assert.equal(HardwareElementCatalog.get('unknown-ssd-component'), null)
  assert.ok(HardwareElementCatalog.get('nic-controller'))
  assert.ok(HardwareElementCatalog.get('nic-network-connection'))
})

test('SSD selections highlight nested boundary connections without changing the scene', () => {
  const scene = SsdLayout.create()
  const before = structuredClone(scene)
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'ssd-ecc-encode')].sort(), [
    'ssd-buffer-encode', 'ssd-encode-nand',
  ])
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'ssd-controller')].sort(), [
    'ssd-channel-0', 'ssd-controller-dram', 'ssd-firmware-load', 'ssd-host-ftl', 'ssd-interface-dma',
  ])
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'ssd-nand-cell')].sort(), [
    'ssd-nand-bitline', 'ssd-nand-source-line', 'ssd-nand-wordline', 'ssd-page-wordline-view',
  ])
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'ssd-pcb')].sort(), [
    'ssd-external-host', 'ssd-external-power',
  ])
  assert.deepEqual(scene, before)
})

test('SSD page playback retains component interactions and information at every step', () => {
  const scene = SsdLayout.create()
  for (const choice of SsdAlgorithmCatalog.choices) {
    const plan = SsdAlgorithmCatalog.definition(choice.kind).create(new HardwareSnapshot())
    for (const step of plan.steps) {
      const before = structuredClone(step.scene)
      for (const region of scene.regions) {
        const current = step.scene.regions.find((candidate) => candidate.id === region.id)
        assert.equal(current.interactive, true, `${choice.kind}: ${region.id}`)
        assert.ok(HardwareElementCatalog.get(current.id))
      }
      for (const path of scene.paths) {
        const current = step.scene.paths.find((candidate) => candidate.id === path.id)
        assert.equal(current.fromRegionId, path.fromRegionId, path.id)
        assert.equal(current.toRegionId, path.toRegionId, path.id)
      }
      SceneRegionInteraction.boundaryPaths(step.scene, 'ssd-controller')
      assert.deepEqual(step.scene, before, 'inspecting a component preserves playback state')
    }
  }
})
