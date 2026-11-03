import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MenuSearchIndex } from '../src/components/MainMenu/Search/MenuSearchIndex.ts'
import { MenuNavigation } from '../src/components/MainMenu/MenuNavigation.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { QuickSortAnimation } from '../src/components/DataStructuresAlgorithms/Sorting/Array/QuickSort/QuickSortAnimation.ts'

const index = new MenuSearchIndex((structure, action) =>
  structure === 'array' && action === 'quick-sort' ? QuickSortAnimation.describe(10) : null,
)

test('search matches names, areas of use, and technology names across words and case', () => {
  assert.ok(index.find('structures', '  SKIP   LIST ').some((result) => result.structure === 'skip-list'))
  assert.ok(index.find('structures', 'redis leaderboards').some((result) => result.structure === 'skip-list'))
  assert.ok(index.find('structures', 'maximum selection').some((result) => result.structure === 'binary-max-heap'))
  assert.ok(index.find('structures', 'Python heapq').some((result) => result.structure === 'binary-max-heap'))
  assert.ok(index.find('algorithms', 'Java').some((result) => result.action === 'quick-sort'))
  assert.ok(index.find('algorithms', 'Git').some((result) => result.action === 'depth-first'))
})

test('search ignores summaries, card descriptions, use-case explanations, and technology usage', () => {
  assert.ok(!index.find('structures', 'least').some((result) => result.structure === 'binary-max-heap'))
  assert.ok(!index.find('structures', 'seeded geometric towers').some((result) => result.structure === 'skip-list'))
  assert.ok(!index.find('structures', 'incremental insertion').some((result) => result.structure === 'skip-list'))
  assert.ok(!index.find('structures', 'interleaved').some((result) => result.structure === 'skip-list'))
  assert.ok(!index.find('algorithms', 'last-entry pivot').some((result) => result.action === 'quick-sort'))
  assert.ok(!index.find('algorithms', 'Lomuto').some((result) => result.action === 'quick-sort'))
  assert.ok(!index.find('algorithms', 'logarithmic stack space').some((result) => result.action === 'quick-sort'))
})

test('target selection separates structures from algorithms and excludes Overview operations', () => {
  const structures = index.find('structures', 'array')
  assert.ok(structures.length > 0)
  assert.ok(structures.every((result) => result.scope === 'overview' && result.action === undefined))
  const algorithms = index.find('algorithms', 'sort')
  assert.ok(algorithms.length > 0)
  assert.ok(algorithms.every((result) => result.scope !== 'overview' && result.action))
  assert.equal(index.find('structures', 'Lomuto').length, 0)
})

test('graph algorithm results retain distinct destinations with supported actions', () => {
  const results = index.find('algorithms', 'breadth-first')
  assert.ok(results.some((result) => result.structure === 'directed-graph'))
  assert.ok(results.some((result) => result.structure === 'weighted-graph'))
  assert.equal(new Set(results.map((result) => result.key)).size, results.length)
  for (const result of results) {
    const navigation = MenuNavigation.forStructure(result.structure, result.scope)
    assert.ok(navigation.getStructures().some((structure) => structure.kind === result.structure))
    assert.ok(ActionCatalog.getScopedActions(result.structure, result.scope).some((action) => action.kind === result.action))
  }
})

test('empty, unmatched, and punctuation queries produce no accidental matches', () => {
  assert.deepEqual(index.find('structures', '   '), [])
  assert.deepEqual(index.find('algorithms', ''), [])
  assert.deepEqual(index.find('structures', 'no-such-technology-93481'), [])
  assert.deepEqual(index.find('algorithms', '[.*'), [])
})

test('results use alphabetical order and searching again preserves the catalog', () => {
  const results = index.find('structures', 'tree')
  assert.ok(results.length > 1)
  for (let position = 1; position < results.length; position += 1) {
    assert.ok(results[position - 1].name.localeCompare(results[position].name, 'en', { sensitivity: 'base' }) <= 0)
  }
  index.find('algorithms', 'sort')
  assert.deepEqual(index.find('structures', 'tree'), results)
})
