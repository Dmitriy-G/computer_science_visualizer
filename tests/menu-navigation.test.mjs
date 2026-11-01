import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MenuNavigation } from '../src/components/MainMenu/MenuNavigation.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'

test('Overview contains exactly the requested structure groups', () => {
  assert.deepEqual(StructureCatalog.groups.map((group) => group.name), ['Linear', 'Trees', 'Graphs', 'Hash-based'])
  const expected = { linear: ['array', 'circular-buffer', 'deque', 'doubly-linked-list', 'linked-list', 'queue', 'stack'], trees: ['ast', 'avl-tree', 'b-plus-tree', 'b-tree', 'binary-tree', 'fenwick-tree', 'heap', 'lsm-tree', 'r-tree', 'red-black-tree', 'segment-tree', 'trie'], graphs: ['dag', 'directed-graph', 'graph', 'multigraph', 'weighted-graph'], 'hash-based': ['bloom-filter', 'hash-map', 'hash-set'] }
  const seen = new Set()
  for (const group of StructureCatalog.groups) {
    const structures = StructureCatalog.getStructures(group.kind)
    assert.deepEqual(structures.map((structure) => structure.kind).sort(), expected[group.kind])
    for (const structure of structures) {
      assert.ok(!seen.has(structure.kind), 'Each structure belongs to one group')
      seen.add(structure.kind)
      assert.equal(StructureCatalog.getGroupForStructure(structure.kind), group.kind)
    }
  }
  assert.equal(seen.size, StructureCatalog.structures.length)
})

test('algorithm subcategories provide sorting and graph examples with reversible paths', () => {
  const root = new MenuNavigation()
  const algorithms = root.selectCategory('algorithms')
  assert.deepEqual(MenuNavigation.algorithmGroups.map((group) => group.name), ['Sorting', 'Graphs Traversal'])
  assert.equal(algorithms.title, 'Data Structures Algorithms')
  assert.deepEqual(algorithms.getStructures(), [])
  const sorting = algorithms.selectAlgorithmGroup('sorting')
  assert.equal(sorting.title, 'Sorting')
  assert.equal(sorting.actionScope, 'sorting')
  assert.deepEqual(sorting.getStructures().map((structure) => structure.kind), ['array'])
  assert.deepEqual(sorting.getPath(), ['Data Structures Algorithms', 'Sorting'])
  assert.deepEqual(sorting.back(), algorithms)
  assert.deepEqual(sorting.selectStructure('array'), sorting)
  assert.deepEqual(MenuNavigation.forStructure('array', 'sorting'), sorting)
  assert.deepEqual(sorting.back().back(), root)
  assert.throws(() => sorting.selectStructure('graph'), /current group/)
  assert.throws(() => sorting.selectGroup('linear'), /Overview/)
  assert.throws(() => MenuNavigation.forStructure('linked-list', 'sorting'), /array/)

  const graphs = algorithms.selectAlgorithmGroup('graph-traversal')
  assert.equal(graphs.title, 'Graphs Traversal')
  assert.equal(graphs.actionScope, 'graph-traversal')
  assert.deepEqual(graphs.getStructures(), StructureCatalog.getStructures('graphs'))
  assert.deepEqual(graphs.getPath(), ['Data Structures Algorithms', 'Graphs Traversal'])
  for (const graph of graphs.getStructures()) {
    const selected = graphs.selectStructure(graph.kind)
    assert.deepEqual(selected, graphs)
    assert.deepEqual(MenuNavigation.forStructure(graph.kind, selected.actionScope), graphs)
    assert.deepEqual(selected.back(), algorithms)
    assert.deepEqual(selected.back().back(), root)
  }
  assert.throws(() => graphs.selectStructure('array'), /current group/)
  assert.throws(() => graphs.selectGroup('graphs'), /Overview/)
  assert.throws(() => MenuNavigation.forStructure('array', 'graph-traversal'), /graph/)
  assert.throws(() => root.selectAlgorithmGroup('graph-traversal'), /Algorithms/)
  assert.equal(root.screen, 'categories')
  assert.equal(algorithms.screen, 'algorithms')
})

