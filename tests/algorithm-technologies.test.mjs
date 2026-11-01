import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { AlgorithmTechnologyCatalog } from '../src/visualization/AlgorithmTechnologyCatalog.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'

test('every algorithm has verified sources or an explicit no-verified-use notice', () => {
  const algorithms = new Set()
  for (const scope of ['sorting', 'graph-traversal']) {
    for (const structure of StructureCatalog.structures) {
      for (const action of ActionCatalog.getScopedActions(structure.kind, scope)) {
        const usage = AlgorithmTechnologyCatalog.get(structure.kind, action.kind, scope)
        assert.ok(usage, `${structure.kind} / ${action.kind} has real-world information`)
        if (action.kind === 'selection-sort' || action.kind === 'bucket-sort' || action.kind === 'block-merge-sort') {
          assert.deepEqual(usage.technologies, [])
          assert.deepEqual(usage.products, [])
          assert.match(usage.note, /No production use.*verified/)
        } else {
          assert.ok(usage.technologies.length > 0, `${action.kind} has a verified implementation`)
          assert.ok(usage.products.length > 0, `${action.kind} has a verified product use`)
        }
        assert.ok(usage.note)
        for (const examples of [usage.technologies, usage.products]) {
          const links = new Set()
          for (const example of examples) {
            assert.ok(example.name && example.usage)
            assert.equal(new URL(example.url).protocol, 'https:')
            assert.ok(!links.has(example.url))
            links.add(example.url)
          }
        }
        algorithms.add(action.kind)
      }
    }
  }
  assert.deepEqual([...algorithms].sort(), ['binary-insertion-sort', 'block-merge-sort', 'breadth-first', 'bubble-sorting', 'bucket-sort', 'counting-sort', 'depth-first', 'dual-pivot-quick-sort', 'heap-sort', 'insertion-sort', 'intro-sort', 'merge-sort', 'quick-sort', 'radix-sort', 'selection-sort', 'shell-sort', 'shortest-path', 'tim-sort', 'topological-sort'])
})

test('Overview operations never receive algorithm technology examples', () => {
  for (const structure of StructureCatalog.structures) {
    for (const action of ActionCatalog.getActions(structure.kind)) {
      assert.equal(AlgorithmTechnologyCatalog.get(structure.kind, action.kind, 'overview'), null)
    }
  }
  assert.equal(AlgorithmTechnologyCatalog.get('array', 'bubble-sorting', 'overview'), null)
})

test('examples are limited to algorithms offered by the selected structure and scope', () => {
  assert.equal(AlgorithmTechnologyCatalog.get('array', 'clear', 'sorting'), null)
  assert.equal(AlgorithmTechnologyCatalog.get('graph', 'add-edge', 'graph-traversal'), null)
  assert.equal(AlgorithmTechnologyCatalog.get('graph', 'shortest-path', 'graph-traversal'), null)
  assert.equal(AlgorithmTechnologyCatalog.get('weighted-graph', 'topological-sort', 'graph-traversal'), null)
  assert.equal(AlgorithmTechnologyCatalog.get('linked-list', 'bubble-sorting', 'sorting'), null)
  assert.equal(AlgorithmTechnologyCatalog.get('array', 'bubble-sorting', 'graph-traversal'), null)
})
