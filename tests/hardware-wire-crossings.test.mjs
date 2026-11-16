import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HardwareWireCrossings } from '../src/visualization/HardwareWireCrossings.ts'

const wire = (id, d, properties = {}) => ({ id, d, label: id, highlighted: false, ...properties })

test('crossing gaps use visible translations while preserving local wire geometry', () => {
  const paths = [
    wire('horizontal', 'M0 50H100', { translateX: 100, translateY: 20, directed: true }),
    wire('vertical', 'M150 0V100', { bidirectional: true }),
  ]
  const original = structuredClone(paths)
  const result = HardwareWireCrossings.create(paths)
  assert.deepEqual(paths, original)
  assert.deepEqual(result[0].crossingGaps, [{ x: 50, y: 50, radius: 6 }])
  assert.equal(result[1].crossingGaps, undefined)
  for (let index = 0; index < paths.length; index += 1) {
    for (const key of ['id', 'd', 'translateX', 'translateY', 'directed', 'bidirectional']) {
      assert.equal(result[index][key], paths[index][key])
    }
  }
})

test('highlight changes move the gap to the idle wire and clear stale masks', () => {
  const initial = HardwareWireCrossings.create([
    wire('horizontal', 'M0 50H100'),
    wire('vertical', 'M50 0V100'),
  ])
  assert.equal(initial[0].crossingGaps.length, 1)
  const active = HardwareWireCrossings.create([{ ...initial[0], highlighted: true }, initial[1]])
  assert.equal(active[0].crossingGaps, undefined)
  assert.deepEqual(active[1].crossingGaps, [{ x: 50, y: 50, radius: 6 }])
  assert.equal(initial[0].crossingGaps.length, 1)
})

test('shared endpoints, filled indicators, and curved or diagonal mechanisms keep their geometry', () => {
  const paths = [
    wire('data', 'M0 50H100'),
    wire('endpoint', 'M100 50V100'),
    wire('charge', 'M50 0V100', { fill: '#b5d8eb' }),
    wire('curve', 'M50 0Q80 50 50 100'),
    wire('arm', 'M0 0L100 100'),
  ]
  assert.deepEqual(HardwareWireCrossings.create(paths), paths)
})

test('relative and absolute orthogonal segments share the same crossing treatment', () => {
  const paths = [wire('horizontal', 'm10 50h100'), wire('vertical', 'M60 0L60 100')]
  const result = HardwareWireCrossings.create(paths)
  assert.deepEqual(result[0].crossingGaps, [{ x: 60, y: 50, radius: 6 }])
  assert.equal(result[0].d, paths[0].d)
  assert.equal(result[1].d, paths[1].d)
})
