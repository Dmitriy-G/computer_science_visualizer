import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MenuNavigation } from '../src/components/MainMenu/MenuNavigation.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'

test('the common-operations category contains exactly the requested structure groups', () => {
  assert.deepEqual(StructureCatalog.groups.map((group) => group.name), ['Linear', 'Trees', 'Graphs', 'Hash-based'])
  const expected = { linear: ['array', 'circular-buffer', 'deque', 'doubly-linked-list', 'linked-list', 'queue', 'stack'], trees: ['avl-tree', 'b-plus-tree', 'b-tree', 'binary-tree', 'red-black-tree'], graphs: ['graph'], 'hash-based': ['bloom-filter', 'hash-map', 'hash-set'] }
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
