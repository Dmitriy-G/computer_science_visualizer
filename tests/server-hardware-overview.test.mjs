import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ServerHardwareLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/ServerHardwareLayout.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'

function points(path) {
  const tokens = path.d.match(/[MHV]|-?\d+(?:\.\d+)?/g)
  const result = []
  let x = 0
  let y = 0
  for (let index = 0; index < tokens.length;) {
    const command = tokens[index++]
    if (command === 'M') {
      x = Number(tokens[index++])
      y = Number(tokens[index++])
    } else if (command === 'H') x = Number(tokens[index++])
    else if (command === 'V') y = Number(tokens[index++])
    else assert.fail('Server connection must stay orthogonal')
    result.push({ x, y })
  }
  return result
}

function touches(point, region) {
  const near = (a, b) => Math.abs(a - b) < 0.000001
  return ((near(point.x, region.x) || near(point.x, region.x + region.width)) && point.y >= region.y && point.y <= region.y + region.height)
    || ((near(point.y, region.y) || near(point.y, region.y + region.height)) && point.x >= region.x && point.x <= region.x + region.width)
}

function intersects(first, second) {
  const a = points(first)
  const b = points(second)
  for (let i = 1; i < a.length; i++) {
    for (let j = 1; j < b.length; j++) {
      const overlapX = Math.max(Math.min(a[i - 1].x, a[i].x), Math.min(b[j - 1].x, b[j].x)) <= Math.min(Math.max(a[i - 1].x, a[i].x), Math.max(b[j - 1].x, b[j].x))
      const overlapY = Math.max(Math.min(a[i - 1].y, a[i].y), Math.min(b[j - 1].y, b[j].y)) <= Math.min(Math.max(a[i - 1].y, a[i].y), Math.max(b[j - 1].y, b[j].y))
      if (overlapX && overlapY) return true
    }
  }
  return false
}

test('server components are independent of the motherboard physical platform', () => {
  const scene = ServerHardwareLayout.create()
  const regions = new Map(scene.regions.map((region) => [region.id, region]))
  assert.equal(regions.size, scene.regions.length)
  const board = regions.get('motherboard')
  for (const id of ['motherboard', 'cpu', 'ram', 'gpu', 'network-adapter', 'psu', 'hdd', 'ssd']) {
    const region = regions.get(id)
    assert.equal(region.parentId, 'server-chassis')
    if (id !== 'motherboard') assert.ok(region.x + region.width <= board.x || region.x >= board.x + board.width || region.y + region.height <= board.y || region.y >= board.y + board.height, id + ' stays outside motherboard')
  }
  const connectors = ['cpu-socket', 'dimm-sockets', 'gpu-slot', 'nic-slot', 'nvme-connector', 'sata-ports', 'host-usb-ports']
  for (const id of connectors) {
    assert.equal(regions.get(id).parentId, 'motherboard')
    assert.equal(regions.get(id).role, 'interconnect')
    assert.equal(regions.get(id).width, regions.get('sata-ports').width)
    assert.equal(regions.get(id).height, regions.get('sata-ports').height)
  }
  assert.deepEqual(scene.regions.filter((region) => region.parentId === 'motherboard').map((region) => region.id).sort(), connectors.slice().sort())
  for (const id of ['chipset-pch', 'bmc', 'firmware-flash']) assert.ok(!regions.has(id), id + ' is omitted from the main map')
  assert.equal(scene.count, scene.regions.length - 1)
  assert.equal(regions.get('ssd').shortLabel, 'NVMe SSD')
  for (const id of ['sata-ssd', 'raid-hba', 'hba-slot']) assert.ok(!regions.has(id))
  for (const [left, right] of [['cpu', 'ram'], ['gpu', 'hdd'], ['psu', 'network-adapter']]) {
    assert.equal(regions.get(left).y, regions.get(right).y, left + ' aligns with ' + right)
  }
  for (const [ids, side] of [[['cpu', 'gpu', 'psu'], 'left'], [['ram', 'ssd', 'hdd', 'network-adapter'], 'right']]) {
    let previousBottom = -Infinity
    for (const id of ids) {
      const region = regions.get(id)
      assert.equal(region.width, regions.get('hdd').width)
      assert.equal(region.height, regions.get('hdd').height)
      assert.ok(side === 'left' ? region.x + region.width < board.x : region.x > board.x + board.width)
      assert.ok(region.y > previousBottom)
      previousBottom = region.y + region.height
    }
  }
  assert.ok(!regions.has('bus'), 'communication links are not a shared interconnect block')
  assert.ok(!regions.has('ssd-nvme') && !regions.has('ssd-sata-sas'), 'drives are separate devices, not nested interfaces')
  assert.ok(!regions.has('usb-management-ports'))
  for (const region of regions.values()) {
    const parent = region.parentId ? regions.get(region.parentId) : { x: 0, y: 0, width: scene.width, height: scene.height }
    assert.ok(region.x >= parent.x && region.y >= parent.y, region.id + ' starts inside parent')
    assert.ok(region.x + region.width <= parent.x + parent.width, region.id + ' fits horizontally')
    assert.ok(region.y + region.height <= parent.y + parent.height, region.id + ' fits vertically')
    for (const other of regions.values()) {
      if (region.id === other.id || region.parentId !== other.parentId) continue
      assert.ok(region.x + region.width <= other.x || other.x + other.width <= region.x || region.y + region.height <= other.y || other.y + other.height <= region.y, region.id + ' and ' + other.id + ' do not overlap')
    }
  }
  assert.equal(regions.get('motherboard').navigationTarget, 'hardware-bus')
  assert.ok(!regions.has('management-lan-port'))
})

