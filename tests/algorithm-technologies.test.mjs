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
        if (['selection-sort', 'bucket-sort', 'block-merge-sort', 'wiki-sort', 'smooth-sort', 'tree-sort', 'patience-sort', 'cycle-sort', 'comb-sort', 'cocktail-shaker-sort', 'gnome-sort', 'odd-even-sort', 'odd-even-merge-sort', 'pairwise-sorting-network', 'sample-sort'].includes(action.kind)) {
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
  assert.deepEqual([...algorithms].sort(), ['binary-insertion-sort', 'bitonic-sort', 'block-merge-sort', 'breadth-first', 'bubble-sorting', 'bucket-sort', 'cocktail-shaker-sort', 'comb-sort', 'counting-sort', 'cycle-sort', 'depth-first', 'dual-pivot-quick-sort', 'gnome-sort', 'heap-sort', 'insertion-sort', 'intro-sort', 'merge-sort', 'odd-even-merge-sort', 'odd-even-sort', 'pairwise-sorting-network', 'patience-sort', 'quick-sort', 'radix-sort', 'sample-sort', 'selection-sort', 'shell-sort', 'shortest-path', 'smooth-sort', 'tim-sort', 'topological-sort', 'tournament-sort', 'tree-sort', 'wiki-sort'])
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