test('Sorting exposes twenty Array algorithms and keeps Overview actions separate', () => {
  const sorting = ActionCatalog.getScopedActions('array', 'sorting')
  assert.deepEqual(sorting.map((action) => action.title), ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Binary Insertion Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort', 'Shell Sort', 'Counting Sort', 'Radix Sort', 'Bucket Sort', 'TimSort', 'IntroSort', 'Dual-Pivot QuickSort', 'Block Merge Sort', 'WikiSort', 'Smoothsort', 'Tree Sort', 'Tournament Sort', 'Patience Sort'])
  for (const action of sorting) assert.ok(!ActionCatalog.getScopedActions('array', 'overview').some((choice) => choice.kind === action.kind))
  for (const structure of StructureCatalog.structures) {
    if (structure.kind !== 'array') assert.deepEqual(ActionCatalog.getScopedActions(structure.kind, 'sorting'), [])
  }
})

test('graph algorithm actions move to traversal while Overview retains editing and search', () => {
  const moved = new Set(['breadth-first', 'depth-first', 'shortest-path', 'topological-sort'])
  for (const graph of StructureCatalog.getStructures('graphs')) {
    const overview = ActionCatalog.getScopedActions(graph.kind, 'overview').map((action) => action.kind)
    const traversal = ActionCatalog.getScopedActions(graph.kind, 'graph-traversal').map((action) => action.kind)
    assert.ok(overview.includes('add-vertex') && overview.includes('add-edge') && overview.includes('search-value') && overview.includes('clear'))
    assert.ok(overview.every((action) => !moved.has(action)))
    assert.ok(traversal.every((action) => moved.has(action)))
    assert.ok(traversal.includes('breadth-first') && traversal.includes('depth-first'))
    assert.equal(traversal.includes('shortest-path'), graph.kind === 'weighted-graph')
    assert.equal(traversal.includes('topological-sort'), graph.kind === 'dag')
    assert.deepEqual([...overview, ...traversal].sort(), ActionCatalog.getActions(graph.kind).map((action) => action.kind).sort())
    assert.equal(new Set([...overview, ...traversal]).size, overview.length + traversal.length)
  }
  for (const structure of StructureCatalog.structures) {
    if (structure.group === 'graphs') continue
    assert.deepEqual(ActionCatalog.getScopedActions(structure.kind, 'overview'), ActionCatalog.getActions(structure.kind))
    assert.deepEqual(ActionCatalog.getScopedActions(structure.kind, 'graph-traversal'), [])
  }
})

test('structure selection retains its group path and reversible back navigation', () => {
  for (const structure of StructureCatalog.structures) {
    const root = new MenuNavigation()
    assert.equal(root.screen, 'categories')
    assert.equal(root.title, 'Categories')
    assert.deepEqual(root.getPath(), [])

    const groups = root.selectCategory()
    assert.equal(groups.screen, 'groups')
    assert.equal(groups.title, MenuNavigation.categoryName)
    const list = groups.selectGroup(structure.group)
    assert.equal(list.screen, 'structures')
    assert.equal(list.title, StructureCatalog.getGroup(structure.group).name)

    const selected = list.selectStructure(structure.kind)
    assert.equal(selected.screen, 'structures')
    assert.deepEqual(selected, list)
    assert.deepEqual(selected.getPath(), [
      MenuNavigation.categoryName,
      StructureCatalog.getGroup(structure.group).name,
    ])
    assert.ok(ActionCatalog.getActions(structure.kind).length > 0)
    assert.deepEqual(selected.back(), groups)
    assert.deepEqual(selected.back().back(), root)
    assert.deepEqual(root.back(), root)
    assert.equal(root.screen, 'categories', 'Navigation leaves earlier locations unchanged')
  }
})

test('reopening the structure picker restores its group and prevents cross-group selection', () => {
  for (const structure of StructureCatalog.structures) {
    const picker = MenuNavigation.forStructure(structure.kind)
    assert.equal(picker.screen, 'structures')
    assert.equal(picker.group, structure.group)
    const available = StructureCatalog.getStructures(picker.group)
    assert.ok(available.some((entry) => entry.kind === structure.kind))
    assert.deepEqual(picker.selectStructure(structure.kind), picker)
  }
  const linear = new MenuNavigation().selectCategory().selectGroup('linear')
  assert.throws(() => linear.selectStructure('binary-tree'), /current group/)
  assert.throws(() => linear.selectStructure('graph'), /current group/)
  assert.throws(() => new MenuNavigation().selectStructure('array'), /current group/)
  assert.throws(() => new MenuNavigation('structures'), /require a group/)
})