test('main server links have physical endpoints and distinguish standards from power', () => {
  const scene = ServerHardwareLayout.create()
  const regions = new Map(scene.regions.map((region) => [region.id, region]))
  const paths = new Map(scene.paths.map((path) => [path.id, path]))
  assert.equal(paths.size, scene.paths.length)
  const links = [
    ['cpu-socket-attachment', 'cpu', 'cpu-socket'],
    ['dimm-ram', 'dimm-sockets', 'ram'],
    ['gpu-slot-card', 'gpu-slot', 'gpu'],
    ['nic-slot-card', 'nic-slot', 'network-adapter'],
    ['nvme-ssd', 'nvme-connector', 'ssd'],
    ['pch-sata-hdd', 'sata-ports', 'hdd'],
  ]
  for (const [id, source, destination] of links) {
    const path = paths.get(id)
    const route = points(path)
    assert.ok(touches(route[0], regions.get(source)), id + ' starts on its component')
    assert.ok(touches(route.at(-1), regions.get(destination)), id + ' reaches its component')
    assert.equal(path.bidirectional, true)
    assert.ok(!path.dashed, id + ' carries data on a solid line')
  }
  for (const [id, target] of [['psu-motherboard', 'motherboard'], ['psu-gpu', 'gpu'], ['psu-hdd', 'hdd'], ['psu-ssd', 'ssd']]) {
    const path = paths.get(id)
    const route = points(path)
    assert.ok(touches(route[0], regions.get('psu')))
    assert.ok(touches(route.at(-1), regions.get(target)))
    assert.ok(!path.dashed)
    assert.equal(path.bidirectional, false)
    assert.match(path.label, /power/i)
  }
  for (const id of ['cpu-ram', 'cpu-gpu', 'cpu-nic', 'cpu-nvme', 'cpu-hba']) assert.ok(!paths.has(id), id + ' belongs only in the detailed motherboard map')
  for (const id of ['cpu-pch', 'pch-sata', 'pch-usb', 'pch-firmware', 'pch-bmc', 'bmc-management-lan', 'psu-bmc-standby']) assert.ok(!paths.has(id), id + ' must not point to an omitted component')
  assert.match(paths.get('nvme-ssd').label, /Direct PCIe.*bypassing/)
  const gpuPower = points(paths.get('psu-gpu'))
  assert.equal(gpuPower.length, 2)
  assert.equal(gpuPower[0].x, gpuPower[1].x)
})

