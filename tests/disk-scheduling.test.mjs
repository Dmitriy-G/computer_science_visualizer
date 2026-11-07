import assert from 'node:assert/strict'
import { test } from 'node:test'
import { DiskWorkload } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Disks/DiskWorkload.ts'
import { DiskAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Disks/DiskAlgorithmCatalog.ts'
import { MqDeadlineAnimation } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Disks/MqDeadline/MqDeadlineAnimation.ts'
import { BFQAnimation } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Disks/BFQ/BFQAnimation.ts'
import { KyberAnimation } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Disks/Kyber/KyberAnimation.ts'

const request = (id, sector, direction = 'read', serviceTicks = 1, process = 1, sectors = 1) => ({ id, sector, direction, serviceTicks, process, sectors })

test('all three schedulers complete each request once with independent deterministic scenes', () => {
  assert.deepEqual(DiskAlgorithmCatalog.choices.map((choice) => choice.kind), ['bfq', 'kyber', 'mq-deadline'])
  for (const choice of DiskAlgorithmCatalog.choices) {
    const source = DiskWorkload.createDefault()
    const definition = DiskAlgorithmCatalog.definition(choice.kind)
    const plan = definition.create(source, 0)
    assert.deepEqual(source.dispatched, [])
    assert.equal(source.time, 0)
    assert.deepEqual([...plan.result.completed].sort(), source.requests.map((entry) => entry.id).sort())
    assert.equal(new Set(plan.result.dispatched).size, source.requests.length)
    assert.equal(plan.steps.at(-1).scene.count, source.requests.length)
    assert.ok(plan.steps.length <= 96)
    let previousCount = 0
    for (const step of plan.steps) {
      assert.equal(step.scene.nodes.length, source.requests.length)
      assert.equal(new Set(step.scene.nodes.map((node) => node.id)).size, source.requests.length)
      assert.ok(step.scene.count >= previousCount)
      previousCount = step.scene.count
      assert.ok(!step.scene.focusId || step.scene.nodes.some((node) => node.id === step.scene.focusId))
      assert.equal(step.scene.width, plan.steps[0].scene.width)
      assert.equal(step.scene.height, plan.steps[0].scene.height)
    }
    assert.ok(plan.steps[0].scene.nodes.every((node) => node.tone === 'default'))
    assert.ok(plan.steps.at(-1).scene.nodes.every((node) => node.tone === 'visited'))
    assert.deepEqual(definition.create(source, 0).steps, plan.steps)
    assert.notEqual(plan.steps[0].scene.nodes, plan.steps.at(-1).scene.nodes)
    assert.ok(DiskAlgorithmCatalog.describe(choice.kind).realWorldUsage.technologies.length)
    for (const entry of source.requests) {
      assert.ok(plan.result.finishedAt.get(entry.id) > plan.result.startedAt.get(entry.id))
    }
  }
})

test('mq-deadline checks expiry between batches and serves writes after read preferences', () => {
  const source = new DiskWorkload([
    request('A', 90), request('B', 10, 'read', 5), request('C', 20), request('D', 30), request('W', 50, 'write'),
  ])
  assert.deepEqual(new MqDeadlineAnimation().create(source).result.dispatched, ['B', 'C', 'A', 'W', 'D'])
  const reads = []
  for (let index = 0; index < 6; index += 1) reads.push(request(`R${index}`, index))
  reads.push(request('W', 100, 'write'))
  assert.deepEqual(new MqDeadlineAnimation().create(new DiskWorkload(reads)).result.dispatched, ['R0', 'R1', 'R2', 'R3', 'W', 'R4', 'R5'])
})

test('BFQ weights influence service while request sizes consume actual sector budgets', () => {
  const requests = []
  for (let process = 1; process <= 2; process += 1) {
    for (let index = 0; index < 8; index += 1) requests.push(request(`P${process}-${index}`, index, 'read', 1, process))
  }
  const result = new BFQAnimation().create(new DiskWorkload(requests)).result
  assert.deepEqual(result.dispatched.slice(0, 4), ['P2-0', 'P2-1', 'P2-2', 'P2-3'])
  assert.equal(result.dispatched.slice(0, 12).filter((id) => id.startsWith('P2')).length, 8)
  assert.equal(result.dispatched.slice(0, 12).filter((id) => id.startsWith('P1')).length, 4)
  const sized = new BFQAnimation().create(new DiskWorkload([
    request('P1', 1, 'read', 1, 1, 1), request('large', 2, 'read', 1, 2, 3), request('next', 3, 'read', 1, 2, 2),
  ])).result
  assert.deepEqual(sized.dispatched, ['large', 'P1', 'next'])
})

test('Kyber overlaps requests, bounds device occupancy, and adjusts depths from observations', () => {
  const plan = new KyberAnimation().create(DiskWorkload.createDefault())
  assert.ok(plan.steps.some((step) => step.scene.nodes.filter((node) => node.tone === 'active').length > 1))
  for (const step of plan.steps) assert.ok(step.scene.nodes.filter((node) => node.tone === 'active').length <= 3)
  assert.ok(plan.steps.some((step) => step.title === 'Adjust domain depths' && /depth 2 →/.test(step.description)))
  const serial = new MqDeadlineAnimation().create(DiskWorkload.createDefault()).result
  assert.ok(plan.result.time > 0)
  assert.notDeepEqual(plan.result.dispatched, serial.dispatched)
  assert.equal(plan.result.completed.length, 10)
})

test('empty, single-domain, and bounded workloads complete without mutation', () => {
  for (const choice of DiskAlgorithmCatalog.choices) {
    const definition = DiskAlgorithmCatalog.definition(choice.kind)
    for (const direction of ['read', 'write']) {
      const requests = []
      for (let index = 0; index < DiskWorkload.maximumRequests; index += 1) requests.push(request(`R${index}`, 16 - index, direction, index % 3 + 1, index % 3 + 1, index % 4 + 1))
      const plan = definition.create(new DiskWorkload(requests), 0)
      assert.equal(plan.result.completed.length, DiskWorkload.maximumRequests)
      assert.ok(plan.steps.length <= 96)
    }
    assert.equal(definition.create(new DiskWorkload([]), 0).result.time, 0)
    assert.deepEqual(definition.create(new DiskWorkload([request('one', 0)]), 0).result.completed, ['one'])
  }
  assert.throws(() => new DiskWorkload([request('duplicate', 0), request('duplicate', 1)]), /unique/)
  assert.throws(() => new DiskWorkload([request('invalid', 0, 'read', 0)]), /Service time/)
  assert.throws(() => new DiskWorkload([request('invalid', 0, 'read', 1, 1, 5)]), /length/)
  assert.throws(() => new DiskWorkload(Array.from({ length: 17 }, (_, index) => request(`R${index}`, index))), /at most 16/)
})
