import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HardwareElementCatalog } from '../src/visualization/HardwareElementCatalog.ts'
import { SceneRegionInteraction } from '../src/visualization/SceneRegionInteraction.ts'
import { HddLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Hdd/HddLayout.ts'
import { HddAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Hdd/HddAlgorithmCatalog.ts'
import { HardwareSnapshot } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareSnapshot.ts'

test('every HDD block has authored information, with supplied images only for matching components', () => {
  const scene = HddLayout.create()
  const photos = new Map([
    ['hdd-electronics', ['/hardware/hdd/pcb.svg']],
    ['hdd-enclosure', ['/hardware/hdd/mechanical-assembly.svg']],
    ['hdd-data-connector', ['/hardware/hdd/sata-connector.svg']],
    ['hdd-power-connector', ['/hardware/hdd/sata-connector.svg', '/hardware/hdd/power-circuitry.svg']],
    ['hdd-actuator', ['/hardware/hdd/voice-coil.svg']],
    ['hdd-preamp', ['/hardware/hdd/head-preamp.svg']],
    ['hdd-filter', ['/hardware/hdd/air-filter.svg']],
    ['hdd-head', ['/hardware/hdd/read-write-head.svg']],
    ['hdd-storage-head', ['/hardware/hdd/read-write-head.svg']],
    ['hdd-cache', ['/hardware/hdd/dram-cache.svg']],
    ['hdd-controller', ['/hardware/hdd/controller.svg']],
    ['hdd-motor-driver', ['/hardware/hdd/motor-driver.svg']],
    ['hdd-spindle', ['/hardware/hdd/spindle-motor.svg']],
    ['hdd-write-pole', ['/hardware/hdd/write-pole.svg']],
    ['hdd-read-sensor', ['/hardware/hdd/mr-reader-context.svg']],
    ['hdd-recording-film', ['/hardware/hdd/magnetic-film.svg']],
    ['hdd-recorded-bit-area', ['/hardware/hdd/stored-magnetic-patterns.svg']],
    ['hdd-magnetic-grains', ['/hardware/hdd/magnetic-grains.svg']],
    ['hdd-arm', ['/hardware/hdd/actuator-arm-annotated.svg']],
    ['hdd-pivot', ['/hardware/hdd/pivot-annotated.svg']],
    ['hdd-servo-controller', ['/hardware/hdd/servo-controller-annotated.svg']],
  ])
  const regions = new Set(scene.regions.map((region) => region.id))
  assert.equal(regions.size, scene.regions.length)
  for (const region of scene.regions) {
    assert.equal(region.interactive, true, region.id)
    const information = HardwareElementCatalog.get(region.id)
    assert.ok(information, region.id)
    if (photos.has(region.id)) {
      assert.deepEqual(information.photos.map((photo) => photo.src), photos.get(region.id), region.id)
    } else assert.deepEqual(information.photos, [], region.id)
    for (const field of ['overview', 'problem', 'characteristicNote']) assert.ok(information[field].trim(), `${region.id}: ${field}`)
    assert.ok(information.characteristics.length >= 2, region.id)
    assert.ok(information.documentation.length > 0, region.id)
    for (const document of information.documentation) assert.equal(new URL(document.url).protocol, 'https:')
  }
  for (const path of scene.paths) {
    if (path.directed || path.bidirectional) assert.ok(path.fromRegionId || path.toRegionId, `${path.id}: endpoints`)
    for (const id of [path.fromRegionId, path.toRegionId]) {
      if (id !== undefined) assert.ok(regions.has(id), `${path.id}: ${id}`)
    }
  }
  assert.equal(HardwareElementCatalog.get('unknown-hdd-component'), null)
  assert.equal(HardwareElementCatalog.get(null), null)
  assert.ok(HardwareElementCatalog.get('ssd-controller'))
  assert.ok(HardwareElementCatalog.get('nic-controller'))
})

test('HDD selections highlight only connections across the selected subtree boundary', () => {
  const scene = HddLayout.create()
  const before = structuredClone(scene)
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'hdd-ecc')].sort(), [
    'cache-ecc', 'ecc-cache', 'ecc-write', 'read-ecc',
  ])
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'hdd-motor-driver')].sort(), [
    'controller-spindle', 'driver-actuator', 'driver-spindle', 'power-motor-drivers', 'servo-driver',
  ])
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'hdd-storage-head')].sort(), [
    'hdd-storage-read-field', 'hdd-storage-write-field',
  ])
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'hdd-head')].sort(), [
    'head-preamp', 'preamp-head',
  ])
  assert.deepEqual(scene, before)
})

test('HDD playback retains popups and moves the head hit target with the mechanism', () => {
  const common = HddLayout.create()
  for (const choice of HddAlgorithmCatalog.choices) {
    const plan = HddAlgorithmCatalog.definition(choice.kind).create(new HardwareSnapshot())
    const positions = new Set()
    for (const step of plan.steps) {
      const before = structuredClone(step.scene)
      for (const region of common.regions) {
        const current = step.scene.regions.find((candidate) => candidate.id === region.id)
        assert.equal(current.interactive, true, `${choice.kind}: ${region.id}`)
        assert.ok(HardwareElementCatalog.get(current.id))
      }
      for (const path of common.paths) {
        const current = step.scene.paths.find((candidate) => candidate.id === path.id)
        assert.equal(current.fromRegionId, path.fromRegionId, path.id)
        assert.equal(current.toRegionId, path.toRegionId, path.id)
      }
      const target = step.scene.regions.find((region) => region.id === 'hdd-head')
      const shape = step.scene.paths.find((path) => path.id === 'head-shape')
      const [x, y] = shape.d.match(/-?\d+(?:\.\d+)?/g).slice(0, 2).map(Number)
      const displayedX = x + (shape.translateX ?? 0)
      assert.ok(displayedX >= target.x && displayedX <= target.x + target.width, step.title)
      assert.ok(y >= target.y && y <= target.y + target.height, step.title)
      assert.equal(target.interactionOnly, true)
      positions.add(`${target.x},${target.y}`)
      SceneRegionInteraction.boundaryPaths(step.scene, 'hdd-head')
      assert.deepEqual(step.scene, before, 'inspecting a component preserves playback')
    }
    assert.ok(positions.size > 1, `${choice.kind}: head target follows seeking`)
  }
})
