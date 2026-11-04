import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { MenuStructureCatalog } from '../src/components/MainMenu/MenuStructureCatalog.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { StructurePaths } from './helpers/StructurePaths.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))

test('canonical structure folders mirror every root category and menu subject exactly once', () => {
  assert.equal(existsSync(join(root, 'src/components', 'DataStructures' + 'Overview')), false)
  const seen = new Set()
  for (const group of MenuStructureCatalog.groups) {
    const category = group.category === 'fundamental' ? 'FundamentalDataStructures' : 'AdvancedDataStructures'
    const directory = join(root, 'src/components', category, StructurePaths.groups[group.kind])
    const folders = readdirSync(directory, { withFileTypes: true }).filter((entry) => entry.isDirectory())
    assert.equal(folders.length, group.structures.length, `${category}/${group.name}`)
    for (const folder of folders) {
      const path = join(directory, folder.name)
      const kinds = new Set()
      for (const file of readdirSync(path)) {
        if (!file.endsWith('.ts')) continue
        const source = readFileSync(join(path, file), 'utf8')
        for (const match of source.matchAll(/readonly kind(?:\s*:[^=\n]+)?\s*=\s*'([^']+)'/g)) kinds.add(match[1])
      }
      if (!kinds.size) {
        kinds.add(folder.name.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
      }
      assert.equal(kinds.size, 1, folder.name)
      const [kind] = kinds
      assert.ok(group.structures.includes(kind), `${kind} belongs in ${group.name}`)
      assert.ok(!seen.has(kind), `${kind} has one canonical model folder`)
      seen.add(kind)
    }
  }
  assert.equal(seen.size, StructureCatalog.structures.length)
})

test('relative source and test imports resolve to existing paths with exact casing', () => {
  const pending = [join(root, 'src'), join(root, 'tests')]
  while (pending.length) {
    const directory = pending.pop()
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const sourcePath = join(directory, entry.name)
      if (entry.isDirectory()) {
        pending.push(sourcePath)
        continue
      }
      if (!/\.(ts|tsx|mjs|js)$/.test(entry.name)) continue
      const source = readFileSync(sourcePath, 'utf8')
      for (const match of source.matchAll(/^\s*(?:import|export)\s+(?:[^'"\r\n]*?\s+from\s*)?(['"])(\.[^'"\r\n]+)\1/gm)) {
        const target = resolve(dirname(sourcePath), match[2])
        assert.ok(existsSync(target), `${relative(root, sourcePath)} imports ${match[2]}`)
        let parent = root
        for (const part of relative(root, target).split(sep)) {
          assert.ok(readdirSync(parent).includes(part), `Exact path casing: ${target}`)
          parent = join(parent, part)
        }
      }
    }
  }
})
