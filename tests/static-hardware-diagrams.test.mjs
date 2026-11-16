import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GpuLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Gpu/GpuLayout.ts'
import { NetworkAdapterLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/NetworkAdapterLayout.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'
import { BusLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Bus/BusLayout.ts'
import { CpuLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Cpu/CpuLayout.ts'
import { RamLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ram/RamLayout.ts'
import { SsdLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ssd/SsdLayout.ts'
import { HddLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Hdd/HddLayout.ts'
import { HardwareDiagram } from '../src/visualization/HardwareDiagram.ts'
import { HardwareDiagramFrame } from '../src/visualization/HardwareDiagramFrame.ts'

test('hardware margins move paths, captions, and state together without changing source geometry', () => {
  const original = new HardwareDiagram(200, 100)
    .region('part', 'Part', 'device', 10, 10, 80, 60)
    .fixture('state', '', 'idle', 50, 50)
  original.paths.push({ id: 'line', d: 'M10 50H90', label: 'Link', highlighted: false, caption: { text: 'Link', x: 20, y: 40 } })
  const before = original.clone()
  const framed = HardwareDiagramFrame.create(original, 100, 50)
  assert.deepEqual(original, before)
  assert.equal(framed.width, 350)
  assert.equal(framed.regions[0].x, 110)
  assert.equal(framed.positions[0].x, 150)
  assert.equal(framed.paths[0].d, original.paths[0].d)
  assert.equal(framed.paths[0].translateX, 100)
  assert.equal(framed.paths[0].caption.x, 120)
})

for (const [layout, prefix, keys] of [
  [CpuLayout, 'cpu', ['memory', 'pcie', 'chipset', 'clock', 'reset', 'power']],
  [RamLayout, 'ram', ['host', 'dma', 'sideband', 'power']],
  [SsdLayout, 'ssd', ['host', 'power']],
  [HddLayout, 'hdd', ['host', 'power']],
  [GpuLayout, 'gpu', ['host', 'display', 'power']],
  [NetworkAdapterLayout, 'nic', ['host', 'network', 'power']],
]) {
  test(`${prefix} external interfaces keep their labels and connection directions`, () => {
    const scene = layout.create()
    const paths = new Map(scene.paths.map((path) => [path.id, path]))
    for (const key of keys) {
      const path = paths.get(`${prefix}-external-${key}`)
      assert.ok(path.caption.text.length > 0)
      assert.ok(path.caption.x >= 0 && path.caption.x < scene.width)
      assert.equal(path.directed, true)
      assert.equal(path.highlighted, false)
    }
    const power = paths.get(`${prefix}-external-power`)
    assert.ok(!power.dashed)
    assert.ok(!power.bidirectional)
    if (prefix === 'gpu') {
      for (const id of ['gpu-chip-power', 'gpu-memory-power']) assert.ok(!paths.has(id))
    }
    assert.ok(scene.paths.some((path) => path.translateX === layout.externalLeft), 'internal wires share the component offset')
    if (prefix === 'gpu' || prefix === 'nic') assert.equal(paths.get(`${prefix}-external-host`).caption.text, 'PCIe / DMA')
    if (prefix === 'cpu') {
      assert.ok(!paths.has('cpu-external-io'), 'PCIe and chipset link no longer share an ambiguous external line')
      assert.ok(!paths.has('cpu-external-dma'), 'DMA is not a separate physical channel')
      assert.notEqual(paths.get('cpu-external-pcie').d, paths.get('cpu-external-chipset').d)
      for (const key of ['clock', 'reset']) {
        assert.ok(!paths.get(`cpu-external-${key}`).bidirectional, `${key} is shown as an input`)
        assert.ok(!paths.get(`cpu-external-${key}`).dashed)
      }
      const regions = new Map(scene.regions.map((region) => [region.id, region]))
      for (const key of ['memory-controller', 'io-controller']) assert.equal(regions.get(`cpu-${key}`).parentId, 'cpu-die')
      assert.equal(regions.get('cpu-socket-clock-reset').parentId, 'cpu-socket')
      assert.match(regions.get('cpu-socket').label, /controllers are inside the CPU die/)
    }
    if (prefix === 'ram') {
      assert.ok(!scene.regions.some((region) => region.id === 'ram-motherboard'))
      const root = scene.regions.find((region) => region.id === 'ram-pcie-root')
      assert.equal(root.parentId, undefined, 'PCIe host context is outside the RAM module')
      assert.equal(paths.get('ram-external-dma').caption.text, 'PCIe / DMA')
      assert.match(paths.get('ram-dma-memory-controller').label, /controller.*DDR/)
      assert.equal(paths.get('ram-dma-memory-controller').bidirectional, true)
    }
  })
}

test('HDD data, control, and DC input routes terminate at their respective components', () => {
  const diagram = HddLayout.diagram()
  assert.ok(diagram.regions.every((region) => region.borderStyle === 'solid'))
  assert.ok(diagram.paths.every((path) => !path.dashed))
  const regions = new Map(diagram.regions.map((region) => [region.id, region]))
  const paths = new Map(diagram.paths.map((path) => [path.id, path]))
  const ends = (path) => {
    const tokens = path.d.match(/[MLHV]|-?\d+(?:\.\d+)?/g)
    const points = []
    let x = 0
    let y = 0
    for (let index = 0; index < tokens.length;) {
      const command = tokens[index++]
      if (command === 'M' || command === 'L') {
        x = Number(tokens[index++])
        y = Number(tokens[index++])
      } else if (command === 'H') x = Number(tokens[index++])
      else if (command === 'V') y = Number(tokens[index++])
      else assert.fail('Unsupported HDD signal route')
      points.push({ x: x + (path.translateX ?? 0), y })
    }
    return [points[0], points.at(-1)]
  }
  const touches = (point, id) => {
    const region = regions.get(`hdd-${id}`)
    const near = (a, b) => Math.abs(a - b) < 1e-8
    return ((near(point.x, region.x) || near(point.x, region.x + region.width)) && point.y >= region.y && point.y <= region.y + region.height)
      || ((near(point.y, region.y) || near(point.y, region.y + region.height)) && point.x >= region.x && point.x <= region.x + region.width)
  }
  for (const [id, from, to] of [
    ['hdd-storage-write-field', 'write-pole', 'magnetic-grains'],
    ['hdd-storage-read-field', 'magnetic-grains', 'read-sensor'],
    ['cache-ecc', 'cache', 'ecc'], ['ecc-write', 'ecc', 'write-channel'],
    ['write-preamp', 'write-channel', 'preamp'], ['preamp-read', 'preamp', 'read-channel'],
    ['read-ecc', 'read-channel', 'ecc'], ['ecc-cache', 'ecc', 'cache'],
    ['cache-host', 'cache', 'data-connector'], ['host-cache', 'data-connector', 'cache'],
    ['controller-servo', 'controller', 'servo-controller'], ['buffer-control', 'controller', 'cache'],
    ['controller-write', 'controller', 'write-channel'], ['controller-read', 'controller', 'read-channel'],
    ['controller-spindle', 'controller', 'spindle-driver'], ['servo-driver', 'servo-controller', 'vcm-driver'],
    ['driver-actuator', 'vcm-driver', 'actuator'],
  ]) {
    const path = paths.get(id)
    const [start, end] = ends(path)
    assert.ok(touches(start, from), `${id} starts at ${from}`)
    assert.ok(touches(end, to), `${id} ends at ${to}`)
    assert.equal(path.directed, true)
    assert.equal(path.bidirectional, false)
  }
  assert.ok(!paths.has('map-servo'), 'mapping remains a lookup rather than a mandatory servo control hop')
  for (const id of ['power-controller', 'power-cache', 'power-preamp', 'power-vcm', 'power-spindle']) assert.ok(!paths.has(id), 'internal power fan-out is omitted')
  const power = paths.get('hdd-external-power')
  const [powerStart, powerEnd] = ends(power)
  assert.equal(powerStart.x, 20)
  assert.ok(touches(powerEnd, 'power-connector'))
  assert.ok(!power.dashed)
  assert.equal(power.directed, true)
  assert.equal(power.bidirectional, undefined)
  const head = HddLayout.headPosition(1)
  const displayedHead = { x: head.x + HddLayout.mechanicalOffset + HddLayout.externalLeft, y: head.y }
  const [writeStart, writeEnd] = ends(paths.get('preamp-head'))
  const [readStart, readEnd] = ends(paths.get('head-preamp'))
  assert.ok(touches(writeStart, 'preamp'))
  assert.ok(touches(readEnd, 'preamp'))
  assert.deepEqual(writeEnd, displayedHead)
  assert.deepEqual(readStart, displayedHead)
})

test('HDD places PCB, mechanical assembly, and media in one compact row', () => {
  const scene = HddLayout.create()
  const regions = new Map(scene.regions.map((region) => [region.id, region]))
  const pcb = regions.get('hdd-electronics')
  const disk = regions.get('hdd-enclosure')
  const media = regions.get('hdd-storage-detail')
  assert.ok(!regions.has('hdd-motherboard'))
  assert.equal(pcb.label, 'PCB / logical functions, underside view')
  assert.equal(disk.label, 'HDD / mechanical assembly')
  const groups = [pcb, disk, media]
  for (let index = 0; index < groups.length; index += 1) {
    assert.ok(groups[index].x >= 0)
    assert.ok(groups[index].x + groups[index].width <= scene.width)
    assert.equal(groups[index].y, pcb.y)
    if (index > 0) assert.ok(groups[index - 1].x + groups[index - 1].width < groups[index].x)
  }
  for (const id of ['hdd-external-host', 'hdd-external-power']) {
    const path = scene.paths.find((candidate) => candidate.id === id)
    assert.match(path.d, /^M\d+ \d+H\d+$/)
    assert.ok(path.caption.x >= 0 && path.caption.x < pcb.x)
  }
})

test('motherboard shows physical PCB routing without protocol controller blocks', () => {
  const scene = BusLayout.create()
  const regions = new Map(scene.regions.map((region) => [region.id, region]))
  const paths = new Map(scene.paths.map((path) => [path.id, path]))
  const endpoints = [['cpu', 'CPU'], ['gpu', 'GPU'], ['ram', 'RAM'], ['hdd', 'HDD'], ['ssd', 'SSD'], ['network-adapter', 'Network Adapter']]
  const board = regions.get('bus-motherboard')
  const routing = regions.get('bus-fabric')
  assert.ok(scene.width <= 3000 && scene.height <= 1800, 'motherboard keeps its compact canvas')
  for (const [key, name] of endpoints) {
    const device = regions.get(`bus-${key}-device`)
    const connector = regions.get(`bus-${key}-port`)
    assert.equal(device.shortLabel, name)
    assert.equal(device.navigationTarget, `hardware-${key}`)
    assert.equal(device.parentId, undefined)
    assert.ok(device.width <= 240 && device.height <= 100)
    assert.ok(device.x + device.width <= board.x || device.x >= board.x + board.width)
    assert.equal(connector.parentId, board.id)
    assert.equal(connector.navigationTarget, undefined)
    assert.ok(connector.x + connector.width <= routing.x || connector.x >= routing.x + routing.width)
  }
  assert.equal(routing.shortLabel, 'PCB traces / signal routing')
  const standardBlock = regions.get('bus-usb-port')
  for (const id of ['bus-power-rails', 'bus-reset-circuit', 'bus-pch', 'bus-flash', 'bus-rtc']) {
    assert.equal(regions.get(id).width, standardBlock.width)
    assert.equal(regions.get(id).height, standardBlock.height)
  }
  assert.equal(paths.get('bus-chipset-uplink').caption, undefined)
  assert.ok(paths.get('bus-power-dimm').crossingGaps.length > 0, 'crossing traces remain visually separate')
  assert.equal(regions.get('bus-dc-source').navigationTarget, undefined, 'PSU has no detail diagram')
  assert.match(routing.label, /physical copper connections.*not a chip or controller/)
  assert.ok(!scene.regions.some((region) => region.parentId === routing.id), 'routing area contains traces, not processing blocks')
  for (const id of ['bus-cpu-context', 'bus-cpu-protocol', 'bus-ram-protocol', 'bus-cpu-chipset', 'bus-cpu-cores', 'bus-coherence', 'bus-switch', 'bus-buffers', 'bus-arbiter']) {
    assert.ok(!regions.has(id), `${id} is absent from the motherboard map`)
  }
  assert.ok(!scene.regions.some((region) => region.id.startsWith('bus-detail-')))
  assert.ok(!scene.paths.some((path) => path.id.startsWith('bus-detail-') || path.id.startsWith('bus-interface-')))
  assert.ok(!scene.regions.some((region) => /optional/i.test(region.label)))
  const lanes = new Set()
  for (const key of ['gpu', 'ssd', 'network-adapter']) {
    const direct = paths.get(`bus-${key}-direct`)
    assert.equal(direct.bidirectional, true)
    assert.ok(!direct.dashed)
    assert.match(direct.label, /point-to-point/)
    lanes.add(direct.d)
    assert.equal(regions.get(`bus-cpu-${key}-contacts`).parentId, 'bus-cpu-port')
  }
  assert.equal(lanes.size, 3)
  assert.match(paths.get('bus-chipset-uplink').label, /DMI.*CPU socket.*PCH/)
  assert.match(paths.get('bus-ram-port-data').label, /DDR.*bypassing PCIe and PCH/)
  assert.match(regions.get('bus-clock-reset').shortLabel, /Clock generator/)
  assert.match(regions.get('bus-reset-circuit').shortLabel, /Reset circuitry/)
  assert.equal(regions.get('bus-clock-reset').role, 'device')
  assert.equal(regions.get('bus-reset-circuit').role, 'device')
})

test('every motherboard arrow touches component boundaries, including DC input and load rails', () => {
  const scene = BusLayout.create()
  const regions = new Map(scene.regions.map((region) => [region.id, region]))
  const paths = new Map(scene.paths.map((path) => [path.id, path]))
  const points = (path) => {
    const result = []
    const tokens = path.d.match(/[MHV]|-?\d+(?:\.\d+)?/g)
    let x = 0
    let y = 0
    for (let index = 0; index < tokens.length;) {
      const command = tokens[index++]
      if (command === 'M') {
        x = Number(tokens[index++])
        y = Number(tokens[index++])
      }
      else if (command === 'H') x = Number(tokens[index++])
      else if (command === 'V') y = Number(tokens[index++])
      else assert.fail('Motherboard routes must stay orthogonal')
      result.push({ x, y })
    }
    return result
  }
  const touches = (point, region) => {
    const near = (a, b) => Math.abs(a - b) < 0.000001
    return ((near(point.x, region.x) || near(point.x, region.x + region.width)) && point.y >= region.y && point.y <= region.y + region.height)
      || ((near(point.y, region.y) || near(point.y, region.y + region.height)) && point.x >= region.x && point.x <= region.x + region.width)
  }
  for (const path of scene.paths) {
    const route = points(path)
    assert.ok(route.length > 1, `${path.id} has a visible route`)
    assert.ok(!path.dashed, `${path.id} uses a solid line`)
    for (const point of [route[0], route.at(-1)]) {
      assert.ok(scene.regions.some((region) => touches(point, region)), `${path.id} cannot end in empty space`)
    }
  }
  const connections = [
    ['bus-gpu-direct', 'bus-cpu-gpu-contacts', 'bus-gpu-link'],
    ['bus-ssd-direct', 'bus-cpu-ssd-contacts', 'bus-ssd-link'],
    ['bus-network-adapter-direct', 'bus-cpu-network-adapter-contacts', 'bus-network-adapter-link'],
    ['bus-ram-port-data', 'bus-cpu-ddr-contacts', 'bus-ram-link'],
    ['bus-chipset-uplink', 'bus-cpu-chipset-contacts', 'bus-pch'],
    ['bus-switch-hdd', 'bus-pch', 'bus-hdd-link'],
    ['bus-pch-usb', 'bus-pch', 'bus-usb-port'],
    ['bus-pch-flash', 'bus-pch', 'bus-flash'],
  ]
  for (const [id, source, destination] of connections) {
    const path = paths.get(id)
    const route = points(path)
    assert.ok(touches(route[0], regions.get(source)), `${id} starts at its physical source`)
    assert.ok(touches(route.at(-1), regions.get(destination)), `${id} reaches its physical destination`)
    assert.equal(path.directed, true)
    assert.equal(path.bidirectional, true)
    assert.ok(!path.dashed, `${id} is a physical data trace`)
  }
  for (const [source, routes] of [
    ['bus-clock-reset', [['bus-cpu-clock', 'bus-cpu-control-contacts'], ['bus-requester-clock', 'bus-gpu-port'], ['bus-pch-clock', 'bus-pch'], ['bus-ssd-clock', 'bus-ssd-link'], ['bus-network-adapter-clock', 'bus-network-adapter-link']]],
    ['bus-reset-circuit', [['bus-cpu-reset', 'bus-cpu-control-contacts'], ['bus-gpu-reset', 'bus-gpu-port'], ['bus-pch-reset', 'bus-pch'], ['bus-ssd-reset', 'bus-ssd-link'], ['bus-network-adapter-reset', 'bus-network-adapter-link']]],
  ]) {
    for (const [id, destination] of routes) {
      const path = paths.get(id)
      const route = points(path)
      assert.ok(touches(route[0], regions.get(source)), `${id} starts at board support circuitry`)
      assert.ok(touches(route.at(-1), regions.get(destination)), `${id} reaches the consumer`)
      assert.equal(path.directed, true)
      assert.equal(path.bidirectional, false)
      assert.ok(!path.dashed)
    }
  }
  const supplies = [
    ['bus-dc-input', 'bus-dc-source', 'bus-power-connectors'],
    ['bus-power-dimm', 'bus-power-rails', 'bus-ram-port'],
    ['bus-power-pch', 'bus-power-rails', 'bus-pch'],
    ['bus-power-m2', 'bus-power-rails', 'bus-ssd-port'],
    ['bus-power-slots', 'bus-power-rails', 'bus-gpu-port'],
    ['bus-power-nic', 'bus-power-rails', 'bus-network-adapter-port'],
    ['bus-power-cpu', 'bus-power-rails', 'bus-cpu-power-contacts'],
    ['bus-power-clock', 'bus-power-rails', 'bus-clock-reset'],
    ['bus-power-reset', 'bus-power-rails', 'bus-reset-circuit'],
  ]
  for (const [id, source, destination] of supplies) {
    const path = paths.get(id)
    const route = points(path)
    assert.ok(touches(route[0], regions.get(source)), `${id} starts at its power source`)
    assert.ok(touches(route.at(-1), regions.get(destination)), `${id} reaches its load`)
    assert.ok(!path.dashed)
    assert.equal(path.bidirectional, false)
    assert.equal(path.stroke, '#b58a45')
  }
  for (const id of ['bus-dc-input', 'bus-gpu-direct', 'bus-ssd-direct', 'bus-network-adapter-direct']) assert.equal(paths.get(id).caption, undefined)
  assert.equal(regions.get('bus-rtc').borderStyle, 'solid')
  assert.match(regions.get('bus-power-connectors').label, /no AC mains/)
  const uplink = points(paths.get('bus-chipset-uplink'))
  assert.ok(touches(uplink[0], regions.get('bus-cpu-chipset-contacts')))
  assert.ok(touches(uplink.at(-1), regions.get('bus-pch')))
})

for (const [level, layout] of [['cpu', CpuLayout], ['ram', RamLayout], ['gpu', GpuLayout], ['network-adapter', NetworkAdapterLayout], ['bus', BusLayout]]) {
  test(`${level} static map keeps components inside their logical boundaries`, () => {
    const scene = layout.create()
    const regions = new Map(scene.regions.map((region) => [region.id, region]))
    assert.equal(regions.size, scene.regions.length)
    assert.equal(new Set(scene.paths.map((path) => path.id)).size, scene.paths.length)
    for (const region of regions.values()) {
      const parent = region.parentId ? regions.get(region.parentId) : { x: 0, y: 0, width: scene.width, height: scene.height }
      assert.ok(parent, `${region.id} has a parent`)
      assert.ok(region.x >= parent.x && region.y >= parent.y, `${region.id} starts inside its parent`)
      assert.ok(region.x + region.width <= parent.x + parent.width, `${region.id} fits horizontally`)
      assert.ok(region.y + region.height <= parent.y + parent.height, `${region.id} fits vertically`)
    }
    const preview = SystemOverviewLayout.create(level, SystemOverviewLayout.create('hardware', null))
    const layer = preview.layers.find((candidate) => candidate.id === `${level}-components`)
    assert.deepEqual(layer.scene, scene)
    assert.equal(preview.countLabel, scene.countLabel)
    assert.ok(preview.camera.to.width <= layer.reveal.endWidth, 'focused map is fully revealed')
    const other = level === 'gpu' ? 'network-adapter' : 'gpu'
    const next = SystemOverviewLayout.create(other, preview)
    assert.deepEqual(next.camera.from, preview.camera.to)
    assert.deepEqual(next.layers.filter((candidate) => candidate.id.endsWith('-components')).map((candidate) => candidate.id), [`${other}-components`])
  })
}
