import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MenuNavigation } from '../src/components/MainMenu/MenuNavigation.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'

test('the common-operations category contains exactly the requested structure groups', () => {
  assert.deepEqual(StructureCatalog.groups.map((group) => group.name), ['Linear', 'Trees', 'Graphs'])
  const expected = { linear: ['array', 'linked-list'], trees: ['binary-tree'], graphs: ['graph'] }
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

test('every structure has a complete category-to-actions path and reversible back navigation', () => {
  for (const structure of StructureCatalog.structures) {
    const root = new MenuNavigation()
    assert.equal(root.screen, 'categories')
    assert.equal(root.title, 'Categories')
    assert.deepEqual(root.getPath(null), [])

    const groups = root.selectCategory()
    assert.equal(groups.screen, 'groups')
    assert.equal(groups.title, MenuNavigation.categoryName)
    const list = groups.selectGroup(structure.group)
    assert.equal(list.screen, 'structures')
    assert.equal(list.title, StructureCatalog.getGroup(structure.group).name)

    const actions = list.selectStructure(structure.kind)
    assert.equal(actions.screen, 'actions')
    assert.deepEqual(actions.getPath(structure.kind), [
      MenuNavigation.categoryName,
      StructureCatalog.getGroup(structure.group).name,
      structure.name,
    ])
    assert.ok(ActionCatalog.getActions(structure.kind).length > 0)
    assert.deepEqual(actions.back(), list)
    assert.deepEqual(actions.back().back(), groups)
    assert.deepEqual(actions.back().back().back(), root)
    assert.deepEqual(root.back(), root)
    assert.equal(root.screen, 'categories', 'Navigation leaves earlier locations unchanged')
  }
})

test('reopening actions restores the correct group and prevents cross-group structure selection', () => {
  for (const structure of StructureCatalog.structures) {
    const actions = MenuNavigation.forStructure(structure.kind)
    assert.equal(actions.screen, 'actions')
    assert.equal(actions.back().group, structure.group)
    const available = StructureCatalog.getStructures(actions.back().group)
    assert.ok(available.some((entry) => entry.kind === structure.kind))
    assert.deepEqual(actions.back().selectStructure(structure.kind), actions)
  }
  const linear = new MenuNavigation().selectCategory().selectGroup('linear')
  assert.throws(() => linear.selectStructure('binary-tree'), /current group/)
  assert.throws(() => linear.selectStructure('graph'), /current group/)
  assert.throws(() => new MenuNavigation().selectStructure('array'), /current group/)
  assert.throws(() => new MenuNavigation('structures'), /require a group/)
})
