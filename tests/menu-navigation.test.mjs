import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MenuStructureCatalog } from '../src/components/MainMenu/MenuStructureCatalog.ts'
import { MenuNavigation } from '../src/components/MainMenu/MenuNavigation.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { ActionOrdering } from '../src/components/MainMenu/ActionMenu/ActionOrdering.ts'
import { ShellSortAnimation } from '../src/components/DataStructuresAlgorithms/Sorting/Array/ShellSort/ShellSortAnimation.ts'

test('algorithm action ordering is alphabetical by default without changing catalog order', () => {
  const actions = ActionCatalog.getScopedActions('array', 'sorting')
  const original = [...actions]
  const ordered = ActionOrdering.arrange(actions, 'alphabetical', () => { throw new Error('Alphabetical order must not need complexity information') })
  assert.equal(ordered[0].title, 'American Flag Sort')
  assert.equal(ordered.at(-1).title, 'WikiSort')
  assert.ok(ordered.findIndex((action) => action.title === 'Binary Insertion Sort') < ordered.findIndex((action) => action.title === 'Bitonic Sort'))
  assert.deepEqual(actions, original)
  assert.notEqual(ordered, actions)
})

test('average time and memory use separate growth orders with alphabetical ties', () => {
  const actions = [
    { kind: 'shell-sort', title: 'Shell Sort' },
    { kind: 'quick-sort', title: 'Quick Sort' },
    { kind: 'cycle-sort', title: 'Cycle Sort' },
    { kind: 'counting-sort', title: 'Counting Sort' },
    { kind: 'bogo-sort', title: 'Bogo Sort' },
    { kind: 'american-flag-sort', title: 'American Flag Sort' },
  ]
  const costs = new Map([
    ['shell-sort', [ShellSortAnimation.describe(12).time.average, ShellSortAnimation.describe(12).memory.average]],
    ['quick-sort', ['O(n log n)', 'O(log n)']],
    ['cycle-sort', ['O(n²)', 'O(1)']],
    ['counting-sort', ['O(n + k)', 'O(n + k)']],
    ['bogo-sort', ['O(n · n!)', 'O(n)']],
    ['american-flag-sort', ['O(nd)', 'O(d)']],
  ])
  const calls = new Map()
  const describe = (action) => {
    calls.set(action, (calls.get(action) ?? 0) + 1)
    const [time, memory] = costs.get(action)
    return { time: { average: time }, memory: { average: memory } }
  }
  const original = [...actions]
  assert.deepEqual(ActionOrdering.arrange(actions, 'average-time', describe).map((action) => action.title), ['American Flag Sort', 'Counting Sort', 'Quick Sort', 'Shell Sort', 'Cycle Sort', 'Bogo Sort'])
  assert.ok([...calls.values()].every((count) => count === 1))
  calls.clear()
  assert.deepEqual(ActionOrdering.arrange(actions, 'average-memory', describe).map((action) => action.title), ['American Flag Sort', 'Cycle Sort', 'Shell Sort', 'Quick Sort', 'Bogo Sort', 'Counting Sort'])
  assert.ok([...calls.values()].every((count) => count === 1))
  assert.deepEqual(actions, original)
})

test('recursive, factorial, graph, and unavailable bounds receive explicit ordering', () => {
  const fixtures = [
    ['bogo-sort', 'Bogo Sort', 'O(n · n!)'],
    ['slow-sort', 'Slow Sort', 'O(n^(log₂ n))'],
    ['stooge-sort', 'Stooge Sort', 'O(n^2.71)'],
    ['bitonic-sort', 'Bitonic Sort', 'O(n log² n)'],
    ['quick-sort', 'Quick Sort', 'O(n log n)'],
    ['heap-sort', 'Heap Sort', null],
  ]
  const actions = fixtures.map(([kind, title]) => ({ kind, title }))
  const costs = new Map(fixtures.map(([kind, , cost]) => [kind, cost]))
  const describe = (action) => costs.get(action) ? { time: { average: costs.get(action) } } : null
  assert.deepEqual(ActionOrdering.arrange(actions, 'average-time', describe).map((action) => action.kind), ['quick-sort', 'bitonic-sort', 'stooge-sort', 'slow-sort', 'bogo-sort', 'heap-sort'])
  const graph = [{ kind: 'shortest-path', title: 'Dijkstra shortest path' }, { kind: 'depth-first', title: 'Depth-first traversal' }, { kind: 'breadth-first', title: 'Breadth-first traversal' }]
  assert.deepEqual(ActionOrdering.arrange(graph, 'average-time', (action) => ({ time: { average: action === 'shortest-path' ? 'O(V^2 + E)' : 'O(V + E)' } })).map((action) => action.kind), ['breadth-first', 'depth-first', 'shortest-path'])
})