test('native SATA and the single NVMe SSD cable stay visually separate', () => {
  const scene = ServerHardwareLayout.create()
  const paths = new Map(scene.paths.map((path) => [path.id, path]))
  const cables = ['pch-sata-hdd', 'nvme-ssd']
  for (let i = 0; i < cables.length; i++) {
    const path = paths.get(cables[i])
    for (let j = i + 1; j < cables.length; j++) {
      const other = paths.get(cables[j])
      assert.ok(!intersects(path, other), path.id + ' must not cross or merge with ' + other.id)
      assert.notEqual(path.stroke, other.stroke)
    }
  }
  for (const [device, cable] of [['ssd', 'nvme-ssd'], ['hdd', 'pch-sata-hdd']]) {
    const region = scene.regions.find((candidate) => candidate.id === device)
    const connections = scene.paths.filter((path) => {
      if (path.stroke === '#b58a45') return false
      const route = points(path)
      return touches(route[0], region) || touches(route.at(-1), region)
    })
    assert.deepEqual(connections.map((path) => path.id), [cable], device + ' has exactly one data cable')
  }
  assert.equal(paths.get('nvme-ssd').caption, undefined)
  assert.equal(paths.get('pch-sata-hdd').caption, undefined)
})

test('component zooms follow independent devices and the motherboard footprint', () => {
  const overview = SystemOverviewLayout.create('hardware', null)
  assert.deepEqual(overview.camera.from, overview.camera.to, 'opening hardware does not reveal the removed client/network/server start diagram')
  const hardware = overview.layers.find((layer) => layer.id === 'hardware')
  assert.deepEqual(hardware.scene, ServerHardwareLayout.create())
  assert.equal(overview.count, ServerHardwareLayout.componentCount)
  assert.ok(overview.camera.to.width <= hardware.reveal.endWidth)
  assert.ok(hardware.x + hardware.scene.width * hardware.scale <= overview.camera.to.x + overview.camera.to.width)
  for (const [key, bounds] of Object.entries(ServerHardwareLayout.components)) {
    const focused = SystemOverviewLayout.create(key, overview)
    const layer = focused.layers.find((candidate) => candidate.id === key + '-components')
    const left = hardware.x + bounds.x * hardware.scale
    const top = hardware.y + bounds.y * hardware.scale
    assert.ok(layer.x >= left - 0.0001 && layer.y >= top - 0.0001)
    assert.ok(layer.x + layer.scene.width * layer.scale <= left + bounds.width * hardware.scale + 0.0001)
    assert.ok(layer.y + layer.scene.height * layer.scale <= top + bounds.height * hardware.scale + 0.0001)
    assert.ok(focused.camera.to.width <= layer.reveal.endWidth)
    assert.deepEqual(focused.camera.from, overview.camera.to)
  }
})

test('external data cables and AC input cross the chassis boundary', () => {
  const scene = ServerHardwareLayout.create()
  const paths = new Map(scene.paths.map((path) => [path.id, path]))
  const regions = new Map(scene.regions.map((region) => [region.id, region]))
  assert.ok(scene.width > ServerHardwareLayout.chassis.width)
  const chassis = ServerHardwareLayout.chassis
  const leftCables = new Set(['external-display', 'external-usb', 'external-ac-power'])
  for (const id of ['external-display', 'external-lan', 'external-usb', 'external-ac-power']) {
    const path = paths.get(id)
    assert.ok(path.caption.text.length > 0)
    const left = leftCables.has(id)
    assert.ok(left ? path.caption.x < chassis.x : path.caption.x > chassis.x + chassis.width)
    assert.ok(path.caption.x >= 0 && path.caption.x < scene.width)
    assert.equal(path.directed, true)
    const route = points(path)
    assert.ok(route.some((point) => left ? point.x < chassis.x : point.x > chassis.x + chassis.width))
    assert.equal(route.length, 2, id + ' uses one straight segment')
    assert.equal(route[0].y, route[1].y)
    assert.ok(!path.dashed)
  }
  for (const id of ['external-lan', 'external-usb']) assert.equal(paths.get(id).bidirectional, true)
  assert.equal(paths.get('external-display').bidirectional, false)
  assert.ok(!paths.get('external-ac-power').dashed)
  assert.ok(touches(points(paths.get('external-ac-power')).at(-1), regions.get('psu')), 'AC ends at PSU')
  assert.ok(!paths.has('external-management-lan'))
})