test('canonical storage groups retain their existing structure membership', () => {
  assert.deepEqual(StructureCatalog.groups.map((group) => group.name), ['Linear', 'Queue / Priority', 'Trees', 'String / Text', 'Graphs', 'Set / Union', 'Hash-based', 'Probabilistic'])
  const expected = {
    linear: ['dense-tensor', 'sparse-coo', 'sparse-csc', 'numerical-csr', 'grid-2d', 'append-only-log', 'xarray', 'fanout-array', 'flat-vector-array', 'request-tag-array', 'array', 'doubly-linked-list', 'free-list', 'linked-list', 'skip-list', 'sparse-array', 'stack', 'unrolled-linked-list', 'xor-linked-list'],
    'queue-priority': ['multi-queue', 'lock-free-ring', 'binary-max-heap', 'binomial-heap', 'circular-buffer', 'deque', 'fibonacci-heap', 'heap', 'indexed-priority-queue', 'leftist-heap', 'monotonic-queue', 'pairing-heap', 'priority-queue', 'queue', 'skew-heap'],
    trees: ['brin', 'sstable', 'sparse-primary-index', 'sparse-offset-index', 'time-index', 'ivf-index', 'gist', 'bkd-tree', 'ball-tree', 'maple-tree', 'checksummed-block-tree',
      'aa-tree', 'ast', 'avl-tree', 'b-plus-tree', 'b-tree', 'binary-tree', 'bvh',
      'cartesian-tree', 'complete-binary-tree', 'fenwick-tree', 'general-tree',
      'interval-tree', 'kd-tree', 'lsm-tree', 'merkle-tree', 'octree',
      'order-statistic-tree', 'persistent-segment-tree', 'quadtree', 'r-tree',
      'red-black-tree', 'scapegoat-tree', 'segment-tree',
      'sparse-table', 'splay-tree',
      'threaded-binary-tree', 'treap', 'two-three-four-tree',
      'two-three-tree', 'unordered-binary-tree', 'van-emde-boas-tree',
    ],
    'string-text': ['inverted-index', 'aho-corasick-automaton', 'dawg', 'fm-index', 'gap-buffer', 'radix-tree', 'rope', 'suffix-array', 'suffix-automaton', 'suffix-tree', 'ternary-search-tree', 'trie'],
    graphs: ['hnsw-graph', 'compacted-de-bruijn-graph', 'address-space-graph', 'adjacency-list', 'adjacency-matrix', 'bipartite-graph', 'complete-graph', 'compressed-sparse-row', 'dag', 'directed-graph', 'edge-list', 'flow-network', 'functional-graph', 'graph', 'hypergraph', 'multigraph', 'tree-graph', 'weighted-graph'],
    'set-union': ['bit-set', 'disjoint-set', 'hash-set', 'interval-set', 'multiset', 'ordered-set'],
    'hash-based': ['content-addressed-layers', 'lsh-index', 'minimizer-index', 'consistent-hashing-ring', 'cuckoo-hash-table', 'extendible-hashing', 'hash-map', 'hopscotch-hashing', 'linear-hashing', 'open-addressing-hash-table', 'perfect-hash-table', 'robin-hood-hash-table', 'separate-chaining-hash-table'],
    probabilistic: ['blocked-bloom-filter', 'bloom-filter', 'count-min-sketch', 'counting-bloom-filter', 'cuckoo-filter', 'hyperloglog', 'quotient-filter', 'reservoir-sampling-buffer'],
  }
  const seen = new Set()
  for (const group of StructureCatalog.groups) {
    const structures = StructureCatalog.getStructures(group.kind)
    assert.deepEqual(structures.map((structure) => structure.kind).sort(), [...expected[group.kind]].sort())
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

test('Sorting exposes forty-eight Array algorithms and keeps Overview actions separate', () => {
  const sorting = ActionCatalog.getScopedActions('array', 'sorting')
  assert.deepEqual(sorting.map((action) => action.title), ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Binary Insertion Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort', 'Shell Sort', 'Counting Sort', 'Radix Sort', 'Bucket Sort', 'TimSort', 'IntroSort', 'Dual-Pivot QuickSort', 'Block Merge Sort', 'WikiSort', 'Smoothsort', 'Tree Sort', 'Tournament Sort', 'Patience Sort', 'Cycle Sort', 'Comb Sort', 'Cocktail Shaker Sort', 'Gnome Sort', 'Odd-Even Sort', 'Odd-Even Merge Sort', 'Bitonic Sort', 'Pairwise Sorting Network', 'Sample Sort', 'Parallel Merge Sort', 'Parallel QuickSort', 'External Merge Sort', 'Polyphase Merge Sort', 'Natural Merge Sort', 'Flashsort', 'American Flag Sort', 'Spreadsort', 'Burstsort', 'Pigeonhole Sort', 'Interpolation Sort', 'Library Sort', 'Splay Sort', 'Strand Sort', 'Pancake Sort', 'Stooge Sort', 'Slow Sort', 'Bogo Sort', 'Sleep Sort'])
  for (const action of sorting) assert.ok(!ActionCatalog.getScopedActions('array', 'overview').some((choice) => choice.kind === action.kind))
  for (const structure of StructureCatalog.structures) {
    if (structure.kind !== 'array') assert.deepEqual(ActionCatalog.getScopedActions(structure.kind, 'sorting'), [])
  }
})

test('graph algorithm actions move to traversal while Overview retains editing and search', () => {
  const moved = new Set(['breadth-first', 'depth-first', 'shortest-path', 'topological-sort', 'max-flow'])
  for (const graph of StructureCatalog.getStructures('graphs')) {
    const overview = ActionCatalog.getScopedActions(graph.kind, 'overview').map((action) => action.kind)
    const traversal = ActionCatalog.getScopedActions(graph.kind, 'graph-traversal').map((action) => action.kind)
    assert.ok(overview.includes('search-value') && overview.includes('clear'))
    if (!['hnsw-graph', 'compacted-de-bruijn-graph'].includes(graph.kind)) assert.ok(overview.includes('add-vertex'))
    assert.equal(overview.includes('add-edge'), !['complete-graph', 'tree-graph', 'hnsw-graph', 'compacted-de-bruijn-graph'].includes(graph.kind))
    assert.ok(overview.every((action) => !moved.has(action)))
    assert.ok(traversal.every((action) => moved.has(action)))
    assert.ok(traversal.includes('breadth-first') && traversal.includes('depth-first'))
    assert.equal(traversal.includes('shortest-path'), graph.kind === 'weighted-graph')
    assert.equal(traversal.includes('topological-sort'), graph.kind === 'dag')
    assert.equal(traversal.includes('max-flow'), graph.kind === 'flow-network')
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

    const group = MenuStructureCatalog.getGroupForStructure(structure.kind)
    const groups = root.selectCategory(group.category)
    assert.equal(groups.screen, 'groups')
    assert.equal(groups.title, group.category === 'fundamental' ? MenuNavigation.categoryName : MenuNavigation.advancedCategoryName)
    const list = groups.selectGroup(group.kind)
    assert.equal(list.screen, 'structures')
    assert.equal(list.title, group.name)

    const selected = list.selectStructure(structure.kind)
    assert.equal(selected.screen, 'structures')
    assert.deepEqual(selected, list)
    assert.deepEqual(selected.getPath(), [
      groups.title,
      group.name,
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
    const group = MenuStructureCatalog.getGroupForStructure(structure.kind)
    assert.equal(picker.group, group.kind)
    assert.equal(picker.category, group.category)
    const available = MenuStructureCatalog.getStructures(picker.group)
    assert.ok(available.some((entry) => entry.kind === structure.kind))
    assert.deepEqual(picker.selectStructure(structure.kind), picker)
  }
  const linear = new MenuNavigation().selectCategory().selectGroup('linear')
  assert.throws(() => linear.selectStructure('binary-tree'), /current group/)
  assert.throws(() => linear.selectStructure('graph'), /current group/)
  assert.throws(() => new MenuNavigation().selectStructure('array'), /current group/)
  assert.throws(() => new MenuNavigation('structures'), /require a group/)
})

test('root categories split structures and reject groups from another category', () => {
  assert.deepEqual(MenuNavigation.categories.map((category) => category.name), [
    'Fundamental Data Structures', 'Data Structures Algorithms', 'Advanced Data Structures', 'Real Systems Algorithms',
  ])
  const root = new MenuNavigation()
  const fundamental = root.selectCategory('fundamental')
  const advanced = root.selectCategory('advanced')
  assert.equal(fundamental.getGroups().length, 7)
  assert.equal(advanced.getGroups().length, 15)
  assert.equal(advanced.getGroups().at(-1).name, 'Probabilistic')
  assert.throws(() => fundamental.selectGroup('sequence-variants'), /current category/)
  assert.throws(() => advanced.selectGroup('linear'), /current category/)
  assert.deepEqual(advanced.back(), root)
  assert.deepEqual(fundamental.back(), root)
})

test('advanced hardware categories have reversible paths and no structure selection', () => {
  const root = new MenuNavigation()
  const advanced = root.selectCategory('advanced-algorithms')
  assert.equal(advanced.title, 'Real Systems Algorithms')
  assert.deepEqual(advanced.getAdvancedAlgorithmGroups().map((group) => group.name), ['Hardware', 'Network'])
  assert.deepEqual(advanced.getPath(), ['Real Systems Algorithms'])
  assert.deepEqual(advanced.back(), root)
  const hardware = advanced.selectAdvancedAlgorithmGroup('hardware')
  assert.deepEqual(hardware.getAdvancedAlgorithmGroups().map((group) => group.name), ['Fundamental', 'Complex'])
  assert.equal(hardware.backLabel, 'Real Systems Algorithms')
  assert.deepEqual(hardware.back(), advanced)
  const fundamental = hardware.selectAdvancedAlgorithmGroup('hardware-fundamental')
  assert.deepEqual(fundamental.getAdvancedAlgorithmGroups().map((group) => group.name), ['Disks', 'Memory', 'CPU'])
  assert.deepEqual(fundamental.back(), hardware)
  for (const kind of ['disks', 'memory', 'cpu']) {
    const leaf = fundamental.selectAdvancedAlgorithmGroup(kind)
    assert.deepEqual(leaf.getPath(), ['Real Systems Algorithms', 'Hardware', 'Fundamental', leaf.title])
    assert.equal(leaf.backLabel, 'Fundamental')
    assert.deepEqual(leaf.back(), fundamental)
    assert.deepEqual(leaf.back().back().back().back(), root)
    assert.deepEqual(leaf.getAdvancedAlgorithmGroups(), [])
    assert.deepEqual(leaf.getStructures(), [])
    assert.deepEqual(leaf.getGroups(), [])
    assert.throws(() => leaf.selectStructure('array'), /current group/)
    assert.deepEqual(leaf.getDiskAlgorithms().map((algorithm) => algorithm.kind), kind === 'disks' ? ['bfq', 'kyber', 'mq-deadline'] : [])
    assert.equal(leaf.getCpuAlgorithms().length, kind === 'cpu' ? 4 : 0)
  }
  const complex = hardware.selectAdvancedAlgorithmGroup('hardware-complex')
  assert.equal(complex.title, 'Complex')
  assert.deepEqual(complex.getAdvancedAlgorithmGroups(), [])
  assert.deepEqual(complex.back(), hardware)
})

test('advanced network categories follow OSI layer order and preserve their parent', () => {
  const advanced = new MenuNavigation().selectCategory('advanced-algorithms')
  const network = advanced.selectAdvancedAlgorithmGroup('network')
  assert.deepEqual(network.getAdvancedAlgorithmGroups().map((group) => group.name), ['Fundamental', 'Complex'])
  const fundamental = network.selectAdvancedAlgorithmGroup('network-fundamental')
  assert.deepEqual(fundamental.getAdvancedAlgorithmGroups().map((group) => group.name), [
    'Physical', 'Data Link', 'Network', 'Transport', 'Session', 'Presentation', 'Application',
  ])
  for (const group of fundamental.getAdvancedAlgorithmGroups()) {
    const layer = fundamental.selectAdvancedAlgorithmGroup(group.kind)
    assert.equal(layer.title, group.name)
    assert.deepEqual(layer.getPath(), ['Real Systems Algorithms', 'Network', 'Fundamental', group.name])
    assert.equal(layer.backLabel, 'Fundamental')
    assert.deepEqual(layer.back(), fundamental)
    assert.deepEqual(layer.getAdvancedAlgorithmGroups(), [])
    assert.deepEqual(layer.getStructures(), [])
  }
  assert.deepEqual(network.back(), advanced)
  const complex = network.selectAdvancedAlgorithmGroup('network-complex')
  assert.deepEqual(complex.getAdvancedAlgorithmGroups(), [])
  assert.deepEqual(complex.getDiskAlgorithms(), [])
  assert.deepEqual(complex.getCpuAlgorithms(), [])
  assert.deepEqual(complex.back(), network)
})

test('advanced algorithm navigation rejects skipped levels and unrelated branches', () => {
  const root = new MenuNavigation()
  const advanced = root.selectCategory('advanced-algorithms')
  const hardware = advanced.selectAdvancedAlgorithmGroup('hardware')
  const network = advanced.selectAdvancedAlgorithmGroup('network')
  assert.throws(() => root.selectAdvancedAlgorithmGroup('hardware'), /Real Systems Algorithms/)
  assert.throws(() => root.selectCategory('algorithms').selectAdvancedAlgorithmGroup('network'), /Real Systems Algorithms/)
  assert.throws(() => advanced.selectAdvancedAlgorithmGroup('cpu'), /current category/)
  assert.throws(() => hardware.selectAdvancedAlgorithmGroup('physical'), /current category/)
  assert.throws(() => network.selectAdvancedAlgorithmGroup('memory'), /current category/)
  assert.throws(() => hardware.selectAdvancedAlgorithmGroup('disks'), /current category/)
  assert.throws(() => hardware.selectAdvancedAlgorithmGroup('network-fundamental'), /current category/)
  assert.throws(() => advanced.selectGroup('linear'), /Overview/)
  assert.throws(() => advanced.selectAlgorithmGroup('sorting'), /Algorithms/)
  assert.deepEqual(root.getAdvancedAlgorithmGroups(), [])
  assert.deepEqual(hardware.getPath(), ['Real Systems Algorithms', 'Hardware'])
})

test('every implemented structure belongs to one menu track and subject', () => {
  const seen = new Set()
  for (const group of MenuStructureCatalog.groups) {
    assert.ok(group.structures.length > 0)
    const structures = MenuStructureCatalog.getStructures(group.kind)
    assert.equal(structures.length, group.structures.length)
    for (const structure of structures) {
      assert.ok(!seen.has(structure.kind), `${structure.name} appears only once`)
      seen.add(structure.kind)
      const picker = MenuNavigation.forStructure(structure.kind)
      assert.equal(picker.group, group.kind)
      assert.equal(picker.category, group.category)
    }
  }
  assert.equal(seen.size, StructureCatalog.structures.length)
})
